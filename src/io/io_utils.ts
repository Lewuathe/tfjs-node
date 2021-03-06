/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tfc from '@tensorflow/tfjs-core';

/**
 * Convert an ArrayBuffer to a Buffer.
 */
export function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  view.forEach((value, i) => {
    buf[i] = value;
  });
  return buf;
}

/**
 * Convert a Buffer or an Array of Buffers to an ArrayBuffer.
 *
 * If the input is an Array of Buffers, they will be concatenated in the
 * specified order to form the output ArrayBuffer.
 */
export function toArrayBuffer(buf: Buffer|Buffer[]): ArrayBuffer {
  if (Array.isArray(buf)) {
    // An Array of Buffers.
    let totalLength = 0;
    buf.forEach(buffer => {
      totalLength += buffer.length;
    });

    const ab = new ArrayBuffer(totalLength);
    const view = new Uint8Array(ab);
    let pos = 0;
    buf.forEach(buffer => {
      for (let i = 0; i < buffer.length; ++i) {
        view[pos++] = buffer[i];
      }
    });
    return ab;
  } else {
    // A single Buffer.
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  }
}

// TODO(cais): Use explicit tfc.io.ModelArtifactsInfo return type below once it
// is available.
/**
 * Populate ModelArtifactsInfo fields for a model with JSON topology.
 * @param modelArtifacts
 * @returns A ModelArtifactsInfo object.
 */
export function getModelArtifactsInfoForJSON(
    modelArtifacts: tfc.io.ModelArtifacts) {
  if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
    throw new Error('Expected JSON model topology, received ArrayBuffer.');
  }
  return {
    dateSaved: new Date(),
    modelTopologyType: 'JSON',
    modelTopologyBytes: modelArtifacts.modelTopology == null ?
        0 :
        Buffer.byteLength(JSON.stringify(modelArtifacts.modelTopology), 'utf8'),
    weightSpecsBytes: modelArtifacts.weightSpecs == null ?
        0 :
        Buffer.byteLength(JSON.stringify(modelArtifacts.weightSpecs), 'utf8'),
    weightDataBytes: modelArtifacts.weightData == null ?
        0 :
        modelArtifacts.weightData.byteLength,
  };
}

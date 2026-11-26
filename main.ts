// Writes this entry's image to /output/entry.png. The image is a newspaper
// front page summing up the world's news of Thursday 26 November 2026: the
// US proposes new tariffs on 14 trading partners, Kim Jong Un vows wider
// deployment of tactical nuclear weapons, Houthi attacks hit Saudi ports and
// the Ras Tanura refinery, a fuel tanker fire on Cairo's ring road kills at
// least 31, and Pakistan's first astronaut boards China's Tiangong station.
// The image is copied byte for byte, so both runs of the program write
// identical bytes. No network is used.
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const src = join(here, 'entry.png');
const dst = join(outDir, 'entry.png');

// Fail fast if the bundled image is missing, empty, or over the 1 MiB cap,
// instead of copying a bad file and shipping a non-compliant entry.
const MAX_BYTES = 1024 * 1024;
const srcStat = statSync(src);
if (!srcStat.isFile()) {
  throw new Error(`entry.png is not a regular file: ${src}`);
}
if (srcStat.size === 0) {
  throw new Error(`entry.png is empty: ${src}`);
}
if (srcStat.size > MAX_BYTES) {
  throw new Error(`entry.png is ${srcStat.size} bytes, over the ${MAX_BYTES} byte cap`);
}

// Returns the pixel dimensions from the image header. Handles PNG (IHDR)
// and JPEG (baseline/progressive SOF markers); anything else is rejected.
function readImageSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  // PNG: 8-byte signature, then IHDR chunk with width/height at offset 16.
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: SOI marker, then segments until a SOF marker gives height/width.
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 <= buf.length) {
      if (buf[offset] !== 0xff) {
        throw new Error(`entry.png: bad JPEG marker at offset ${offset}`);
      }
      let marker = buf[offset + 1];
      // Skip fill bytes (extra 0xff) before the marker.
      while (marker === 0xff) {
        offset += 1;
        marker = buf[offset + 1];
      }
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      if (marker === 0xd9) break; // EOI: no SOF found
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
        offset += 2; // standalone marker, no length field
        continue;
      }
      const length = buf.readUInt16BE(offset + 2);
      if (length < 2) {
        throw new Error(`entry.png: bad JPEG segment length at offset ${offset}`);
      }
      offset += 2 + length;
    }
    throw new Error('entry.png: no JPEG SOF marker found');
  }
  throw new Error('entry.png: unrecognised image format (expected PNG or JPEG header)');
}

// Read the image's own header and require 1024x1024 before copying.
const { width, height } = readImageSize(src);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}, expected 1024x1024`);
}

copyFileSync(src, dst);

const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
if (srcSize !== dstSize) {
  throw new Error(`entry.png copy incomplete: ${dstSize} of ${srcSize} bytes`);
}

// A size match alone cannot catch a corrupted copy, so compare content
// hashes as well: the output must be byte-identical to the source.
const srcHash = sha256File(src);
const dstHash = sha256File(dst);
if (srcHash !== dstHash) {
  throw new Error(`entry.png copy mismatch: sha256 ${dstHash}, expected ${srcHash}`);
}

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

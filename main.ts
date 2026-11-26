// Writes this entry's image to /output/entry.png. The image is a newspaper
// front page summing up the world's news of Thursday 26 November 2026: the
// US proposes new tariffs on 14 trading partners, Kim Jong Un vows wider
// deployment of tactical nuclear weapons, Houthi attacks hit Saudi ports and
// the Ras Tanura refinery, a fuel tanker fire on Cairo's ring road kills at
// least 31, and Pakistan's first astronaut boards China's Tiangong station.
// The image is copied byte for byte, so both runs of the program write
// identical bytes. No network is used.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const src = join(here, 'entry.png');
const dst = join(outDir, 'entry.png');
copyFileSync(src, dst);

const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
if (srcSize !== dstSize) {
  throw new Error(`entry.png copy incomplete: ${dstSize} of ${srcSize} bytes`);
}

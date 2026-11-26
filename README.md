[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/Masque999/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/Masque999/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# news-image-20261126

One image summing up the world's news of Thursday 26 November 2026, as a newspaper front page: the US proposes new tariffs on 14 trading partners including China, the EU, Japan and India; Kim Jong Un vows wider deployment of tactical nuclear weapons; Houthi attacks hit Saudi ports and the Ras Tanura refinery; a fuel tanker fire on Cairo's ring road kills at least 31; and Pakistan's first astronaut boards China's Tiangong space station. `main.ts` copies the image to `/output/entry.png`.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program copies `entry.png` (a 1024×1024 JPEG, 272,180 bytes) byte for byte, so repeated runs write identical bytes.

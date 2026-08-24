# Visual Diff Script

Simple Playwright script to compare local vs production pages using screenshots.

- Picks a random sample of materials from `materials.json`

Configuration params can be found inside screengrab_compare.
There is no CI/CD dependancy on this as of current and is currently a manual sanity check.

## Install

```bash
npm install
npx playwright install
```

## Run

```
node ./screengrab_compare.js
```

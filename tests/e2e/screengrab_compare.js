const { chromium } = require("playwright");
const pixelmatch = require("pixelmatch").default;
const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const materials = require("./materials.json");

// ================= CONFIG =================

const CONCURRENCY = 4;
const SAMPLE_SIZE = 300; // around 1% of total structures

const CLIP = {
  x: 50,
  y: 350,
  width: 700,
  height: 600,
};

const DIFF_THRESHOLD = 100;

const LOCALURL = `http://localhost:5173/details`;
const PRODURL = `https://mc3d.materialscloud.org/details`;

// =========================================

const outputDir = path.join(__dirname, "diffs");
fs.mkdirSync(outputDir, { recursive: true });

const summary = [];

// Fisher-Yates sample
function sample(array, n) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, n);
}

const testMaterials =
  SAMPLE_SIZE >= materials.length ? materials : sample(materials, SAMPLE_SIZE);

function cropToCommonSize(img1, img2) {
  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);

  const crop = (img) => {
    const cropped = new PNG({ width, height });

    PNG.bitblt(img, cropped, 0, 0, width, height, 0, 0);

    return cropped;
  };

  return {
    width,
    height,
    img1: crop(img1),
    img2: crop(img2),
  };
}

async function processMaterial(browser, material) {
  const id = material.id;

  const localUrl = `${LOCALURL}/${id}`;
  const prodUrl = `${PRODURL}/${id}`;
  const localPage = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1200,
    },
  });

  const prodPage = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1200,
    },
  });

  try {
    console.log(`Checking ${id}`);

    await Promise.all([
      localPage.goto(localUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      }),
      prodPage.goto(prodUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      }),
    ]);

    await Promise.all([
      localPage.waitForTimeout(1000),
      prodPage.waitForTimeout(1000),
    ]);

    const [localBuffer, prodBuffer] = await Promise.all([
      localPage.screenshot({
        clip: CLIP,
      }),
      prodPage.screenshot({
        clip: CLIP,
      }),
    ]);

    const localImage = PNG.sync.read(localBuffer);
    const prodImage = PNG.sync.read(prodBuffer);

    const width = Math.min(localImage.width, prodImage.width);
    const height = Math.min(localImage.height, prodImage.height);

    const crop = (img) => {
      const out = new PNG({ width, height });

      PNG.bitblt(img, out, 0, 0, width, height, 0, 0);

      return out;
    };

    const img1 = crop(localImage);
    const img2 = crop(prodImage);

    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      {
        threshold: 0.1,
      },
    );

    summary.push({
      id,
      diffPixels,
      error: "",
    });

    const safeId = id.replace(/\//g, "_");
    const dir = path.join(outputDir, safeId);

    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, "local.png"), localBuffer);

    fs.writeFileSync(path.join(dir, "prod.png"), prodBuffer);

    fs.writeFileSync(path.join(dir, "diff.png"), PNG.sync.write(diff));

    fs.writeFileSync(
      path.join(dir, "meta.json"),
      JSON.stringify(
        {
          id,
          diffPixels,
          clip: CLIP,
          local: {
            width: localImage.width,
            height: localImage.height,
          },
          prod: {
            width: prodImage.width,
            height: prodImage.height,
          },
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(`Failed ${id}: ${error.message}`);

    summary.push({
      id,
      diffPixels: "",
      error: error.message,
    });
  } finally {
    await Promise.all([localPage.close(), prodPage.close()]);
  }
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  let index = 0;

  async function worker(workerId) {
    while (true) {
      const current = index++;

      if (current >= testMaterials.length) {
        return;
      }

      const material = testMaterials[current];

      try {
        await processMaterial(browser, material);
      } catch (err) {
        console.error(`[worker ${workerId}] ${material.id}:`, err.message);
      }
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)),
  );

  summary.sort((a, b) => (b.diffPixels || 0) - (a.diffPixels || 0));

  const valid = summary.filter((s) => typeof s.diffPixels === "number");

  const values = valid.map((s) => s.diffPixels).sort((a, b) => a - b);

  const sum = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? sum / values.length : 0;

  const percentile = (p) => {
    if (!values.length) return 0;
    const idx = Math.floor((p / 100) * values.length);
    return values[Math.min(idx, values.length - 1)];
  };

  const p50 = percentile(50);
  const p90 = percentile(90);
  const p99 = percentile(99);

  console.log("\n--- Summary ---");
  console.log(`Count: ${values.length}`);
  console.log(`Avg pixel diff: ${avg.toFixed(2)}`);
  console.log(`P50: ${p50}`);
  console.log(`P90: ${p90}`);
  console.log(`P99: ${p99}`);

  const top10 = summary
    .filter((s) => typeof s.diffPixels === "number")
    .sort((a, b) => (b.diffPixels || 0) - (a.diffPixels || 0))
    .slice(0, 10);

  console.log("\n--- Worst 10 offenders ---\n");

  top10.forEach((item, i) => {
    console.log(
      `${String(i + 1).padStart(2, "0")}. ${item.id} (${item.diffPixels}px)`,
    );
  });

  const csvLines = [
    "id,diffPixels,error",
    ...summary.map((row) =>
      [row.id, row.diffPixels ?? "", `"${row.error ?? ""}"`].join(","),
    ),
  ];

  fs.writeFileSync(path.join(outputDir, "summary.csv"), csvLines.join("\n"));

  await browser.close();

  console.log("");
  console.log(`Finished ${testMaterials.length} materials`);
  console.log(`Results: ${outputDir}`);
})();

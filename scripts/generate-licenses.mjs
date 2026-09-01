// The Cloudflare adapter prerenders pages by bundling their server code into ESM chunks
// (via rolldown) that don't have Node's CJS globals available - generate-license-file's
// dependency chain relies on `__dirname`, so calling it directly from third-party.astro fails
// at build time. Running it here, as a standalone script outside Astro's build pipeline, avoids
// bundling it at all - the page just imports the static JSON this writes.

import { getProjectLicenses } from "generate-license-file";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageJsonPath = join(process.cwd(), "package.json");
const licenses = await getProjectLicenses(packageJsonPath);

const outDir = fileURLToPath(new URL("../src/data/", import.meta.url));
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "licenses.generated.json"), JSON.stringify(licenses, null, 2));

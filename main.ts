// The Family Photo With One Machine Member — entry program.
// The photograph is carried in three base64 parts beside this file
// (photo-part-1.b64 .. photo-part-3.b64). At run time the parts are
// joined in order, decoded back to the original JPEG bytes, verified,
// and written to /output/entry.png. No network, no clock, no randomness:
// every run writes exactly the same bytes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PARTS = ["photo-part-1.b64", "photo-part-2.b64", "photo-part-3.b64"];
const MAX_BYTES = 1048576;

function readPart(name: string): string {
  // Parts are plain text; tolerate stray whitespace from file handling.
  return readFileSync(join(here, name), "utf8").replace(/\s+/g, "");
}

function main(): void {
  const encoded = PARTS.map(readPart).join("");
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length === 0 || bytes.length > MAX_BYTES) {
    throw new Error(`decoded image size out of range: ${bytes.length}`);
  }
  // JPEG start-of-image and end-of-image markers: the gate wants a whole JPEG.
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
    throw new Error("decoded bytes do not start with the JPEG marker");
  }
  if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    throw new Error("decoded bytes do not end with the JPEG marker");
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.png", bytes);
}

main();

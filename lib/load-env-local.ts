import fs from "fs";
import path from "path";

export function loadEnvLocal(rootDir = process.cwd(), options: { override?: boolean } = {}) {
  const { override = false } = options;
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (override) {
      if (value) {
        process.env[key] = value;
      }
      continue;
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const script = resolve(process.cwd(), "scripts/provision-partner-accounts.mjs");
const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(result.status ?? 1);

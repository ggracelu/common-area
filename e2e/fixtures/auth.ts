import fs from "fs";
import path from "path";

export const graderStoragePath = path.join(__dirname, "grader-storage.json");

export function graderCredentialsConfigured() {
  return Boolean(process.env.GRADER_CLERK_EMAIL?.trim() && process.env.GRADER_CLERK_PASSWORD);
}

export function graderStorageReady() {
  return fs.existsSync(graderStoragePath);
}

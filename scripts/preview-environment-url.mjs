#!/usr/bin/env node

const repo = process.env.GITHUB_REPOSITORY ?? "ggracelu/whynot";
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "whynot-preview-url",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${url}`);
  }

  return response.json();
}

async function main() {
  const deployments = await fetchJson(`https://api.github.com/repos/${repo}/deployments?per_page=20`);
  const preview = deployments.find((deployment) => deployment.environment === "Preview");
  if (!preview) {
    throw new Error(`No Preview deployment found for ${repo}.`);
  }

  const statuses = await fetchJson(`https://api.github.com/repos/${repo}/deployments/${preview.id}/statuses`);
  const success = statuses.find((status) => status.state === "success" && status.environment_url);
  if (!success?.environment_url) {
    throw new Error(`No successful Preview environment_url found for deployment ${preview.id}.`);
  }

  process.stdout.write(`${success.environment_url}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

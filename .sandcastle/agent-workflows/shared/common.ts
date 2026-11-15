import * as fs from "node:fs";
import * as path from "node:path";
import * as sandcastle from "@ai-hero/sandcastle";

export const outputDir = (): string => process.env.OUTPUT_DIR ?? "/tmp";

export const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
};

export const writeJson = (filename: string, value: unknown): void => {
  fs.mkdirSync(outputDir(), { recursive: true });
  fs.writeFileSync(
    path.join(outputDir(), filename),
    JSON.stringify(value, null, 2)
  );
};

// The one agent every factory workflow runs. Each workflow installs it and
// passes it the repository secret below.
// Agent: Pi
// Install: npm install -g @earendil-works/pi-coding-agent@1.5.2
// Secret: OPENAI_API_KEY
//
// Sandcastle runs every agent with its permission checks skipped, so it can
// use any tool.
export const claudeAgent = () =>
  sandcastle.pi("openai/gpt-6.1-sol", {
    thinking: "medium",
    env: {
      OPENAI_API_KEY: required("OPENAI_API_KEY"),
    },
  });

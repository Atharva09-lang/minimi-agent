
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "dotenv/config";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const COOKIE_FILE = path.resolve(TEST_DIR, "../cookies.txt");

const AUTH_URL =
  "https://ep-calm-violet-aophputx.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth/token";

export const API_BASE_URL =
  process.env.TEST_API_URL || "http://localhost:5000/api";

export function getTestConversationId() {
  const id = process.env.TEST_CONVERSATION_ID;

  if (!id) {
    throw new Error(
      "Set TEST_CONVERSATION_ID in your local .env file."
    );
  }

  return id;
}

export function getTestMemoryId() {
  const id = process.env.TEST_MEMORY_ID;

  if (!id) {
    throw new Error(
      "Set TEST_MEMORY_ID in your local .env file."
    );
  }

  return id;
}

export async function getAuthToken() {
  if (!existsSync(COOKIE_FILE)) {
    throw new Error("cookies.txt not found. Login first.");
  }

  const tokenResponse = execFileSync(
    "curl.exe",
    [
      "-sS",
      AUTH_URL,
      "-H",
      "Origin: http://localhost:3000",
      "-b",
      COOKIE_FILE
    ],
    { encoding: "utf8" }
  );

  const tokenData = JSON.parse(tokenResponse);

  if (!tokenData.token) {
    throw new Error("JWT unavailable. Login session may have expired.");
  }

  return tokenData.token;
}

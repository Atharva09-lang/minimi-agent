
import { getAuthToken, API_BASE_URL } from "./helpers.js";

async function testMemories() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/memories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    console.log("HTTP Status:", response.status);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testMemories();

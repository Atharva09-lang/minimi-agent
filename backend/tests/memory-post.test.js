
import { getAuthToken, API_BASE_URL } from "./helpers.js";

async function testCreateMemory() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        memoryType: "fact",
        content: "Temporary memory API test record.",
        confidence: 0.95,
        importance: 2
      })
    });

    const result = await response.json();

    console.log("HTTP Status:", response.status);
    console.log(JSON.stringify(result, null, 2));

    if (response.ok && result.memory?.id) {
      console.log("\nSave this ID in .env as TEST_MEMORY_ID:");
      console.log(result.memory.id);
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testCreateMemory();

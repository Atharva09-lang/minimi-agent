
import {
  getAuthToken,
  getTestMemoryId,
  API_BASE_URL
} from "./helpers.js";

async function testUpdateMemory() {
  try {
    const token = await getAuthToken();
    const memoryId = getTestMemoryId();

    const response = await fetch(
      `${API_BASE_URL}/memories/${memoryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: "Updated memory API test record."
        })
      }
    );

    const result = await response.json();

    console.log("HTTP Status:", response.status);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testUpdateMemory();


import {
  getAuthToken,
  getTestMemoryId,
  API_BASE_URL
} from "./helpers.js";

async function testDeleteMemory() {
  try {
    const token = await getAuthToken();
    const memoryId = getTestMemoryId();

    const response = await fetch(
      `${API_BASE_URL}/memories/${memoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
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

testDeleteMemory();

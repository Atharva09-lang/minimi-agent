
import { getAuthToken, API_BASE_URL } from "./helpers.js";

async function testMemoryLifecycle() {
  let memoryId = null;
  let token;

  const headers = {
    "Content-Type": "application/json"
  };

  try {
    token = await getAuthToken();
    headers.Authorization = `Bearer ${token}`;

    // 1. Create memory
    const createResponse = await fetch(`${API_BASE_URL}/memories`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        memoryType: "fact",
        content: "Temporary memory lifecycle test.",
        confidence: 0.95,
        importance: 2
      })
    });

    const createResult = await createResponse.json();

    if (!createResponse.ok || !createResult.memory?.id) {
      throw new Error(`Memory creation failed: ${JSON.stringify(createResult)}`);
    }

    memoryId = createResult.memory.id;
    console.log("PASS: Memory created — HTTP", createResponse.status);

    // 2. Update memory
    const updateResponse = await fetch(
      `${API_BASE_URL}/memories/${memoryId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          content: "Updated temporary lifecycle test."
        })
      }
    );

    const updateResult = await updateResponse.json();

    if (
      !updateResponse.ok ||
      updateResult.memory?.content !== "Updated temporary lifecycle test."
    ) {
      throw new Error(`Memory update failed: ${JSON.stringify(updateResult)}`);
    }

    console.log("PASS: Memory updated — HTTP", updateResponse.status);

    // 3. Delete memory
    const deleteResponse = await fetch(
      `${API_BASE_URL}/memories/${memoryId}`,
      {
        method: "DELETE",
        headers
      }
    );

    const deleteResult = await deleteResponse.json();

    if (!deleteResponse.ok || deleteResult.success !== true) {
      throw new Error(`Memory deletion failed: ${JSON.stringify(deleteResult)}`);
    }

    memoryId = null;
    console.log("PASS: Memory deactivated — HTTP", deleteResponse.status);

    console.log("\nPASS: Complete memory lifecycle test.");
  } catch (error) {
    console.error("\nFAIL:", error.message);
    process.exitCode = 1;
  } finally {
    // Clean up if an earlier step failed
    if (memoryId && token) {
      try {
        const cleanupResponse = await fetch(
          `${API_BASE_URL}/memories/${memoryId}`,
          {
            method: "DELETE",
            headers
          }
        );

        console.log(
          cleanupResponse.ok
            ? "Cleanup: Temporary memory deactivated."
            : "Cleanup warning: Could not deactivate temporary memory."
        );
      } catch {
        console.log("Cleanup warning: Could not reach the API.");
      }
    }
  }
}

testMemoryLifecycle();

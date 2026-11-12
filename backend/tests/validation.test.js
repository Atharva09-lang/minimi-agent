
import {
  getAuthToken,
  getTestConversationId,
  API_BASE_URL
} from "./helpers.js";

async function runTest(name, url, options, expectedStatus = 400) {
  const response = await fetch(url, options);
  const result = await response.json();

  const passed = response.status === expectedStatus;

  console.log(
    `${passed ? "PASS" : "FAIL"}: ${name} — HTTP ${response.status}`
  );

  if (!passed) {
    console.log(result);
    process.exitCode = 1;
  }
}

async function testValidation() {
  try {
    const token = await getAuthToken();
    const conversationId = getTestConversationId();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };

    const messageUrl =
      `${API_BASE_URL}/messages/${conversationId}`;

    const memoryUrl = `${API_BASE_URL}/memories`;

    console.log("\nTesting Zod validation...\n");

    await runTest(
      "Empty message rejected",
      messageUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ content: "   " })
      }
    );

    await runTest(
      "Invalid message role rejected",
      messageUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: "Hello",
          role: "assistant"
        })
      }
    );

    await runTest(
      "Invalid memory type rejected",
      memoryUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          memoryType: "invalid",
          content: "Test memory"
        })
      }
    );

    await runTest(
      "Invalid memory ID rejected",
      `${memoryUrl}/not-a-uuid`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          content: "Updated test memory"
        })
      }
    );

  } catch (error) {
    console.error("Validation test failed:", error.message);
    process.exitCode = 1;
  }
}

testValidation();

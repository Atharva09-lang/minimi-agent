
import {
  getAuthToken,
  getTestConversationId,
  API_BASE_URL
} from "./helpers.js";

async function testRateLimit() {
  try {
    const token = await getAuthToken();
    const conversationId = getTestConversationId();

    const apiUrl =
      `${API_BASE_URL}/messages/${conversationId}`;

    console.log("Sending 21 safe test requests...\n");

    for (let i = 1; i <= 21; i++) {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: "assistant",
          content: "Rate limit test"
        })
      });

      console.log(`Request ${i}: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testRateLimit();


import {
  getAuthToken,
  getTestConversationId,
  API_BASE_URL
} from "./helpers.js";

async function testMessage() {
  try {
    const token = await getAuthToken();
    const conversationId = getTestConversationId();

    const content =
      process.argv.slice(2).join(" ") ||
      "Hi Minimi, introduce yourself in two sentences.";

    const response = await fetch(
      `${API_BASE_URL}/messages/${conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
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

testMessage();

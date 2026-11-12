
import { getAuthToken, API_BASE_URL } from "./helpers.js";

async function testConversationLifecycle() {
  let conversationId = null;
  let token;

  const headers = {
    "Content-Type": "application/json"
  };

  try {
    token = await getAuthToken();
    headers.Authorization = `Bearer ${token}`;

    // 1. Create conversation
    const createResponse = await fetch(
      `${API_BASE_URL}/conversations`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: "Temporary lifecycle test"
        })
      }
    );

    const createResult = await createResponse.json();

    if (!createResponse.ok || !createResult.conversation?.id) {
      throw new Error(`Creation failed: ${JSON.stringify(createResult)}`);
    }

    conversationId = createResult.conversation.id;
    console.log("PASS: Conversation created — HTTP", createResponse.status);

    // 2. Get all conversations
    const listResponse = await fetch(
      `${API_BASE_URL}/conversations`,
      { headers }
    );

    const listResult = await listResponse.json();

    if (
      !listResponse.ok ||
      !Array.isArray(listResult.conversations) ||
      !listResult.conversations.some(
        (item) => item.id === conversationId
      )
    ) {
      throw new Error("Created conversation missing from list.");
    }

    console.log("PASS: Conversation list — HTTP", listResponse.status);

    // 3. Get one conversation
    const getResponse = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
      { headers }
    );

    const getResult = await getResponse.json();

    if (
      !getResponse.ok ||
      getResult.conversation?.id !== conversationId
    ) {
      throw new Error("Could not retrieve created conversation.");
    }

    console.log("PASS: Get conversation — HTTP", getResponse.status);

    // 4. Update conversation title
    const updateResponse = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          title: "Updated lifecycle test"
        })
      }
    );

    const updateResult = await updateResponse.json();

    if (
      !updateResponse.ok ||
      updateResult.conversation?.title !== "Updated lifecycle test"
    ) {
      throw new Error(`Update failed: ${JSON.stringify(updateResult)}`);
    }

    console.log("PASS: Conversation updated — HTTP", updateResponse.status);

    // 5. Delete conversation
    const deleteResponse = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}`,
      {
        method: "DELETE",
        headers
      }
    );

    const deleteResult = await deleteResponse.json();

    if (!deleteResponse.ok || deleteResult.success !== true) {
      throw new Error(`Delete failed: ${JSON.stringify(deleteResult)}`);
    }

    conversationId = null;
    console.log("PASS: Conversation deleted — HTTP", deleteResponse.status);

    console.log("\nPASS: Complete conversation lifecycle test.");

  } catch (error) {
    console.error("\nFAIL:", error.message);
    process.exitCode = 1;

  } finally {
    if (conversationId && token) {
      try {
        const cleanupResponse = await fetch(
          `${API_BASE_URL}/conversations/${conversationId}`,
          {
            method: "DELETE",
            headers
          }
        );

        console.log(
          cleanupResponse.ok
            ? "Cleanup: Temporary conversation deleted."
            : "Cleanup warning: Could not delete temporary conversation."
        );
      } catch {
        console.log("Cleanup warning: API unavailable.");
      }
    }
  }
}

testConversationLifecycle();

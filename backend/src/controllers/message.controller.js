
import {
  createMessage,
  getConversationMessages
} from "../repositories/message.repository.js";

import { runAgent } from "../services/agent.service.js";
import { extractAndSaveMemories } from "../services/memory.service.js";


export async function createMessageController(req, res) {
  try {
    const { content, role = "user", metadata = {} } = req.body;
    const conversationId = req.params.conversationId;

    if (role !== "user") {
      return res.status(400).json({
        success: false,
        message: "Only user messages are allowed."
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required."
      });
    }


    const userMessage = await createMessage(
      req.user.id,
      conversationId,
      "user",
      content.trim(),
      metadata
    );

    if (!userMessage) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

   await extractAndSaveMemories(
        req.user.id,
        content.trim(),
        userMessage.id
    );
    const history = await getConversationMessages(
      req.user.id,
      conversationId
    );

    const messages = history.map(({ role, content }) => ({
      role,
      content
    }));

  
    const aiResponse = await runAgent(messages, {
      userId: req.user.id,
      conversationId,
      messageId: userMessage.id
    });


    const assistantMessage = await createMessage(
      req.user.id,
      conversationId,
      "assistant",
      aiResponse.content,
      {
        usage: aiResponse.usage,
        finishReason: aiResponse.finishReason
      }
    );

    return res.status(201).json({
      success: true,
      message: "AI response generated successfully.",
      data: {
        userMessage,
        assistantMessage
      }
    });

  } catch (error) {
    console.error("Message controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process message."
    });
  }
}



export async function getMessagesController(req, res) {
  try {
    const conversationId = req.params.conversationId;

    const messages = await getConversationMessages(
      req.user.id,
      conversationId
    );

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages."
    });
  }
}

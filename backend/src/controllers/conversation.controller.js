
import {
  createConversation,
  getConversationsByUser,
  getConversationById,
  updateConversationTitle,
  deleteConversation
} from "../repositories/conversation.repository.js";

// Create conversation
export async function createConversationController(req, res) {
  try {
    const { title } = req.body;

    const conversation = await createConversation(
      req.user.id,
      title
    );

    res.status(201).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error("Create conversation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation"
    });
  }
}

// Get all conversations
export async function getConversationsController(req, res) {
  try {
    const conversations = await getConversationsByUser(req.user.id);

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations"
    });
  }
}

// Get one conversation
export async function getConversationController(req, res) {
  try {
    const conversation = await getConversationById(
      req.user.id,
      req.params.id
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error("Get conversation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation"
    });
  }
}

// Update conversation title
export async function updateConversationController(req, res) {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid title is required"
      });
    }

    const conversation = await updateConversationTitle(
      req.user.id,
      req.params.id,
      title
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error("Update conversation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update conversation"
    });
  }
}

// Delete conversation
export async function deleteConversationController(req, res) {
  try {
    const deleted = await deleteConversation(
      req.user.id,
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully"
    });
  } catch (error) {
    console.error("Delete conversation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation"
    });
  }
}

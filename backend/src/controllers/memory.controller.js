import {
   createMemory,
   getUserMemories,
   updateMemory,
   deactivateMemory
} from '../repositories/memory.repository.js';


// Create memory
export async function createMemoryController(req, res) {
  try {
    const {
      memoryType,
      content,
      confidence,
      importance,
      sourceMessageId,
      expiresAt
    } = req.body;

    if (
      typeof content !== "string" ||
      !content.trim() ||
      !["fact", "preference", "commitment", "goal", "other"].includes(memoryType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid memory type and content are required"
      });
    }

    const memory = await createMemory(
      req.user.id,
      memoryType,
      content.trim(),
      { confidence, importance, sourceMessageId, expiresAt }
    );

    if (!memory) {
      return res.status(400).json({
        success: false,
        message: "Invalid source message or memory details"
      });
    }

    res.status(201).json({
      success: true,
      memory
    });
  } catch (error) {
    console.error("Create memory error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create memory"
    });
  }
}

// Get user's memories
export async function getMemoriesController(req, res) {
  try {
    const memories = await getUserMemories(req.user.id);

    res.status(200).json({
      success: true,
      memories
    });
  } catch (error) {
    console.error("Get memories error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch memories"
    });
  }
}

// Update memory
export async function updateMemoryController(req, res) {
  try {
    const { content } = req.body;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid memory content is required"
      });
    }

    const memory = await updateMemory(
      req.user.id,
      req.params.id,
      content.trim()
    );

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found"
      });
    }

    res.status(200).json({
      success: true,
      memory
    });
  } catch (error) {
    console.error("Update memory error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update memory"
    });
  }
}

// Deactivate memory
export async function deleteMemoryController(req, res) {
  try {
    const deleted = await deactivateMemory(
      req.user.id,
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Memory not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Memory deactivated successfully"
    });
  } catch (error) {
    console.error("Deactivate memory error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate memory"
    });
  }
}
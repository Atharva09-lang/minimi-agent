
import { generateResponse } from "./llm.service.js";
import {
  createMemory,
  getUserMemories
} from "../repositories/memory.repository.js";

const ALLOWED_TYPES = [
  "fact",
  "preference",
  "commitment",
  "goal",
  "other"
];

const EXTRACTION_PROMPT = `
You are Minimi's memory extraction system.

Analyze the user's latest message and extract useful information
that may help personalize future conversations.

Extract only:
- Stable facts explicitly stated by the user.
- Long-term preferences.
- Important goals.
- Ongoing commitments or projects.

Rules:
- Do not extract temporary questions or casual conversation.
- Do not infer facts that the user did not state.
- Do not save passwords, API keys, tokens or credentials.
- Do not extract sensitive personal information.
- Return at most 3 useful memories.
- If nothing is worth remembering, return an empty array.
- Each memory must have a type, content, confidence and importance.
- memory_type must be fact, preference, commitment, goal or other.
- confidence must be between 0 and 1.
- importance must be an integer between 1 and 5.

Return only valid JSON in this format:

{
  "memories": [
    {
      "memory_type": "preference",
      "content": "The user prefers Node.js for backend development.",
      "confidence": 0.95,
      "importance": 4
    }
  ]
}
`;

export async function extractAndSaveMemories(
  userId,
  message,
  sourceMessageId
) {
  if (!userId || !message || !sourceMessageId) {
    return [];
  }

  try {
    const result = await generateResponse([
      {
        role: "system",
        content: EXTRACTION_PROMPT
      },
      {
        role: "user",
        content: message
      }
    ]);

    const parsed = JSON.parse(result.content);

    if (!Array.isArray(parsed.memories)) {
      return [];
    }

    const existingMemories = await getUserMemories(userId, 50);
    const savedMemories = [];

    for (const memory of parsed.memories.slice(0, 3)) {
      if (
        !memory ||
        !ALLOWED_TYPES.includes(memory.memory_type) ||
        typeof memory.content !== "string" ||
        !memory.content.trim()
      ) {
        continue;
      }

      const confidence = Number(memory.confidence);
      const importance = Number(memory.importance);

      if (
        !Number.isFinite(confidence) ||
        confidence < 0 ||
        confidence > 1 ||
        !Number.isInteger(importance) ||
        importance < 1 ||
        importance > 5
      ) {
        continue;
      }

      const normalizedContent = memory.content.trim().toLowerCase();

      const duplicate = existingMemories.some(
        (existing) =>
          existing.memory_type === memory.memory_type &&
          existing.content.trim().toLowerCase() === normalizedContent
      );

      if (duplicate) {
        continue;
      }

      const saved = await createMemory(
        userId,
        memory.memory_type,
        memory.content.trim(),
        {
          confidence,
          importance,
          sourceMessageId
        }
      );

      if (saved) {
        savedMemories.push(saved);
        existingMemories.push(saved);
      }
    }

    console.log(`Memories saved: ${savedMemories.length}`);

    return savedMemories;
  } catch (error) {
    console.error("Memory extraction failed:", error.message);
    return [];
  }
}

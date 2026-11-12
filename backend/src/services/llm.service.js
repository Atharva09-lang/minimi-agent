
import groq from "../config/groq.js";

const MODEL = "openai/gpt-oss-120b";

export async function generateResponse(messages, tools = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages must be a non-empty array");
  }

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    ...(tools.length > 0 && {
      tools,
      tool_choice: "auto"
    })
  });

  const choice = response.choices?.[0];

  return {
    content: choice?.message?.content ?? "",
    toolCalls: choice?.message?.tool_calls ?? [],
    finishReason: choice?.finish_reason,
    usage: response.usage ?? null
  };
}

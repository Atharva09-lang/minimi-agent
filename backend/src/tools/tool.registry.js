//It tells the model which tools are available and lets the backend execute the requested tool.

import { searchWeb } from "./web-search/search.tool.js";

export const availableTools = [
  {
    type: "function",
    function: {
      name: "search_web",
      description:
        "Search the internet for current information, recent news, facts, and topics that require web research.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query"
          }
        },
        required: ["query"],
        additionalProperties: false
      }
    }
  }
];

const toolHandlers = {
  search_web: searchWeb
};

export async function executeTool(name, args) {
  const handler = toolHandlers[name];

  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return await handler(args.query);
}

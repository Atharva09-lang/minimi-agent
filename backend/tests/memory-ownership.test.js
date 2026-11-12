import { randomUUID } from "node:crypto";
import pool from "../src/config/database.js";

import {
  createMemory,
  getUserMemories,
  updateMemory,
  deactivateMemory
} from "../src/repositories/memory.repository.js";

async function testMemoryOwnership() {
  let memoryId;
  let userAId;

  try {
  
    const result = await pool.query(
      "SELECT user_id FROM memories WHERE is_active = TRUE LIMIT 1"
    );

    if (result.rows.length === 0) {
      throw new Error("No active memory found.");
    }

    userAId = result.rows[0].user_id;

   
    const userBId = randomUUID();

    
    const memory = await createMemory(
      userAId,
      "fact",
      "Temporary ownership security test."
    );

    if (!memory) {
      throw new Error("Could not create test memory.");
    }

    memoryId = memory.id;

    console.log("Test memory created for User A.");

    // Test whether User B can read it
    const userBMemories = await getUserMemories(userBId);

    const canRead = userBMemories.some(
      (item) => item.id === memoryId
    );

    // Test whether User B can update it
    const updateResult = await updateMemory(
      userBId,
      memoryId,
      "Unauthorized update attempt."
    );

    // Test whether User B can deactivate it
    const deleteResult = await deactivateMemory(
      userBId,
      memoryId
    );

    console.log("\nOwnership test results:");

    console.log("User B can read:", canRead);
    console.log("User B can update:", updateResult !== null);
    console.log("User B can deactivate:", deleteResult);

    if (
      !canRead &&
      updateResult === null &&
      deleteResult === false
    ) {
      console.log("\nPASS: User ownership restrictions work.");
    } else {
      console.log("\nFAIL: Ownership restriction issue detected.");
    }

  } catch (error) {
    console.error("Ownership test failed:", error.message);

  } finally {
    // Clean up using the actual owner
    if (memoryId && userAId) {
      await deactivateMemory(userAId, memoryId);
      console.log("\nTemporary test memory cleaned up.");
    }

    await pool.end();
  }
}

testMemoryOwnership();

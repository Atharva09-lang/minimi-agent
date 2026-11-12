
const API_URL = "http://localhost:5000/";

async function testInvalidJson() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: '{"name": "Minimi", "message": }'
    });

    const result = await response.json();

    console.log("HTTP Status:", response.status);
    console.log("Response:", result);

    if (
      response.status === 400 &&
      result.success === false &&
      result.message === "Invalid JSON request body."
    ) {
      console.log("PASS: Invalid JSON handled correctly.");
    } else {
      console.log("FAIL: Unexpected error response.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testInvalidJson();

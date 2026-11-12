
const API_URL = "http://localhost:5000/";

async function testBodyLimit() {
  try {
    const largePayload = JSON.stringify({
      data: "A".repeat(150 * 1024)
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: largePayload
    });

    const result = await response.json();

    console.log("Payload size:", largePayload.length, "bytes");
    console.log("HTTP Status:", response.status);
    console.log("Response:", result);

    if (
      response.status === 413 &&
      result.success === false &&
      result.message?.includes("100 KB")
    ) {
      console.log("PASS: Centralized body-size error handling works.");
    } else {
      console.log("FAIL: Unexpected error response.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  }
}

testBodyLimit();

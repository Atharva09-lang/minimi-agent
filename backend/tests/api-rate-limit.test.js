
async function testApiRateLimit() {
  let statusCounts = {};

  for (let i = 1; i <= 101; i++) {
    const response = await fetch(
      "http://localhost:5000/api/__rate-limit-test"
    );

    statusCounts[response.status] =
      (statusCounts[response.status] || 0) + 1;

    if (i === 1 || i === 100 || i === 101) {
      console.log(`Request ${i}: HTTP ${response.status}`);
    }
  }

  console.log("\nSummary:", statusCounts);
}

testApiRateLimit().catch(console.error);


const API_URL = "http://localhost:5000/api/memories";

async function testAuth() {
  const tests = [
    {
      name: "Missing token",
      headers: {}
    },
    {
      name: "Invalid token",
      headers: {
        Authorization: "Bearer invalid.jwt.token"
      }
    }
  ];

  for (const test of tests) {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: test.headers
    });

    console.log(
      `${test.name}: HTTP ${response.status}`
    );
  }
}

testAuth();

export async function sendAdminTransaction(txData: Buffer) {
  const response = await fetch("/api/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ txData: txData.toString("base64") }), // Assuming txData is a Buffer
  });

  const data = await response.json();
  return data;
}

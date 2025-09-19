import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed. Use POST." }),
      };
    }

    const host = event.headers.host;
    const scheme = (event.headers["x-forwarded-proto"] || "https") as string;
    const rotationUrl = `${scheme}://${host}/.netlify/functions/rotate-site`;
    console.log("Manual rotation calling:", rotationUrl);

    const response = await fetch(rotationUrl, { method: "POST" });
    const text = await response.text();

    let result: any = null;
    try { result = JSON.parse(text); } catch { result = { raw: text }; }

    if (response.ok) {
      console.log("Manual rotation completed successfully:", result);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true, rotationResult: result, triggeredAt: new Date().toISOString() }, null, 2),
      };
    }

    console.error("Manual rotation failed:", result);
    return { statusCode: 500, body: JSON.stringify({ success: false, details: result }) };

  } catch (error) {
    console.error("Error in manual rotation:", error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: (error as Error).message }) };
  }
};

export { handler };

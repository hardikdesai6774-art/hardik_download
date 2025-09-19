import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Get current rotation status from Netlify Blobs
    const currentSiteUrl = await context.clientContext?.blobs?.get("current-site-url");
    const currentSiteId = await context.clientContext?.blobs?.get("current-site-id");
    const lastRotation = await context.clientContext?.blobs?.get("last-rotation");
    
    // Calculate next rotation time (every 4 hours)
    let nextRotation = null;
    if (lastRotation) {
      const lastRotationDate = new Date(lastRotation);
      const nextRotationDate = new Date(lastRotationDate.getTime() + (4 * 60 * 60 * 1000)); // Add 4 hours
      nextRotation = nextRotationDate.toISOString();
    }
    
    const status = {
      currentSiteUrl: currentSiteUrl || "Not set",
      currentSiteId: currentSiteId || "Not set",
      lastRotation: lastRotation || "Never",
      nextRotation: nextRotation || "Unknown",
      systemTime: new Date().toISOString(),
      rotationInterval: "Every 4 hours (0 */4 * * *)",
    };
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(status, null, 2),
    };
    
  } catch (error) {
    console.error("Error getting rotation status:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export { handler };

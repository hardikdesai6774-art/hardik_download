import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const startTime = new Date().toISOString();
  console.log(`[${startTime}] Scheduled rotation triggered`);
  
  try {
    // Check if this is actually a scheduled trigger
    const isScheduled = event.headers["x-netlify-event"] === "schedule";
    
    if (event.httpMethod !== "POST" && !isScheduled) {
      const errorMsg = "This function should only be triggered by Netlify's scheduled functions";
      console.error(errorMsg);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: errorMsg,
          timestamp: startTime
        })
      };
    }
    
    // Get the site URL dynamically
    const siteUrl = process.env.URL || 'https://ephemeral-clafoutis-525c9a.netlify.app';
    const rotationUrl = `${siteUrl}/.netlify/functions/rotate-site`;
    
    console.log(`Calling rotation function at: ${rotationUrl}`);
    
    // Add a unique request ID for tracking
    const requestId = `req_${Date.now()}`;
    
    const response = await fetch(rotationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        "X-Netlify-Event": "scheduled-rotation"
      },
      body: JSON.stringify({
        scheduledAt: startTime,
        requestId: requestId,
        source: "scheduled-rotation"
      })
    });
    
    const result = await response.json().catch(() => ({}));
    
    if (response.ok) {
      console.log("Scheduled rotation completed successfully:", JSON.stringify(result, null, 2));
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Scheduled site rotation completed",
          rotationResult: result,
          scheduledAt: startTime,
          completedAt: new Date().toISOString()
        }, null, 2)
      };
    } 
    
    // If we get here, there was an error
    const errorMsg = result.error || `HTTP ${response.status}: ${response.statusText}`;
    console.error("Rotation failed:", errorMsg, "Details:", result);
    
    return {
      statusCode: response.status || 500,
      body: JSON.stringify({
        success: false,
        error: "Site rotation failed",
        details: result,
        scheduledAt: startTime,
        completedAt: new Date().toISOString()
      }, null, 2)
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in scheduled rotation:", errorMsg, "Stack:", error instanceof Error ? error.stack : undefined);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: errorMsg,
        scheduledAt: startTime,
        completedAt: new Date().toISOString(),
        stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined
      }, null, 2)
    };
  }
};

export { handler };

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    console.log("Scheduled rotation triggered at:", new Date().toISOString());
    
    // Check if this is actually a scheduled trigger
    if (event.httpMethod !== "POST" && !event.headers["x-netlify-event"]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "This function should only be triggered by Netlify's scheduled functions",
        }),
      };
    }
    
    // Call the rotation function on the same site. Netlify provides URL env at runtime.
    const baseUrl = process.env.URL;
    if (!baseUrl) {
      console.error("Environment variable URL is not set in Netlify env.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing URL environment variable on Netlify." }),
      };
    }
    const rotationUrl = `${baseUrl}/.netlify/functions/rotate-site`;
    
    const response = await fetch(rotationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("Scheduled rotation completed successfully:", result);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Scheduled site rotation completed",
          rotationResult: result,
          scheduledAt: new Date().toISOString(),
        }),
      };
    } else {
      console.error("Rotation failed:", result);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Site rotation failed",
          details: result,
          scheduledAt: new Date().toISOString(),
        }),
      };
    }
    
  } catch (error) {
    console.error("Error in scheduled rotation:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        scheduledAt: new Date().toISOString(),
      }),
    };
  }
};

export { handler };

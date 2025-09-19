import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Method not allowed. Use POST to trigger manual rotation.",
        }),
      };
    }
    
    console.log("Manual rotation triggered at:", new Date().toISOString());
    
    // Call the rotation function
    const rotationUrl = `${process.env.URL || 'https://your-site.netlify.app'}/.netlify/functions/rotate-site`;
    
    const response = await fetch(rotationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("Manual rotation completed successfully:", result);
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          message: "Manual site rotation completed successfully",
          rotationResult: result,
          triggeredAt: new Date().toISOString(),
        }, null, 2),
      };
    } else {
      console.error("Manual rotation failed:", result);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Manual site rotation failed",
          details: result,
          triggeredAt: new Date().toISOString(),
        }),
      };
    }
    
  } catch (error) {
    console.error("Error in manual rotation:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        triggeredAt: new Date().toISOString(),
      }),
    };
  }
};

export { handler };

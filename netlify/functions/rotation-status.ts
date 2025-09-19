import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface RotationState {
  currentSiteUrl?: string;
  currentSiteId?: string;
  lastRotation?: string;
}

const KV_NAMESPACE = 'rotation-state';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Get the KV store
    const kv = context.clientContext?.kv;
    
    if (!kv) {
      throw new Error('KV store not available');
    }
    
    // Try to get the current state from KV store
    let state: RotationState = {};
    try {
      const stateValue = await kv.get(KV_NAMESPACE);
      if (stateValue) {
        state = JSON.parse(stateValue);
      } else {
        // Initialize with environment variables if KV is empty
        state = {
          currentSiteUrl: process.env.CURRENT_SITE_URL,
          currentSiteId: process.env.CURRENT_SITE_ID,
          lastRotation: process.env.LAST_ROTATION
        };
        // Save initial state
        await kv.set(KV_NAMESPACE, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error reading from KV store:', error);
      // Fallback to environment variables
      state = {
        currentSiteUrl: process.env.CURRENT_SITE_URL,
        currentSiteId: process.env.CURRENT_SITE_ID,
        lastRotation: process.env.LAST_ROTATION
      };
    }
    
    // Calculate next rotation time (every 4 hours)
    let nextRotation: string | null = null;
    if (state.lastRotation) {
      const lastRotationDate = new Date(state.lastRotation);
      const nextRotationDate = new Date(lastRotationDate.getTime() + (4 * 60 * 60 * 1000));
      nextRotation = nextRotationDate.toISOString();
    }
    
    const status = {
      currentSiteUrl: state.currentSiteUrl || "Not set",
      currentSiteId: state.currentSiteId || "Not set",
      lastRotation: state.lastRotation || "Never",
      nextRotation: nextRotation || "Unknown",
      systemTime: new Date().toISOString(),
      rotationInterval: "Every 4 hours (0 */4 * * *)",
      note: "Using Netlify KV store for state"
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

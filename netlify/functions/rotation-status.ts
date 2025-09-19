import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fs from 'fs';
import path from 'path';

interface RotationState {
  currentSiteUrl?: string;
  currentSiteId?: string;
  lastRotation?: string;
}

const STATE_FILE = path.join(process.cwd(), 'rotation-state.json');

const readState = (): RotationState => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading state file:', error);
  }
  
  // Return default state if file doesn't exist or there's an error
  return {
    currentSiteUrl: process.env.CURRENT_SITE_URL,
    currentSiteId: process.env.CURRENT_SITE_ID,
    lastRotation: process.env.LAST_ROTATION
  };
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Read state from file
    const state = readState();
    
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

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fs from 'fs';
import path from 'path';

interface RotationState {
  currentSiteUrl?: string;
  currentSiteId?: string;
  lastRotation?: string;
}

// File to store rotation state
const STATE_FILE = path.join('/tmp', 'rotation-state.json');

// Helper function to read state from file
const readState = (): RotationState => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading state file:', error);
  }
  return {};
};

// Helper function to write state to file
const writeState = (state: RotationState) => {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing state file:', error);
  }
};

// Initialize state file if it doesn't exist
if (!fs.existsSync(STATE_FILE)) {
  writeState({
    currentSiteUrl: process.env.CURRENT_SITE_URL,
    currentSiteId: process.env.CURRENT_SITE_ID,
    lastRotation: process.env.LAST_ROTATION || new Date().toISOString()
  });
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Get current rotation state from file
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
      note: "Using file-based state storage"
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

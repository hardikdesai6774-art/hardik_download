import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fs from 'fs';
import path from 'path';

interface UpdatePayload {
  url: string;
  siteId?: string;
}

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
    return true;
  } catch (error) {
    console.error('Error writing state file:', error);
    return false;
  }
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { url, siteId } = JSON.parse(event.body || '{}') as UpdatePayload;
    
    if (!url) {
      return { 
        statusCode: 400, 
        headers: { 
          'Content-Type': 'application/json' as const, 
          'Access-Control-Allow-Origin': '*' as const 
        },
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Read current state
    const currentState = readState();
    
    // Update state
    const newState: RotationState = {
      ...currentState,
      currentSiteUrl: url,
      currentSiteId: siteId || currentState.currentSiteId,
      lastRotation: new Date().toISOString()
    };

    // Save state
    const success = writeState(newState);
    
    if (!success) {
      throw new Error('Failed to save rotation state');
    }

    console.log('Rotation updated:', newState);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Rotation updated successfully',
        url,
        siteId: siteId || 'not-provided',
        lastRotation: newState.lastRotation
      })
    };
  } catch (error) {
    console.error('Error updating rotation:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface UpdatePayload {
  url: string;
  siteId?: string;
}

interface RotationState {
  currentSiteUrl?: string;
  currentSiteId?: string;
  lastRotation?: string;
}

const KV_NAMESPACE = 'rotation-state';

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
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    // Get the KV store
    const kv = context.clientContext?.kv;
    
    if (!kv) {
      throw new Error('KV store not available');
    }

    // Read current state
    let currentState: RotationState = {};
    try {
      const stateValue = await kv.get(KV_NAMESPACE);
      if (stateValue) {
        currentState = JSON.parse(stateValue);
      }
    } catch (error) {
      console.error('Error reading from KV store:', error);
      throw new Error('Failed to read current state');
    }
    
    // Update state
    const newState: RotationState = {
      ...currentState,
      currentSiteUrl: url,
      currentSiteId: siteId || currentState.currentSiteId,
      lastRotation: new Date().toISOString()
    };

    // Save state to KV store
    try {
      await kv.set(KV_NAMESPACE, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving to KV store:', error);
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
        lastRotation: newState.lastRotation,
        note: 'State saved to Netlify KV store'
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

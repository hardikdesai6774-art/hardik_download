import { Context } from "https://edge.netlify.com";

interface RotationState {
  currentSiteUrl?: string;
  currentSiteId?: string;
  lastRotation?: string;
}

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url);
    
    // Skip redirect for static files and API routes
    if (url.pathname.includes('.') || url.pathname.startsWith('/.netlify/')) {
      return;
    }

    try {
      // Try to fetch the rotation state from the JSON file
      const response = await fetch(new URL('/rotation-state.json', url.origin));
      if (response.ok) {
        const state: RotationState = await response.json();
        
        // Only redirect if we have a valid site URL
        if (state.currentSiteUrl) {
          console.log(`Redirecting to active site: ${state.currentSiteUrl}`);
          return Response.redirect(state.currentSiteUrl, 302);
        }
      }
    } catch (error) {
      console.error('Error reading rotation state:', error);
    }
    
    // If no active site URL or error, serve the current site
    console.log("No active site URL found. Serving current site.");
    return;
    
  } catch (error) {
    console.error("Error in redirect function:", error);
    // On error, serve the current site
    return;
  }
};

export const config = {
  path: "/*",
};

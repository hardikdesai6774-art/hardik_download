import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url);
    
    // Skip redirect for static files and API routes
    if (url.pathname.includes('.') || url.pathname.startsWith('/.netlify/')) {
      return;
    }

    // Get the current active site URL from blob store
    const { blobs } = context;
    const currentSiteUrl = await blobs?.get("current-site-url");

    // Only redirect if we have a valid site URL
    if (currentSiteUrl) {
      console.log(`Redirecting to active site: ${currentSiteUrl}`);
      return Response.redirect(currentSiteUrl, 302);
    }
    
    // If no active site URL, serve the current site
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

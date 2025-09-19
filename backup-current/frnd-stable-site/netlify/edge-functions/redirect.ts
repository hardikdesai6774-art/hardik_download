import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url);
    
    // Don't redirect admin pages, API endpoints, or static assets
    const excludedPaths = [
      '/admin.html',
      '/.netlify/',
      '/favicon.ico',
      '/_next/',
      '/static/',
      '/assets/'
    ];
    
    const shouldExclude = excludedPaths.some(path => url.pathname.startsWith(path));
    
    if (shouldExclude) {
      // Let the request pass through normally
      return;
    }
    
    // Only redirect the root path and other main content paths
    if (url.pathname === '/' || (!url.pathname.includes('.'))) {
      // Get the current active site URL from Netlify Blobs
      const { blobs } = context;
      const currentSiteUrl = await blobs.get("current-site-url");
      
      // If no URL is stored yet, redirect to a default fallback
      if (!currentSiteUrl) {
        console.log("No current site URL found, using fallback");
        // You can set this to your initial site or a maintenance page
        return Response.redirect("https://your-fallback-site.netlify.app", 302);
      }
      
      // Log the redirect for debugging
      console.log(`Redirecting to: ${currentSiteUrl}`);
      
      // Return 302 redirect to the current active site
      return Response.redirect(currentSiteUrl, 302);
    }
    
    // For all other paths, let them pass through
    return;
    
  } catch (error) {
    console.error("Error in redirect function:", error);
    
    // Only redirect if this was meant to be a redirect (root path)
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return Response.redirect("https://your-fallback-site.netlify.app", 302);
    }
    
    // Otherwise let it pass through
    return;
  }
};

export const config = {
  path: "/*",
};

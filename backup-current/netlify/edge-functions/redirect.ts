import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  try {
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
    
  } catch (error) {
    console.error("Error in redirect function:", error);
    
    // Fallback in case of any errors
    return Response.redirect("https://your-fallback-site.netlify.app", 302);
  }
};

export const config = {
  path: "/*",
};

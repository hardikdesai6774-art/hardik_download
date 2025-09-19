import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface NetlifyApiResponse {
  id: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  name: string;
  state: string;
}

interface SiteCreationPayload {
  name?: string;
  custom_domain?: string;
  repo?: {
    provider: string;
    repo: string;
    branch: string;
  };
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    console.log("Starting site rotation process...");
    
    const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || "hardikdesai6774-art/hardik_download";
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
    
    if (!NETLIFY_TOKEN) {
      throw new Error("NETLIFY_ACCESS_TOKEN environment variable is required");
    }
    
    // Get current site URL from Netlify Blobs to delete the old site
    const currentSiteUrl = await context.clientContext?.blobs?.get("current-site-url");
    let oldSiteId: string | null = null;
    
    if (currentSiteUrl) {
      // Extract site ID from current URL for deletion later
      const urlMatch = currentSiteUrl.match(/https:\/\/([^.]+)\.netlify\.app/);
      if (urlMatch) {
        // We'll need to get the site ID via API since we only have the subdomain
        const sitesResponse = await fetch("https://api.netlify.com/api/v1/sites", {
          headers: {
            "Authorization": `Bearer ${NETLIFY_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        
        if (sitesResponse.ok) {
          const sites = await sitesResponse.json();
          const oldSite = sites.find((site: any) => site.url === currentSiteUrl || site.ssl_url === currentSiteUrl);
          if (oldSite) {
            oldSiteId = oldSite.id;
          }
        }
      }
    }
    
    // Create a new site
    const timestamp = Date.now();
    const siteName = `frnd-rotation-${timestamp}`;
    
    const sitePayload: SiteCreationPayload = {
      name: siteName,
      repo: {
        provider: "github",
        repo: GITHUB_REPO,
        branch: GITHUB_BRANCH,
      },
    };
    
    console.log("Creating new site:", siteName);
    
    const createResponse = await fetch("https://api.netlify.com/api/v1/sites", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NETLIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sitePayload),
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create site: ${createResponse.status} - ${errorText}`);
    }
    
    const newSite: NetlifyApiResponse = await createResponse.json();
    console.log("New site created:", newSite.ssl_url);
    
    // Wait a moment for the site to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Trigger a deploy for the new site
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${newSite.id}/deploys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NETLIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    
    if (deployResponse.ok) {
      console.log("Deploy triggered for new site");
    }
    
    // Update the Netlify Blobs store with the new site URL
    await context.clientContext?.blobs?.set("current-site-url", newSite.ssl_url);
    await context.clientContext?.blobs?.set("current-site-id", newSite.id);
    await context.clientContext?.blobs?.set("last-rotation", new Date().toISOString());
    
    console.log("Updated blob store with new site URL:", newSite.ssl_url);
    
    // Delete the old site if it exists
    if (oldSiteId) {
      console.log("Deleting old site:", oldSiteId);
      
      const deleteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${oldSiteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${NETLIFY_TOKEN}`,
        },
      });
      
      if (deleteResponse.ok) {
        console.log("Old site deleted successfully");
      } else {
        console.error("Failed to delete old site:", await deleteResponse.text());
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Site rotation completed successfully",
        newSiteUrl: newSite.ssl_url,
        newSiteId: newSite.id,
        oldSiteDeleted: !!oldSiteId,
        timestamp: new Date().toISOString(),
      }),
    };
    
  } catch (error) {
    console.error("Error in site rotation:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export { handler };

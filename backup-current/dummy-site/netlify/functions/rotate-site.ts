import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface NetlifyApiResponse {
  id: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  name: string;
  state: string;
  created_at?: string;
  updated_at?: string;
  deploy_id?: string;
  build_settings?: {
    repo_branch?: string;
  };
}

interface SiteCreationPayload {
  name?: string;
  custom_domain?: string;
  repo?: {
    provider: string;
    repo: string;
    branch: string;
    cmd?: string;
    dir?: string;
  };
  build_settings?: {
    cmd?: string;
    dir?: string;
  };
}

// Simple in-memory store as fallback if blobs aren't available
const memoryStore: Record<string, string> = {};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const startTime = new Date().toISOString();
  const requestId = event.headers['x-request-id'] || `req_${Date.now()}`;
  
  const log = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${requestId}] ${message}`, data ? JSON.stringify(data) : '');
  };
  
  log("Starting site rotation process", {
    userAgent: event.headers['user-agent'],
    source: event.headers['x-netlify-event'] || 'manual',
    requestId
  });
  
  try {
    const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || "hardikdesai6774-art/hardik_download";
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
    
    if (!NETLIFY_TOKEN) {
      throw new Error("NETLIFY_ACCESS_TOKEN environment variable is required");
    }
    
    // Helper function to store data with fallback to memory
    const storeData = async (key: string, value: string): Promise<void> => {
      try {
        await context.clientContext?.blobs?.set(key, value);
        memoryStore[key] = value; // Update memory store as backup
      } catch (error) {
        log("Warning: Could not save to Netlify Blobs, using memory store", { key, error: error.message });
        memoryStore[key] = value;
      }
    };
    
    // Helper function to retrieve data with fallback to memory
    const getStoredData = async (key: string): Promise<string | null> => {
      try {
        const blobValue = await context.clientContext?.blobs?.get(key);
        if (blobValue) return blobValue;
      } catch (error) {
        log("Warning: Could not read from Netlify Blobs, checking memory store", { key, error: error.message });
      }
      return memoryStore[key] || null;
    };
    
    // Get current site URL from storage
    const currentSiteUrl = await getStoredData("current-site-url");
    let oldSiteId: string | null = null;
    
    if (currentSiteUrl) {
      log("Found existing site in storage", { currentSiteUrl });
      
      // First try to get the site ID directly from the URL
      const urlMatch = currentSiteUrl.match(/https:\/\/([^.]+)\.netlify\.app/);
      
      if (urlMatch) {
        const siteName = urlMatch[1];
        log("Looking up site by name", { siteName });
        
        try {
          // Try to get the site by name first
          const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteName}.netlify.app`, {
            headers: {
              "Authorization": `Bearer ${NETLIFY_TOKEN}`,
              "Content-Type": "application/json",
            },
          });
          
          if (siteResponse.ok) {
            const siteData = await siteResponse.json();
            oldSiteId = siteData.id;
            log("Found site by name", { siteId: oldSiteId });
          } else if (siteResponse.status === 404) {
            log("Site not found by name, searching all sites...");
            // Fall back to searching all sites if direct lookup fails
            const sitesResponse = await fetch("https://api.netlify.com/api/v1/sites", {
              headers: {
                "Authorization": `Bearer ${NETLIFY_TOKEN}`,
                "Content-Type": "application/json",
              },
            });
            
            if (sitesResponse.ok) {
              const sites = await sitesResponse.json();
              const oldSite = sites.find((site: any) => 
                site.url === currentSiteUrl || 
                site.ssl_url === currentSiteUrl ||
                site.name === siteName
              );
              
              if (oldSite) {
                oldSiteId = oldSite.id;
                log("Found site in site list", { siteId: oldSiteId });
              }
            }
          }
        } catch (error) {
          log("Error looking up old site", { error: error.message });
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
        dir: "dummy-site" // Make sure we're deploying from the right directory
      },
      build_settings: {
        dir: "dummy-site" // Also set in build settings for compatibility
      }
    };
    
    log("Creating new site", { siteName, repo: GITHUB_REPO, branch: GITHUB_BRANCH });
    
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
    log("New site created", { 
      siteId: newSite.id, 
      url: newSite.ssl_url,
      name: newSite.name 
    });
    
    // Wait a bit for the site to be ready
    log("Waiting for site to be ready...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Store the new site information before triggering deploy
    await storeData("current-site-url", newSite.ssl_url);
    await storeData("current-site-id", newSite.id);
    await storeData("last-rotation", new Date().toISOString());
    
    log("Triggering deploy for new site");
    
    // Trigger a deploy for the new site
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${newSite.id}/builds`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NETLIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clear_cache: true
      }),
    });
    
    if (deployResponse.ok) {
      const deployResult = await deployResponse.json();
      log("Deploy triggered successfully", { 
        deployId: deployResult.id,
        deployUrl: deployResult.deploy_ssl_url
      });
    } else {
      const errorText = await deployResponse.text();
      log("Warning: Could not trigger deploy, but site was created", { 
        status: deployResponse.status,
        error: errorText 
      });
    }
    
    // Delete the old site if it exists and is different from the new one
    if (oldSiteId && oldSiteId !== newSite.id) {
      log("Deleting old site", { oldSiteId });
      
      try {
        const deleteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${oldSiteId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${NETLIFY_TOKEN}`,
          },
        });
        
        if (deleteResponse.ok) {
          log("Old site deleted successfully");
        } else {
          const errorText = await deleteResponse.text();
          log("Failed to delete old site", { 
            status: deleteResponse.status,
            error: errorText 
          });
        }
      } catch (error) {
        log("Error deleting old site", { error: error.message });
      }
    }
    
    const result = {
      success: true,
      message: "Site rotation completed successfully",
      newSite: {
        id: newSite.id,
        name: newSite.name,
        url: newSite.ssl_url,
        adminUrl: newSite.admin_url
      },
      oldSiteDeleted: !!oldSiteId && oldSiteId !== newSite.id,
      timestamp: new Date().toISOString(),
      requestId
    };
    
    log("Rotation completed successfully", result);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result, null, 2)
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    log("Error in site rotation", { 
      error: errorMessage,
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        requestId,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack })
      }, null, 2)
    };
  }
};

export { handler };

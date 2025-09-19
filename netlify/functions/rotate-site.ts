import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
// Using Netlify-provided blobs binding available in functions via context

// --- Interfaces ---
interface NetlifySite {
  id: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  name: string;
  state: string;
}

interface SiteCreationPayload {
  name?: string;
  repo?: {
    provider: string;
    repo: string;
    branch: string;
  };
}

// --- Helper Functions ---
const apiRequest = async (endpoint: string, options: RequestInit) => {
  const { NETLIFY_ACCESS_TOKEN } = process.env;
  if (!NETLIFY_ACCESS_TOKEN) {
    throw new Error("NETLIFY_ACCESS_TOKEN is not set");
  }

  const response = await fetch(`https://api.netlify.com/api/v1${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error on ${endpoint}: ${response.status} - ${errorText}`);
    throw new Error(`Netlify API error: ${errorText}`);
  }

  // For DELETE requests, response body might be empty
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

const pollDeployStatus = async (siteId: string, timeout = 300000, interval = 5000) => {
  const startTime = Date.now();
  console.log(`Polling deploy status for site ${siteId}...`);

  while (Date.now() - startTime < timeout) {
    const deploys = await apiRequest(`/sites/${siteId}/deploys`, { method: "GET" });
    const latestDeploy = deploys?.[0];

    if (latestDeploy && latestDeploy.state === "ready") {
      console.log(`Deploy for site ${siteId} is ready!`);
      return true;
    }
    
    console.log(`Deploy not ready yet (current state: ${latestDeploy?.state || 'unknown'}). Waiting...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Deploy polling timed out for site ${siteId}`);
};

// --- Main Handler ---
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log("Site rotation process initiated...");
  const { GITHUB_REPO, GITHUB_BRANCH } = process.env;

  try {
    // 1. Get the old site's ID from the blob store (Netlify Blobs)
    const oldSiteId = await context.clientContext?.blobs?.get("current-site-id");
    console.log(oldSiteId ? `Found old site ID: ${oldSiteId}` : "No old site ID found.");

    // 2. Create a new Netlify site from local files
    const siteName = `frnd-rotation-${Date.now()}`;
    const sitePayload = {
      name: siteName,
    };
    
    console.log(`Creating new site '${siteName}'...`);
    const newSite: NetlifySite = await apiRequest("/sites", {
      method: "POST",
      body: JSON.stringify(sitePayload),
    });
    console.log(`Successfully created new site: ${newSite.name} (${newSite.id})`);

    // 3. Poll for the new site's deployment to be ready
    await pollDeployStatus(newSite.id);

    // 4. Update the blob store to point to the new site
    console.log(`Updating blob store to point to new site: ${newSite.ssl_url}`);
    await context.clientContext?.blobs?.set("current-site-url", newSite.ssl_url);
    await context.clientContext?.blobs?.set("current-site-id", newSite.id);
    await context.clientContext?.blobs?.set("last-rotation", new Date().toISOString());
    console.log("Blob store updated successfully.");

    // 5. Delete the old site
    if (oldSiteId) {
      console.log(`Deleting old site: ${oldSiteId}...`);
      await apiRequest(`/sites/${oldSiteId}`, { method: "DELETE" });
      console.log(`Successfully deleted old site: ${oldSiteId}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Site rotation completed successfully.",
        newSiteUrl: newSite.ssl_url,
      }),
    };

  } catch (error) {
    console.error("Critical error in site rotation process:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred.",
      }),
    };
  }
};

export { handler };

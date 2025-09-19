import { DOWNLOAD_CONFIG } from './constants';

// Types
interface DownloadOptions {
  toast?: (options: { title: string; description?: string }) => void;
}

interface DownloadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

/**
 * Attempts to download the APK or ZIP file with fallback logic
 * @param options - Configuration options including toast notifications
 * @returns Promise<DownloadResult> - Result of the download attempt
 */
export async function downloadApkOrZip(options?: DownloadOptions): Promise<DownloadResult> {
  const { toast } = options || {};

  try {
    // Try to find available files with fallback logic
    const url = await findAvailableFile();
    
    if (!url) {
      const error = "No download files available";
      toast?.({ title: "Download Failed", description: error });
      return { success: false, url: "", filename: "", error };
    }

    // Determine filename based on file type
    const filename = getFilenameFromUrl(url);
    
    // Trigger download
    await triggerDownload(url, filename);
    
    // Show success notification
    toast?.({
      title: url.includes(".apk") ? "Downloading APK" : "Downloading ZIP",
      description: url.includes(".apk")
        ? "File is downloading. Open it to install."
        : "File is downloading. Unzip to get the APK.",
    });

    return { success: true, url, filename };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast?.({ title: "Download Failed", description: errorMessage });
    return { success: false, url: "", filename: "", error: errorMessage };
  }
}

/**
 * Finds an available file to download with fallback logic
 */
async function findAvailableFile(): Promise<string | null> {
  // Try primary APK first
  if (await isFileAvailable(DOWNLOAD_CONFIG.apkFile)) {
    return DOWNLOAD_CONFIG.apkFile;
  }
  
  // Fallback to ZIP if APK not available
  if (await isFileAvailable(DOWNLOAD_CONFIG.zipFile)) {
    return DOWNLOAD_CONFIG.zipFile;
  }
  
  return null;
}

/**
 * Checks if a file is available at the given URL
 */
async function isFileAvailable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Extracts filename from URL
 */
function getFilenameFromUrl(url: string): string {
  if (url.includes("Live Sexy Chat.apk")) {
    return "Live Sexy Chat.apk";
  }
  if (url.includes(".apk")) {
    return "Live Sexy Chat.apk";
  }
  return "Live Sexy Chat.zip";
}

/**
 * Triggers the actual download
 */
async function triggerDownload(url: string, filename: string): Promise<void> {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  link.remove();
}

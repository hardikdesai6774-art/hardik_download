import { Download } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { downloadApkOrZip } from "@/lib/downloadApk";
import { OPEN_DOWNLOAD_EVENT } from "@/components/DownloadInterstitial";

const DownloadBar = () => {
  const { toast } = useToast();
  const isAndroid = useMemo(() => /Android/i.test(navigator.userAgent), []);

  const handleDownload = useCallback(async () => {
    if (!isAndroid) {
      toast({ title: "Android only", description: "This app is currently available for Android devices only." });
      return;
    }
    // Open interstitial which starts download + countdown
    window.dispatchEvent(new Event(OPEN_DOWNLOAD_EVENT));
  }, [isAndroid, toast]);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40">
      <div className="mx-auto max-w-[412px] w-full px-4 pb-[max(env(safe-area-inset-bottom),10px)] pt-2 overflow-hidden">
        <button
          type="button"
          disabled={!isAndroid}
          onClick={handleDownload}
          className={
            "w-full rounded-full text-center font-semibold active:scale-[0.99] transition-transform text-sm " +
            (isAndroid
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_6px_16px_rgba(16,185,129,0.28)]"
              : "bg-rose-50 text-rose-600 cursor-not-allowed")
          }
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Download className="w-3.5 h-3.5" />
            {isAndroid ? "DOWNLOAD" : "Open on Android to Install"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DownloadBar;

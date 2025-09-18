import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useMemo, useState } from "react";
import { downloadApkOrZip } from "@/lib/downloadApk";
import { OPEN_DOWNLOAD_EVENT } from "@/components/DownloadInterstitial";
import { useToast } from "@/hooks/use-toast";

const AppStoreSection = () => {
  const { toast } = useToast();
  const [howOpen, setHowOpen] = useState(false);
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
    <section className="py-6 bg-white" data-aos="fade-up">
      <Card className="p-0 border-0 shadow-none bg-transparent">
          <div className="flex flex-row items-start gap-3" data-aos="fade-up" data-aos-delay="100">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <img
                src="https://i.ibb.co/whC9JDTv/Untitled-design-4.png"
                alt="FRND App Icon"
                className="w-14 h-14 md:w-20 md:h-20 rounded-xl shadow-lg"
              />
            </div>

            {/* App Info */}
            <div className="flex-1 text-left">
              <h1 className="text-xl md:text-3xl font-bold text-black mb-1">
                Live Sexy Chat - XnXX
              </h1>
              <p className="text-base md:text-lg font-semibold text-green-700 mb-3">
                2.00₹ Me Video Calls
              </p>
            </div>
          </div>

          {/* Rating and Stats - full width, starts under icon */}
          <div className="w-full mt-2 mb-5 md:mb-6" data-aos="fade-up" data-aos-delay="150">
            <div className="flex items-start justify-between -ml-1">
              {/* Rating */}
              <div className="pr-2">
                <div className="flex items-center justify-start gap-1 mb-1 text-black">
                  <span className="text-xl md:text-2xl font-bold">4.4</span>
                  <span className="text-xl">★</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400">143K reviews</p>
              </div>

              {/* Divider */}
              <span className="mx-1 h-7 w-px bg-gray-300 self-center"></span>

              {/* Downloads */}
              <div className="px-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1 text-black">
                  <span className="text-lg md:text-xl font-bold">10M+</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Downloads</p>
              </div>

              {/* Divider */}
              <span className="mx-1 h-7 w-px bg-gray-300 self-center"></span>

              {/* Age */}
              <div className="pl-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center rounded-[4px] px-2.5 py-0.5 text-xs md:text-sm font-semibold text-black border border-gray-600">12+</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400">Rated for 12+</p>
              </div>
            </div>
          </div>

          {/* Download + How to install */}
          <div className="mt-4 space-y-3">
            <Button 
              size="lg" 
              disabled={!isAndroid}
              className={
                `relative overflow-hidden w-full px-6 py-4 md:py-4 font-bold rounded-full shadow-lg tracking-wide before:content-[''] before:absolute before:inset-0 before:pointer-events-none ` +
                (isAndroid 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white before:bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_10%,rgba(255,255,255,0.4)_30%,rgba(255,255,255,0.15)_50%,transparent_60%)]" 
                  : "bg-rose-50 text-rose-600 hover:bg-rose-50 cursor-not-allowed")
              }
              data-aos="fade-up"
              data-aos-delay="200"
              onClick={handleDownload}
            >
              {isAndroid ? "DOWNLOAD NOW" : "Open on Android to Install"}
            </Button>

            <Dialog open={howOpen} onOpenChange={setHowOpen}>
              <div className="text-center">
                <DialogTrigger asChild>
                  <button className="text-sm text-emerald-700 hover:underline">How to install?</button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Install on Android</DialogTitle>
                  <DialogDescription>Follow these quick steps to install the APK.</DialogDescription>
                </DialogHeader>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Tap "Download Now" to download the APK.</li>
                  <li>When prompted, allow downloads from this source (Unknown apps).</li>
                  <li>Open the downloaded file from the notification or Downloads app.</li>
                  <li>Tap Install and wait for completion.</li>
                  <li>Open the app from your home screen.</li>
                </ol>
              </DialogContent>
            </Dialog>
          </div>
      </Card>
    </section>
  );
};

export default AppStoreSection;
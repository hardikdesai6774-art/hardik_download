import { useRef, useState } from "react";
import videoSrc from "../assets/WhatsApp Video 2025-08-25 at 22.11.47.mp4";
import girlPhone from "../assets/WhatsApp Image 2025-08-26 at 10.44.47.jpeg";
import videoThumbnail from "../assets/thumbnail.png";

const ScreenshotsCarousel = () => {
  // Provide three images after the video. Replace the first entry with your uploaded image path.
  // Put the given image into /public as /girl-phone.jpg (or change the path below).
  const images = [
    girlPhone,
    "https://play-lh.googleusercontent.com/0L5aqd2hxUq5gyssh9sMHcywOwOOTJFFWnSf5_mcS_VKoFUS2wm_WMGCTj-o9n8lAw=w1052-h592-rw",
    "https://play-lh.googleusercontent.com/2YiTHYVwB8iQ2YUneWZI7V8xM5EZLtiSWYQ2Dl2BtnOx_qbWI2qGDopgqcdM34eGOFY=w1052-h592-rw",
  ];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false; // unmute so audio plays
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      v.muted = true;
      setIsPlaying(false);
    }
  };

  return (
    <section className="bg-white" data-aos="fade-up">
      {/* H-scroll strip per spec */}
      <div className="w-full overflow-x-auto px-3 py-4 [scroll-padding-inline:12px]">
        <ul className="flex items-end gap-4 snap-x snap-mandatory pr-3">
          {/* First: VIDEO tile (smaller width, keep 3:4 and radius) */}
          <li className="snap-start shrink-0 w-[180px] md:w-[200px] aspect-[3/4] rounded-2xl overflow-hidden bg-white relative">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={videoThumbnail}
              loop
              muted
              playsInline
              // @ts-ignore - ensure no native overlay
              controls={false}
              preload="metadata"
              className="w-full h-full object-contain object-center"
            >
              Your browser does not support the video tag.
            </video>
            {/* Dim overlay when paused */}
            {!isPlaying && <div className="absolute inset-0 bg-black/20" />}
            {/* Play/Pause overlay button */}
            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className={`transition-opacity duration-150 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                  <path d="M18 14L32 24L18 34V14Z" fill="#000" fillOpacity="0.8" />
                </svg>
              </span>
            </button>
          </li>

          {/* Then: three IMAGE tiles (match video tile size) */}
          {images.map((src, i) => (
            <li
              key={`img-${i}`}
              className={`snap-start shrink-0 w-[180px] md:w-[200px] aspect-[3/4] rounded-2xl overflow-hidden bg-black relative`}
            >
              <img
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  if (t.src !== "/placeholder.svg") t.src = "/placeholder.svg";
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}; 

export default ScreenshotsCarousel;
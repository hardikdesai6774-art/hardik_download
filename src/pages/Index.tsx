import Header from "../components/Header";
import AppStoreSection from "../components/AppStoreSection";
import ScreenshotsCarousel from "../components/ScreenshotsCarousel";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import BackersSection from "../components/BackersSection";
import MediaCoverageSection from "../components/MediaCoverageSection";
import Footer from "../components/Footer";
import DownloadBar from "../components/DownloadBar";
import DownloadInterstitial from "../components/DownloadInterstitial";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-28 overflow-x-hidden">
      <Header />
      <main className="px-4">
        <div className="max-w-[412px] w-full mx-auto">
          <AppStoreSection />
          <ScreenshotsCarousel />
          <FeaturesSection />
          <TestimonialsSection />
          <BackersSection />
          <MediaCoverageSection />
        </div>
      </main>
      <Footer />
      <DownloadBar />
      <DownloadInterstitial />
    </div>
  );
};

export default Index;

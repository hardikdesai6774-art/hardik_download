import videoCallIcon from "@/assets/video-call-icon.png";
import friendshipIcon from "@/assets/friendship-icon.png";
import giftingIcon from "@/assets/gifting-icon.png";
import moderationIcon from "@/assets/moderation-icon.png";
import aiAvatarIcon from "@/assets/ai-avatar-icon.png";

const FeaturesSection = () => {
  const features = [
    {
      icon: friendshipIcon,
      title: "FRND-ship via Matchmaker on Audio Streaming"
    },
    {
      icon: giftingIcon,
      title: "Virtual Gifting driven Monetisation"
    },
    {
      icon: moderationIcon,
      title: "Moderated / Non-sleazy Community"
    },
    {
      icon: aiAvatarIcon,
      title: "No pictures Only AI avatars"
    }
  ];

  return (
    <section className="py-8 px-4 mt-16 bg-gradient-to-b from-pink-50 to-pink-100" data-aos="fade-up">
      <div className="container max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Sexy Video Calls in 2.00₹
          </h1>
        </div>

        <div className="space-y-14">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-6"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-800 leading-snug">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
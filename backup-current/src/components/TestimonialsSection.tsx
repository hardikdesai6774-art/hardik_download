import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Hope",
      avatar: "https://frnd.app/static/media/user1.85644ba7.png",
      rating: 5,
      content: "APP ki Journey bohut achi thi, Pyar ho gya ish app se. busy life me thora sa waqt yaha bita kar maja aa jata hai,💝itne ache dost dene k liye🤗 Tq"
    },
    {
      name: "Rj Vijaya",
      avatar: "https://frnd.app/static/media/user2.54d14981.png",
      rating: 5,
      content: "I think to be a part of FRND app is the one of the best decision of my life. i was struggling a lot and in the main covid time. I believe people should come play with us on FRND"
    },
    {
      name: "RJ Anju..😍",
      avatar: "https://frnd.app/static/media/user3.3b67c2a6.png",
      rating: 5,
      content: "I really love this application 😊 I got good friends from this app 🙂Yahan Logon se baten karna bahut Achcha lagta hai. Fabulous app"
    }
  ];

  return (
    <section data-aos="fade-up">
      {/* Header section */}
      <div className="py-16 px-4 bg-gray-100">
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-4 mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our users love us
            </h2>
          </div>
        </div>
      </div>

      {/* Testimonials with alternating backgrounds */}
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          {/* Stars and content on white background */}
          <div className="py-8 px-4 bg-white">
            <div className="container max-w-md mx-auto text-center" data-aos="fade-up" data-aos-delay={100 + index * 100}>
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-800 leading-relaxed text-center text-sm">
                {testimonial.content}
              </p>
            </div>
          </div>

          {/* Avatar + Name on gray background */}
          <div className="py-8 px-4 bg-gray-100">
            <div className="container max-w-md mx-auto">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TestimonialsSection;
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "#" },
        { label: "Features", href: "#features" },
        { label: "Careers", href: "#careers" },
        { label: "Safety Center", href: "#safety" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms-of-use" },
        { label: "Community Guidelines", href: "/community-guidelines" }
      ]
    }
  ];

  return (
    <footer className="bg-[#0B0F14] text-white" data-aos="fade-in">
      <div className="mx-auto max-w-[420px] px-6 py-12">
        {/* Brand */}
        <div className="text-center mb-8" data-aos="fade-up">
          <span className="italic font-semibold text-4xl">frnd</span>
        </div>

        {/* Links (single column) */}
        <nav className="text-center mb-8" data-aos="fade-up" data-aos-delay={100}>
          <ul className="space-y-4">
            <li><a href="#" className="hover:opacity-90">Home</a></li>
            <li><a href="#features" className="hover:opacity-90">Features</a></li>
            <li><a href="#careers" className="hover:opacity-90">Careers</a></li>
            <li><a href="#safety" className="hover:opacity-90">Safety Center</a></li>
            <li><a href="/privacy" className="hover:opacity-90">Privacy Policy</a></li>
            <li><a href="/terms-of-use" className="hover:opacity-90">Terms of Use</a></li>
            <li><a href="/community-guidelines" className="hover:opacity-90">Community Guidelines</a></li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="text-center space-y-3 mb-6" data-aos="fade-up" data-aos-delay={200}>
          <a href="mailto:careers@frnd.app" className="inline-flex items-center justify-center gap-2 opacity-90 hover:opacity-100">
            <Mail className="w-4 h-4" /> careers@frnd.app
          </a>
          <div>
            HR - <a
              href="https://www.linkedin.com/in/tanisha-g-897477167/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >Tanisha Gagneja</a>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mb-8" data-aos="fade-up" data-aos-delay={250}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
            <Instagram className="w-4 h-4 text-white" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#0A66C2]">
            <Linkedin className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Address */}
        <div className="text-center text-sm opacity-90 space-y-1 mb-8" data-aos="fade-up" data-aos-delay={300}>
          <p>Urban Vault No. 1350 ,</p>
          <p>19th Main, 17th Cross Road,</p>
          <p>HSR Layout 1st sector opposite,</p>
          <p>Gnan shrishti school Bengaluru,</p>
          <p>Karnataka India, 560102</p>
        </div>

        {/* Copyright */}
        <div className="text-center pb-2" data-aos="fade-up" data-aos-delay={350}>
          <p className="text-xs opacity-80">© 2024 Cold Brew Tech Private Limited All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
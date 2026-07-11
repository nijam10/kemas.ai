import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerNavigation = {
  product: [
    { name: "Generate Design", href: "/generate" },
    { name: "3D Preview", href: "/preview/demo" },
    { name: "Gallery", href: "/gallery" },
    { name: "History", href: "/history" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Technology", href: "/technology" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api-docs" },
    { name: "Contact Us", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#27272a] relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold tracking-tight">
                <span className="text-[#FCFBF7]">Kemas.</span>
                <span className="text-[#F97316]">ai</span>
              </span>
            </Link>
            <p className="text-base text-[#a1a1aa] leading-relaxed mb-8">
              AI-powered packaging design for Indonesian UMKM. Generate stunning,
              market-ready designs in seconds with FLUX.1 + LoRA technology.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <a
                  href="mailto:hello@kemas.ai"
                  className="hover:text-[#FCFBF7] transition-colors duration-300"
                >
                  hello@kemas.ai
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                <Phone className="w-4 h-4 text-[#F97316]" />
                <span>+62 812 3456 7890</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FCFBF7] mb-5 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3.5">
              {footerNavigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FCFBF7] mb-5 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3.5">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FCFBF7] mb-5 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3.5">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold text-[#FCFBF7] mb-5 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3.5">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t border-[#27272a]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-sm text-[#a1a1aa]">
                © {new Date().getFullYear()} Kemas.ai. All rights reserved.
              </p>
              <div className="hidden md:block w-px h-4 bg-[#27272a]" />
              <p className="text-sm text-[#737373]">
                Built at{" "}
                <span className="text-[#F97316] font-semibold">Polibatam PBL</span>
              </p>
            </div>
            <div className="flex items-center gap-8">
              <a
                href="https://twitter.com/kemasai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-all duration-300 hover:scale-110"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com/kemasai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-all duration-300 hover:scale-110"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/kemasai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-all duration-300 hover:scale-110"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/kemasai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a1a1aa] hover:text-[#F97316] transition-all duration-300 hover:scale-110"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

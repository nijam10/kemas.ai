import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Kemas<span className="text-amber-500">.ai</span>
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/ai-design" className="hover:text-gray-900 transition">
            AI Design
          </Link>
          <Link href="/services" className="hover:text-gray-900 transition">
            Design Services
          </Link>
          <Link href="/tools" className="hover:text-gray-900 transition">
            Tools
          </Link>
          <Link href="/printing" className="hover:text-gray-900 transition">
            Printing
          </Link>
          <Link href="/pricing" className="hover:text-gray-900 transition">
            Pricing
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition">
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
}

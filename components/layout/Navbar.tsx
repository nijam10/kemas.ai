import Link from "next/link";
import Button from "../ui/Button"; // Import komponen Button reusable

export default function Navbar() {
  return (
    // Menggunakan bg-brand-bg agar menyatu dengan background body
    <nav className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl font-bold tracking-tight text-brand-navy">
            Kemas<span className="text-brand-accent">.ai</span>
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="/ai-design" className="hover:text-brand-navy transition-colors">
            AI Design
          </Link>
          <Link href="/services" className="hover:text-brand-navy transition-colors">
            Design Services
          </Link>
          <Link href="/tools" className="hover:text-brand-navy transition-colors">
            Tools
          </Link>
          <Link href="/printing" className="hover:text-brand-navy transition-colors">
            Printing
          </Link>
          <Link href="/pricing" className="hover:text-brand-navy transition-colors">
            Pricing
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Menggunakan Button variant="dark" agar hitamnya identik dengan tombol lainnya */}
          <Button variant="dark" size="sm" className="px-5">
            Log in
          </Button>
        </div>
      </div>
    </nav>
  );
}
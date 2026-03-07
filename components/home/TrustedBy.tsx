import { Leaf, Wheat, Coffee, Croissant, ShoppingBag } from "lucide-react";

export default function TrustedBy() {
    return (
    <section className="py-10 border-y border-gray-100 bg-white/40 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-medium text-gray-400 mb-8 uppercase tracking-wider">
            Trusted by forward-thinking UMKM & local food brands
        </p>

        {/* Logo Container */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
          {/* Fictional Brand 1 */}
            <div className="flex items-center gap-2 text-gray-800 transition-transform hover:scale-105 duration-300">
            <Leaf className="w-6 h-6" />
            <span className="text-xl font-bold font-serif tracking-tight">
                NusaSnack
            </span>
            </div>

          {/* Fictional Brand 2 */}
        <div className="flex items-center gap-2 text-gray-800 transition-transform hover:scale-105 duration-300">
            <Wheat className="w-6 h-6" />
            <span className="text-lg font-black tracking-widest uppercase">
            AgroBite
            </span>
        </div>

          {/* Fictional Brand 3 */}
        <div className="flex items-center gap-2 text-gray-800 transition-transform hover:scale-105 duration-300">
            <Coffee className="w-6 h-6" />
            <span className="text-xl font-semibold italic">BrewLokal</span>
        </div>

          {/* Fictional Brand 4 */}
        <div className="flex items-center gap-2 text-gray-800 transition-transform hover:scale-105 duration-300">
            <Croissant className="w-6 h-6" />
            <span className="text-xl font-medium tracking-tighter">
            ArtisanBakery
            </span>
        </div>

          {/* Fictional Brand 5 */}
        <div className="flex items-center gap-2 text-gray-800 transition-transform hover:scale-105 duration-300">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-lg font-bold uppercase border-2 border-gray-800 px-2 py-0.5">
            KriyaFood
            </span>
        </div>
        </div>
    </div>
    </section>
    );
}

"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rina Putri",
    role: "Owner, Keripik Rumah Rasa",
    quote:
      "Kemas.ai membantu kami melihat konsep kemasan sebelum produksi. Prompt-nya sederhana, hasilnya terlihat jauh lebih premium, dan logo tetap rapi di desain.",
    initials: "RP",
    rotation: "-rotate-1",
  },
  {
    name: "Ahmad Fauzan",
    role: "Founder, Dapoer Singkong",
    quote:
      "Biasanya kami perlu bolak-balik revisi visual. Sekarang konsep awal bisa dibuat lebih cepat, lalu langsung dipreview dalam bentuk mockup kemasan.",
    initials: "AF",
    rotation: "rotate-1",
  },
  {
    name: "Siti Marlina",
    role: "UMKM Snack Lokal",
    quote:
      "Yang paling membantu adalah sistem kredit dan riwayat desain. Hasil lama bisa dibuka lagi tanpa harus generate ulang.",
    initials: "SM",
    rotation: "-rotate-0.5",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-white border-t border-[#E5E4E0] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/3 via-transparent to-[#FACC15]/3" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="text-center mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6"
          >
            Built for UMKM packaging workflows
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed"
          >
            Kemas.ai helps small food brands move from raw product ideas to
            premium packaging visuals faster, cleaner, and with better brand
            consistency.
          </motion.p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative ${testimonial.rotation}`}
            >
              <div className="bg-gradient-to-br from-[#FCFBF7] to-[#F3F2EE] rounded-3xl border-2 border-[#E5E4E0] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                {/* Decorative tape element */}
                <div className="absolute -top-3 right-12 w-20 h-6 bg-gradient-to-r from-[#F97316] to-[#FACC15] rounded-sm opacity-80 shadow-md" 
                     style={{ transform: 'rotate(-2deg)' }} 
                />

                {/* Quote mark decoration */}
                <div className="absolute top-6 left-6 text-6xl text-[#F97316]/10 leading-none">
                  "
                </div>

                {/* Quote */}
                <p className="text-[#1A1A1A] leading-relaxed mb-8 text-base relative z-10 pt-4">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Initials Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-base">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#737373] font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

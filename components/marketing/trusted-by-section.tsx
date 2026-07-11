"use client";

import { motion } from "framer-motion";

export default function TrustedBySection() {
  // Real UMKM partners from database seed
  const companies = [
    { name: "Keripik Rumah Rasa", width: "w-36" },
    { name: "Dapoer Singkong", width: "w-36" },
    { name: "Kopi Aren Nusantara", width: "w-44" },
    { name: "Sambal Bu Rina", width: "w-32" },
    { name: "Teh Organik Lestari", width: "w-40" },
    { name: "Snack Lokal Batam", width: "w-36" },
  ];

  return (
    <section className="py-12 px-6 bg-[#FCFBF7] border-t border-[#E5E4E0]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-[#737373] mb-8">
            Trusted by leading companies
          </p>

          {/* Logo Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-auto h-8 flex items-center justify-center`}
              >
                {/* Monochrome logo placeholder */}
                <div className="text-[#737373]/60 font-bold text-base tracking-tight hover:text-[#737373] transition-colors duration-300">
                  {company.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

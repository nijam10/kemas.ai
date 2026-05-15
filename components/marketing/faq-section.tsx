"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, Package, Sparkles, Layers } from "lucide-react";

const faqs = [
  {
    question: "How many credits do I get per day?",
    answer:
      "Each UMKM account receives 40 daily credits. One successful AI generation uses 10 credits.",
  },
  {
    question: "Does downloading old designs reduce my credits?",
    answer:
      "No. Designs saved in your history can be viewed and downloaded again without reducing your daily credits.",
  },
  {
    question: "Can I upload my own logo?",
    answer:
      "Yes. Kemas.ai is designed to place transparent PNG logos precisely on the generated packaging using deterministic compositing.",
  },
  {
    question: "Can I preview the packaging in 3D?",
    answer:
      "Yes. Generated 2D designs can be mapped onto an interactive 3D packaging mockup that can be rotated in the browser.",
  },
  {
    question: "Is the output ready for print?",
    answer:
      "The system is designed to support high-resolution visual output for packaging mockups. Final production files should still be checked before mass printing.",
  },
  {
    question: "Do I need to understand AI settings?",
    answer:
      "No. Technical AI parameters are hidden so users can focus on describing the packaging they want.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-[#FCFBF7] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-[#FACC15]/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Heading with decorative elements */}
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
            className="lg:sticky lg:top-32 lg:self-start relative"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight"
            >
              Questions before creating your first design?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-[#737373] leading-relaxed mb-12"
            >
              Everything UMKM users need to understand about credits, logo
              upload, 3D preview, and high-resolution output.
            </motion.p>

            {/* Floating decorative UI snippets */}
            <div className="hidden lg:block space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl border-2 border-[#E5E4E0] p-5 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-[#E5E4E0] rounded-full mb-1.5" />
                    <div className="h-1.5 w-16 bg-[#F3F2EE] rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-[#F3F2EE] rounded-full" />
                  <div className="h-1.5 w-3/4 bg-[#F3F2EE] rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl border-2 border-[#E5E4E0] p-5 shadow-lg max-w-xs ml-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FACC15] to-[#F97316] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-[#E5E4E0] rounded-full mb-1.5" />
                    <div className="h-1.5 w-14 bg-[#F3F2EE] rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-[#F3F2EE] rounded-full" />
                  <div className="h-1.5 w-5/6 bg-[#F3F2EE] rounded-full" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white rounded-2xl border-2 border-[#E5E4E0] p-5 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#FACC15] rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-[#E5E4E0] rounded-full mb-1.5" />
                    <div className="h-1.5 w-12 bg-[#F3F2EE] rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-[#F3F2EE] rounded-full" />
                  <div className="h-1.5 w-2/3 bg-[#F3F2EE] rounded-full" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="border-b-2 border-[#E5E4E0] last:border-b-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-7 flex items-start justify-between gap-6 text-left group"
                >
                  <span className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#F97316] transition-colors duration-300">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F2EE] group-hover:bg-[#F97316] transition-all duration-300">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-[#F97316] group-hover:text-white transition-colors duration-300" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#737373] group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pr-14">
                        <p className="text-[#737373] text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

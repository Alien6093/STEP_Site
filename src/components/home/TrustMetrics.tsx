"use client";

import * as motion from "motion/react-client";

const metrics = [
  { value: "300+", label: "Start-ups Supported" },
  { value: "11", label: "Successful Investment Exits" },
  { value: "20+", label: "Years of Legacy since 2004" },
];

export default function TrustMetrics() {
  return (
    <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center justify-center text-center space-y-2 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-100 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform-gpu"
            >
              <h3 className="text-5xl md:text-6xl font-bold text-primary tracking-tight">
                {metric.value}
              </h3>
              <p className="text-base md:text-lg font-medium text-foreground/80 uppercase tracking-wide">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

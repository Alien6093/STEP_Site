import Image from "next/image";
import * as motion from "motion/react-client";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeadershipProfile() {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Meet Our Leadership
            </h2>
            <div className="w-20 h-1.5 bg-primary mt-4 mx-auto md:mx-0 rounded-full" />
          </div>

          <div className="group cursor-pointer bg-white/60 backdrop-blur-md dark:bg-zinc-900 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl p-8 md:p-12 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl transform-gpu">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
              
              {/* Image Column */}
              <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 blur-[20px] opacity-20 rounded-xl" />
                <div className="relative w-64 h-64 md:w-[300px] md:h-[300px] rounded-xl overflow-hidden shadow-md border border-border bg-zinc-100">
                  <Image
                    src="/ceo-profile.jpg"
                    alt="Prof. (Dr.) Satyendra Patnaik"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-col space-y-6 flex-1 text-center md:text-left mt-4 md:mt-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-blue-700 transition-colors duration-300">
                    Prof. (Dr.) Satyendra Patnaik
                  </h3>
                  <p className="text-lg font-medium text-slate-500 group-hover:text-blue-700 transition-colors duration-300 mt-1">
                    Chief Executive Officer, JSSATE-STEP Noida & Dean (School of Management)
                  </p>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-border">
                  STARTUP Evangelist | IIM-K Alumni
                </div>

                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  A seasoned startup evangelist and educational leader with extensive experience scaling innovation ecosystems. With over a decade of association with the Atal Innovation Mission as a Mentor of Change, and strategic roles at the Wadhwani Foundation and Amity Innovation Incubator, he brings unparalleled vision to JSS STEP. He holds a Ph.D. in Retail Management and executive education credentials from IIM Kozhikode and NMIMS.
                </p>

                <div className="pt-4 flex justify-center md:justify-start">
                  <Button className="gap-2 bg-slate-400 text-white group-hover:bg-blue-700 transition-colors duration-300" asChild>
                    <span
                      role="button"
                      aria-disabled="true"
                      title="LinkedIn profile coming soon"
                      className="cursor-not-allowed opacity-70 inline-flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      Connect on LinkedIn
                    </span>
                  </Button>
                </div>
                
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

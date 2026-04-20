"use client";

import { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoreTeam() {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="py-24 px-4 border-t border-border">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center md:text-left max-w-5xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Meet Our Core Team
          </h2>
          <div className="w-16 h-1 bg-primary mt-3 mx-auto md:mx-0 rounded-full" />
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Team Member Card: Anshika Aggarwal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-800 p-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-border/50 bg-zinc-200">
                {!imgError ? (
                  <Image
                    src="/manager-profile.jpg"
                    alt="Anshika Aggarwal"
                    width={250}
                    height={250}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center
                                  bg-gradient-to-br from-violet-400 to-purple-500">
                    <span className="text-4xl font-black text-white/60 select-none">AA</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-8 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Anshika Aggarwal
                </h3>
                <p className="text-sm font-medium text-primary mt-0.5">
                  Assistant Incubation Manager
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-border text-xs font-semibold text-muted-foreground">
                  Brewing Startups in the Lab of Life | Microbiologist
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                Driving day-to-day startup operations and program management. With a strong foundation in microbiology and experience with BIRAC BIONEST, she bridges the gap between scientific innovation and operational execution for our incubated founders.
              </p>

              <div className="pt-4 border-t border-border mt-auto">
                <Button variant="outline" className="w-full gap-2 border-border hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all" asChild>
                  <span
                    role="button"
                    aria-disabled="true"
                    title="LinkedIn profile coming soon"
                    className="cursor-not-allowed opacity-60 inline-flex items-center gap-2 w-full"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Placeholder cards for future team members could go here */}
          
        </div>
      </div>
    </section>
  );
}

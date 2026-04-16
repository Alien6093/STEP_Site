import * as motion from "motion/react-client";

export default function LegacySection() {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-primary/10 text-primary uppercase">
              Our Legacy & Mission
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Nourishing Entrepreneurial Spirit in Technocrats for <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Global Excellence.</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Established in 2004, JSS Business Incubator stands as one of India&apos;s pioneering Technology Business Incubators (TBI), proudly supported by the Department of Science and Technology (DST).
              </p>
              <p>
                Our core mission is to meticulously identify, deeply engage, and steadfastly hand-hold potential innovations. We are committed to building a world-class knowledge pool of mentors to support founders in robust capacity building, effectively bridging the gap between raw technological talent and thriving global enterprises.
              </p>
            </div>
          </motion.div>

          {/* Visual/Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
           <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-border">
              {/* Abstract corporate decoration since no specific image exists */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/5" />
              <div className="w-64 h-64 border-2 border-primary/20 rounded-full absolute -top-12 -right-12 blur-[1px]" />
              <div className="w-96 h-96 border border-primary/10 rounded-full absolute -bottom-24 -left-24 blur-[2px]" />
              
              <div className="z-10 w-4/5 max-w-md text-center space-y-4 p-12 md:p-16 bg-white/60 dark:bg-black/50 backdrop-blur-xl shadow-xl border border-white/50 dark:border-white/10 rounded-3xl transition-transform duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transform-gpu cursor-default">
                <p className="text-6xl md:text-7xl font-extrabold text-primary drop-shadow-sm">20+</p>
                <p className="text-base md:text-lg font-bold uppercase tracking-widest text-foreground">Years of Excellence</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

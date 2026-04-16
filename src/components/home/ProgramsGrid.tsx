"use client";

import * as motion from "motion/react-client";
import { Cpu, Globe, Wrench, Users, UserPlus, MapPin } from "lucide-react";

const programs = [
  {
    title: "NIDHI PRAYAS & Makers Lab",
    description:
      "Transforming innovative ideas into prototypes with dedicated funding and a state-of-the-art Makers Lab focused on deep tech.",
    icon: Cpu,
    className: "md:col-span-2",
  },
  {
    title: "Virtual Incubation",
    description:
      "Comprehensive remote support providing startups with elite mentorship, networking, and critical resources regardless of location.",
    icon: Globe,
    className: "md:col-span-2",
  },
  {
    title: "Advanced Manufacturing",
    description:
      "Access the Product Life-Cycle Management (PLM) Competency Centre and Centre for Advanced Manufacturing Technology (CAMT) to accelerate your hardware lifecycle.",
    icon: Wrench,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "BIZZNESS Student Program",
    description:
      "Empowering student entrepreneurs to develop ideas and build foundational business skills.",
    icon: Users,
    className: "md:col-span-1",
  },
  {
    title: "Choose-Your-Mentor",
    description:
      "Curated 1-on-1 expert guidance tailored directly to your startup's sector and unique challenges.",
    icon: UserPlus,
    className: "md:col-span-1",
  },
  {
    title: "Global Reach (JSS-GIZ)",
    description:
      "Expanding horizons through the Indo-German Cooperation Program, connecting startups with international markets.",
    icon: MapPin,
    className: "md:col-span-2",
  },
];

export default function ProgramsGrid() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Programs & <span className="text-primary">Infrastructure</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            World-class deep-tech facilities and comprehensive support architectures designed to accelerate your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group flex flex-col justify-between p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 ${program.className}`}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <program.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

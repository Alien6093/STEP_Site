import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import FocusAreas from "@/components/home/FocusAreas";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import PortfolioSpotlight from "@/components/home/PortfolioSpotlight";
import EventsPreview from "@/components/home/EventsPreview";
import Testimonials from "@/components/home/Testimonials";
import PartnersStrip from "@/components/home/PartnersStrip";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <StatsBar />
      <FocusAreas />
      <WhyChooseUs />
      <ProgramsPreview />
      <PortfolioSpotlight />
      <EventsPreview />
      <Testimonials />
      <PartnersStrip />
    </div>
  );
}


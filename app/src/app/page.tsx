import "@/styles/landing.css";
import Nav from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import ScenarioCarousel from "@/components/landing/scenario-carousel";
import ProblemSection from "@/components/landing/problem-section";
import HowItWorks from "@/components/landing/how-it-works";
import DataSources from "@/components/landing/data-sources";
import ProductPreview from "@/components/landing/product-preview";
import FinalCta from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";
import ScrollReveal from "@/components/landing/scroll-reveal";

export default function LandingPage() {
  return (
    <ScrollReveal>
      <Nav />
      <Hero />
      <ScenarioCarousel />
      <ProblemSection />
      <HowItWorks />
      <DataSources />
      <ProductPreview />
      <FinalCta />
      <Footer />
    </ScrollReveal>
  );
}

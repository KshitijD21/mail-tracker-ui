import ComingSoonFeatures from "@/components/coming-soon";
import Faq from "@/components/faq";
import FeatureSection from "@/components/features";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section"; // adjust path as needed
import Navbar from "@/components/shared/navbar/components/navbar";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ComingSoonFeatures />

      <Testimonials />

      <Faq />
      <Footer />
    </main>
  );
}

import Navbar from "@/components/shared/navbar/components/navbar";
import HeroSection from "@/components/hero-section"; // adjust path as needed
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";
import FeatureSection from "@/components/features";
import Footer from "@/components/footer";
import ComingSoonFeatures from "@/components/coming-soon";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ComingSoonFeatures />
      <section className="pt-20">
        <Testimonials />
      </section>
      <Faq />
      <Footer />
    </main>
  );
}

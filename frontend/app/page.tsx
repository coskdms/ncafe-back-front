import styles from "./page.module.css";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HighlightBar from "@/components/landing/HighlightBar";

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <HighlightBar />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}

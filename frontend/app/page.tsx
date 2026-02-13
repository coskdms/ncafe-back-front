
import styles from "./page.module.css";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import MarqueeSection from "@/components/landing/MarqueeSection";


export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}

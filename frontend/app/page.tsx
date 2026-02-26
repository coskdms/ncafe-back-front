import styles from "./page.module.css";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import HighlightBar from "@/components/landing/HighlightBar";
import Navbar from "@/components/landing/Navbar";
import FallingBeans from "@/components/landing/FallingBeans";
import CursorBeans from "@/components/landing/CursorBeans";

import LocationSection from "@/components/landing/LocationSection";

export default function Home() {
  return (
    <main className={styles.main}>
      <FallingBeans />
      <CursorBeans />
      <Navbar />
      <HeroSection />
      <HighlightBar />
      <AboutSection />
      <FeaturesSection />
      <LocationSection />
      <Footer />
    </main>
  );
}

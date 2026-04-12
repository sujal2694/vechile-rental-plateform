"use client";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import FeaturedVehicles from "./components/FeaturedVehicles";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <FeaturedVehicles />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

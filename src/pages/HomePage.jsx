// src/pages/HomePage.jsx
import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import TourGrid from "../components/TourGrid.jsx";
import FAQSection from "../components/FAQSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TourGrid />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HomePage;

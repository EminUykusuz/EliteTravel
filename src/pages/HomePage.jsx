// src/pages/HomePage.jsx
import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import TourGrid from "../components/TourGrid.jsx";
import ScheduleSection from "../components/ScheduleSection.jsx";
import WhyUsSection from "../components/WhyUsSection.jsx";
import FAQSection from "../components/FAQSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TourGrid />
      <ScheduleSection />
      <WhyUsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HomePage;

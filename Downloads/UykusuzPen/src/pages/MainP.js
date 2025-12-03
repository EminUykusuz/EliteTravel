import React from 'react';


import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Home from "../components/Home";
import Supluyer from "../components/Supplierr"; // Orijinal adıyla bıraktım

/**
 * Anasayfayı oluşturan tüm ana component'leri
 * tek bir yerde birleştiren component.
 */
function MainP() {
  return (
    <>
      <Hero />
      <Categories />
      <Home />
      <Supluyer />
    </>
  );
}

export default MainP;

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { HelmetProvider } from 'react-helmet-async'; // <-- 1. Helmet'i buraya import et

// Component ve Sayfa Importları
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Supluyer from "./components/Supplierr"; 
import Contact from "./pages/Contact";
import AboutUs from "./pages/About";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import Gallery from "./pages/gallery";
import BlogDetay from "./pages/BlogDetail";
import AdminLogin from "./pages/AdminLogin";
import ErrorBoundary from "./components/ErrorBoundary";
import ProjectDetail from "./pages/GaleryDetail"; 
import ProductDetailPage from "./pages/UrunDetay";
import SeoWrapper from "./components/Admin/SeoWrapper"; // <-- 2. Yeni SEO Wrapper'ı import et
import MainP from "./pages/MainP";

// Admin Componentleri
import AdminPanel from "./components/Admin/AdminPanel"; 
import Dashboard from "./components/Admin/Dashboard";
import UrunYonetimi from "./components/Admin/UrunYonetimi";
import Mesajlar from "./components/Admin/Mesajlar";
import AddGaleri from "./components/Admin/Projeler"; 
import BlogForm from "./components/Admin/Blog";
import ProtectedRoute from './components/ProtectedRoute'; 

// Sayfa yenilendiğinde en üste scroll yapar (Bu zaten harika)
function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

// Admin dışındaki sayfaları içeren layout
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* 3. TÜM ROTALARI 'SeoWrapper' İLE SARMALA */}
          <Route
            path="/"
            element={
              // 'anasayfa' tipini yolla
              <SeoWrapper sayfaTipi="anasayfa">
                <MainP />
              </SeoWrapper>
            }
          /> <Route
            path="/Anasayfa"
            element={
              // 'anasayfa' tipini yolla
              <SeoWrapper sayfaTipi="anasayfa">
                <MainP />
              </SeoWrapper>
            }
          />
          <Route 
            path="/hakkimizda" 
            element={
              // 'hakkimizda' tipini yolla
              <SeoWrapper sayfaTipi="hakkimizda">
                <AboutUs />
              </SeoWrapper>
            } 
          />
          <Route 
            path="/iletisim" 
            element={
              <SeoWrapper sayfaTipi="iletisim">
                <Contact />
              </SeoWrapper>
            } 
          />

          {/* Ürünler (Listesi) */}
          <Route 
            path="/urunler" 
            element={
              <SeoWrapper sayfaTipi="urunler">
                <Products />
              </SeoWrapper>
            } 
          />
          {/* Ürün Detay (Dinamik) */}
          <Route 
            path="/urunler/:slug" 
            element={
              // 'urun' tipini yolla (Wrapper :slug'ı kendi yakalar)
              <SeoWrapper sayfaTipi="urun">
                <ProductDetailPage />
              </SeoWrapper>
            } 
          />

          {/* Galeri (Listesi) */}
          <Route 
            path="/galeri" 
            element={
              <SeoWrapper sayfaTipi="galeri">
                <Gallery />
              </SeoWrapper>
            } 
          />
          {/* Galeri Detay (Dinamik) */}
          <Route 
            path="/galeri/:slug" 
            element={
              <SeoWrapper sayfaTipi="proje"> {/* sayfaTipi C#'taki ile eşleşmeli */}
                <ProjectDetail />
              </SeoWrapper>
            } 
          />

          {/* Blog (Listesi) */}
          <Route 
            path="/blog" 
            element={
              <SeoWrapper sayfaTipi="blog-liste"> {/* Örn: 'blog-liste' */}
                <Blog />
              </SeoWrapper>
            } 
          />
          {/* Blog Detay (Dinamik) */}
          <Route 
            path="/blog/:slug" 
            element={
              // 'blog' tipini yolla (Wrapper :slug'ı kendi yakalar)
              <SeoWrapper sayfaTipi="blog">
                <BlogDetay />
              </SeoWrapper>
            } 
          />

          {/* Kategoriye göre ürünler */}
          <Route 
            path="/kategori/:slug" 
            element={
              <SeoWrapper sayfaTipi="kategori">
                <Products />
              </SeoWrapper>
            } 
          />

          {/* 404 */}
          <Route path="*" element={<ErrorBoundary />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


function App() {
  // Lenis (Smooth Scroll) - Dokunma, harika çalışıyor
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      smoothTouch: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // 4. EN DIŞ TEPKİME 'HelmetProvider' İLE SARMALA
    <HelmetProvider>
      <Router>
        <ScrollManager /> {/* Her sayfa geçişinde yukarı scroll yapar */}
        <Routes>
          {/* === ADMIN YOLLARI === */}
          {/* (Değişiklik yok, burası mükemmel) */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel /> 
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="urunler" element={<UrunYonetimi />} />
            <Route path="mesajlar" element={<Mesajlar />} />
            <Route path="addgaleri" element={<AddGaleri />} />
            <Route path="blog" element={<BlogForm />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* === NORMAL SİTE YOLLARI === */}
          <Route path="/*" element={<AppContent />} />

        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;


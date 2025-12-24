// C:/Users/msı/Desktop/Freelance/Elite Travel/elite-travel/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useScrollToTop from './hooks/useScrollToTop';
import { authService } from './services/authService';
import { settingsService } from './serivces/genericService';
import api from './services/api';

// Layout Bileşenleri
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './pages/admin/layout/AdminLayout'; 

// PUBLIC (Müşteri) Sayfaları
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// AUTH Sayfaları
import LoginPage from './pages/LoginPage';
import TwoFactorPage from './pages/TwoFactorPage';

// ADMIN (Yönetici) Sayfaları
import Dashboard from './pages/admin/pages/Dashboard';
import AdminToursPage from './pages/admin/pages/ToursPage';
import AdminTourFormPage from './pages/admin/pages/AdminTourForm';
import GuidesPage from './pages/admin/pages/GuidesPage';
import UsersPage from './pages/admin/pages/UsersPage';
import CategoriesPage from './pages/admin/pages/CategoriesPage';
import SettingsPage from './pages/admin/pages/SettingsPage';
import MenuItemsPage from './pages/admin/pages/MenuItemsPage'; // 👈 DÜZELTME: ./ eklendi
import ContactMessagesPage from './pages/admin/pages/ContactMessagesPage';
import ReservationsPage from './pages/admin/pages/ReservationsPage';
import SecuritySettings from './pages/admin/pages/SecuritySettings';
import HowToUsePage from './pages/admin/pages/HowToUsePage';

// Protected Route - Admin routes
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = authService.isAuthenticated();
  const auth = authService.getAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.requires2FA) {
    return <Navigate to="/2fa" replace />;
  }

  return element;
};

// 2FA Route - Only accessible if requires2FA is true
const TwoFARoute = ({ element }) => {
  const auth = authService.getAuth();
  
  if (!auth?.requires2FA) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

function App() {
  useScrollToTop();

  useEffect(() => {
    // Favicon'u yükle ve Google Analytics'i başlat
    const loadSettings = async () => {
      try {
        const response = await settingsService.getAll();
        const data = response.data ? response.data[0] : response[0];
        
        // Favicon
        if (data?.faviconUrl) {
          const faviconLink = document.getElementById('favicon-link');
          if (faviconLink) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067/api';
            const baseURL = API_URL.replace('/api', '');
            const faviconUrl = data.faviconUrl;
            const fullUrl = faviconUrl.startsWith('/') ? `${baseURL}${faviconUrl}` : faviconUrl;
            faviconLink.href = `${fullUrl}?v=${Date.now()}`;
          }
        }
        
        // Google Analytics
        if (data?.googleAnalytics) {
          const gaId = data.googleAnalytics;
          
          // Google Analytics 4 (gtag.js)
          if (gaId.startsWith('G-')) {
            // Script'i ekle
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script1);
            
            // Config script'i ekle
            const script2 = document.createElement('script');
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `;
            document.head.appendChild(script2);
                      }
          // Universal Analytics (analytics.js)
          else if (gaId.startsWith('UA-')) {
            const script = document.createElement('script');
            script.innerHTML = `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              ga('create', '${gaId}', 'auto');
              ga('send', 'pageview');
            `;
            document.head.appendChild(script);
          }
        }
      } catch (error) {
        // Settings load failed
      }
    };
    
    loadSettings();

    // Session timeout kontrol et
    const checkSession = setInterval(() => {
      const auth = authService.getAuth();
      if (!auth && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }, 60000); // Her 1 dakikada kontrol et

    return () => clearInterval(checkSession);
  }, []);

  return (
    <Routes>
      {/* ============================================ */}
      {/* AUTH ROTALARI                               */}
      {/* ============================================ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/2fa" element={<TwoFARoute element={<TwoFactorPage />} />} />

      {/* ============================================ */}
      {/* ADMIN PANELİ ROTALARI (Protected)           */}
      {/* ============================================ */}
      <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<AdminToursPage />} />
        <Route path="tours/new" element={<AdminTourFormPage />} />
        <Route path="tours/edit/:id" element={<AdminTourFormPage />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="bookings" element={<ReservationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="messages" element={<ContactMessagesPage />} />
        <Route path="how-to-use" element={<HowToUsePage />} />
      </Route>

      {/* ============================================ */}
      {/* PUBLIC ROUTES                               */}
      {/* ============================================ */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/tours" element={<MainLayout><ToursPage /></MainLayout>} />
      <Route path="/tour/:slug" element={<MainLayout><TourDetailPage /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />

      {/* 404 Sayfası */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
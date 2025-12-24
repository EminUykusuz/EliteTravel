// C:/Users/msı/Desktop/Freelance/Elite Travel/elite-travel/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useScrollToTop from './hooks/useScrollToTop';
import { authService } from './services/authService';

// Layout Bileşenleri
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './pages/admin/layout/AdminLayout'; 

// PUBLIC (Müşteri) Sayfaları
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

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
      <Route path="*" element={
        <MainLayout>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-gray-600">Sayfa Bulunamadı</p>
          </div>
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
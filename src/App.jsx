// C:/Users/msı/Desktop/Freelance/Elite Travel/elite-travel/src/App.jsx

import { Routes, Route } from 'react-router-dom';
import useScrollToTop from './hooks/useScrollToTop';

// Layout Bileşenleri
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout'; 

// -----------------------------------------------
// PUBLIC (Müşteri) Sayfaları
// -----------------------------------------------
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

// -----------------------------------------------
// ADMIN (Yönetici) Sayfaları
// Not: Bu dosyaların src/pages/admin/ klasöründe olduğundan emin ol!
// -----------------------------------------------
import AdminToursPage from './pages/admin/AdminToursPage'; 
import AdminNewTourPage from './pages/admin/AdminNewTourPage'; 
import AdminEditTourPage from './pages/admin/AdminEditTourPage'; 
import AdminToursDashboard from './pages/admin/AdminToursDashboard';

function App() {
  useScrollToTop();

  return (
    <Routes>
      {/* ----------------------------------------------- */}
      {/* 1. ADMIN PANELİ ROTALARI (/admin ile başlayanlar) */}
      {/* ----------------------------------------------- */}
      <Route path="/admin" element={<AdminLayout />}>
          {/* /admin yazınca açılacak ana sayfa (Dashboard) */}
          <Route index element={<div>Admin Dashboard (Özet Raporlar)</div>} />
          
          {/* Tüm Turlar Listesi */}
          <Route path="tours" element={<AdminToursDashboard  />} />
          
          {/* Yeni Tur Ekle */}
          <Route path="tours/new" element={<AdminNewTourPage />} />
          
          {/* Tur Düzenle (ID parametresi alıyor) */}
          <Route path="tours/edit/:id" element={<AdminEditTourPage />} />
      </Route>


      {/* ----------------------------------------------- */}
      {/* 2. PUBLIC (MÜŞTERİ) ROTALARI (Geriye kalan her şey) */}
      {/* ----------------------------------------------- */}
      {/* Tüm public rotaları kapsayan "*" path'i kullandık. 
        Nested Routes (İç İçe Rotalar) kullanmak yerine, <Routes> içine <MainLayout> 
        koyarak tüm public rotaları tek bir layout içine almış olduk.
      */}
      <Route path="*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/turlar" element={<ToursPage />} />
            <Route path="/tur/:slug" element={<TourDetailPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            
            {/* 404 Sayfası */}
            <Route path="*" element={<div className="text-center py-20 font-bold">404 - Sayfa Bulunamadı</div>} />
          </Routes>
        </MainLayout>
      } />
      
    </Routes>
  );
}

export default App;
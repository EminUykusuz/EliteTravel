import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import useScrollToTop from './hooks/useScrollToTop';

function App() {
  useScrollToTop();

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/turlar" element={<ToursPage />} />
        <Route path="/tur/:slug" element={<TourDetailPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="*" element={<div className="text-center py-20 font-bold">404 - Sayfa Bulunamadı</div>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
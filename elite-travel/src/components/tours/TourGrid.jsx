// src/components/tours/TourGrid.jsx
import TourCard from './TourCard';
import { motion } from 'framer-motion';
import { SearchX, Compass } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Animasyon ayarları (Kartların sırayla gelmesi için)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 // Her kart arasında 0.15sn bekle
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function TourGrid({ tours }) {
  const { t } = useTranslation();

  // --- 1. BOŞ DURUM (EMPTY STATE) TASARIMI ---
  // Eğer tur yoksa sadece yazı yazmak yerine şık bir uyarı gösterelim.
  if (!tours || tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <SearchX size={48} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#163a58] mb-2">{t('tours.noToursFound')}</h3>
        <p className="text-gray-500 max-w-md">
          {t('tours.noToursDescription')}
        </p>
      </div>
    );
  }

  // --- 2. GRID YAPISI (ANIMASYONLU) ---
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Ekrana girdiği an çalışsın
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
    >
      {tours.map((tour) => (
        // Grid içindeki her öğeyi motion.div ile sarmalıyoruz ki 
        // yukarıdaki "staggerChildren" bunu yönetebilsin.
        <motion.div key={tour.id} variants={itemVariants} className="h-full">
          <TourCard tour={tour} />
        </motion.div>
      ))}
    </motion.div>
  );
}
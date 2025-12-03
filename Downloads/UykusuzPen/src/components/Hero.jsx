import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden z-0">
      {/* Arka plan resmi - Parallax efekti */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="/images/hero-bg.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Karartma efekti - Fade in */}
      <motion.div 
        className="absolute inset-0 bg-black/50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* İçerik */}
      <div className="relative z-20 max-w-3xl px-6">
        {/* Başlık - Yukarıdan gelme + fade */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          Uykusuz Pen | Demir & Çelik
        </motion.h1>

        {/* Açıklama - Fade in + scale */}
        <motion.p 
          className="text-lg md:text-xl text-gray-200 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          Dayanıklı PVC Pencere Sistemleri ve Güçlü Demir-Çelik Yapılar ile
          evinize ve işinize uzun ömürlü çözümler sunuyoruz.
        </motion.p>

        {/* Buton - Aşağıdan gelme + hover efekti */}
        <Link to="/urunler" reloadDocument>
          <motion.button 
            className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-red-700 transition-colors relative overflow-hidden group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Ürünlerimizi İncele</span>
            <motion.div
              className="absolute inset-0 bg-red-700"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </Link>

        {/* Scroll indicator - Bounce animasyonu */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
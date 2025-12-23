import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroGlass({ featuredTours }) {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* Arkaplan */}
      <div className="absolute inset-0 w-full h-full z-0">
         <img 
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-50"
            alt="Background"
         />
      </div>

      {/* Glass Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-[90%] max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-16 text-center shadow-2xl"
      >
        <span className="text-[#dca725] font-bold tracking-widest uppercase text-sm mb-4 block">{t('hero.badge')}</span>
        
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
          {t('hero.title')}
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex justify-center gap-4">
           <button className="px-10 py-4 bg-[#dca725] text-[#163a58] font-bold rounded-xl hover:bg-white transition-colors shadow-lg">
             {t('hero.bookNow')}
           </button>
           <button className="px-10 py-4 bg-transparent border border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
             {t('hero.learnMore')}
           </button>
        </div>
      </motion.div>
    </section>
  );
}
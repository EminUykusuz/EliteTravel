import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TourCardMinimal({ tour }) {
  const symbol = tour.currency === 'EUR' ? '€' : '₺';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      viewport={{ once: true }} 
      className="group relative bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full"
    >
      {/* Görsel - Biraz daha uzun (Aspect Ratio) */}
      <div className="relative aspect-[4/3.5] overflow-hidden">
        <img 
          src={tour.thumbnail}  
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        
        {/* Etiket Sol Üst */}
        <span className="absolute top-4 left-4 bg-[#dca725] text-[#163a58] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          {tour.type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Tarih - Küçük ve Şık */}
        <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-[#dca725]" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{tour.datesText}</span>
        </div>

        {/* Başlık */}
        <h3 className="text-lg font-bold text-[#163a58] mb-2 leading-snug group-hover:text-[#dca725] transition-colors">
          {tour.title}
        </h3>

        {/* Alt Kısım: Fiyat ve Yuvarlak Buton */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Başlangıç Fiyatı</span>
            <div className="flex items-baseline gap-0.5 text-[#163a58]">
                <span className="text-sm font-semibold">{symbol}</span>
                <span className="text-2xl font-extrabold">{tour.price}</span>
            </div>
          </div>

          {/* Yuvarlak Action Button */}
          <Link 
            to={`/tur/${tour.slug}`} 
            className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#163a58] group-hover:bg-[#163a58] group-hover:text-white transition-all duration-300 transform group-hover:rotate-45"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function TourCardMinimal({ tour }) {
  const { t } = useTranslation(['common', 'tours']);
  const symbol = tour.currency === 'EUR' ? '€' : '₺';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col h-full"
    >
      
      {/* Görsel Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img 
          src={tour.thumbnail}  
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" 
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        {!!tour.type && (
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-sm"
          >
            {tour.type}
          </motion.span>
        )}
      </div>

      <Link to={`/tour/${tour.slug}`} className="p-6 flex flex-col flex-grow no-underline text-inherit hover:no-underline">
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-3">
          {tour.guideName && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <MapPin size={13} className="text-amber-500 flex-shrink-0" />
              <span className="truncate">{tour.guideName}</span>
            </div>
          )}
          {Number.isFinite(tour.capacity) && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <Users size={13} className="text-amber-500 flex-shrink-0" />
              <span>{tour.capacity}</span>
            </div>
          )}
        </div>

        {/* Başlık */}
        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
          {tour.title}
        </h3>

        {/* Açıklama Snippet */}
        {tour.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {tour.description}
          </p>
        )}

        {/* Alt Kısım: Fiyat ve Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{t('tours.startingFrom')}</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-semibold text-slate-700">{symbol}</span>
              <span className="text-2xl font-bold text-slate-900">{tour.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowUpRight size={22} strokeWidth={2.5} />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
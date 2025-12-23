import { useParams } from 'react-router-dom';
import ScheduleSection from '../components/sections/ScheduleSection';
import BookingForm from '../components/tours/BookingForm';
import { MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { tourService } from '../services/tourService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TourDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation(['common', 'tours']);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadTour = async () => {
      setLoading(true);
      try {
        const dto = await tourService.getBySlug(slug);
        console.log('Tour DTO:', dto);
        
        if (!dto) {
          setTour(null);
          return;
        }

        const itinerary = (dto.itineraries || dto.Itineraries || [])
          .map((it) => ({
            day: it.dayNumber ?? it.DayNumber,
            title: it.title ?? it.Title,
            description: it.description ?? it.Description
          }))
          .sort((a, b) => (a.day || 0) - (b.day || 0));

        const extras = (dto.extras || dto.Extras || []).map((ex) => ({
          title: ex.title ?? ex.Title,
          price: ex.price ?? ex.Price
        }));

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067/api';
        const baseUrl = API_URL.replace('/api', ''); // Remove /api to get base URL

        const mainImageUrl = (dto.mainImage ?? dto.MainImage)?.startsWith('/') 
          ? baseUrl + (dto.mainImage ?? dto.MainImage)
          : (dto.mainImage ?? dto.MainImage);
        const thumbnailUrl = (dto.thumbnail ?? dto.Thumbnail)?.startsWith('/') 
          ? baseUrl + (dto.thumbnail ?? dto.Thumbnail)
          : (dto.thumbnail ?? dto.Thumbnail);

        console.log('🖼️ Backend\'den gelen:', { mainImage: dto.mainImage ?? dto.MainImage, thumbnail: dto.thumbnail ?? dto.Thumbnail });
        console.log('🌐 Oluşturulan URL:', { mainImageUrl, thumbnailUrl });

        setTour({
          id: dto.id ?? dto.Id,
          slug: dto.slug ?? dto.Slug,
          title: dto.title || dto.Title || '',
          description: dto.description || dto.Description || '',
          price: dto.price ?? dto.Price,
          currency: dto.currency ?? dto.Currency,
          capacity: dto.capacity ?? dto.Capacity,
          guideName: dto.guideName ?? dto.GuideName,
          mainImage: mainImageUrl,
          thumbnail: thumbnailUrl,
          itinerary,
          extras
        });
      } catch (e) {
        console.error('Error loading tour:', e);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    loadTour();
  }, [slug, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-slate-300 border-t-blue-900 rounded-full"></motion.div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-xl font-semibold text-slate-900">{t('tourDetail.notFound')}</p>
        </motion.div>
      </div>
    );
  }

  const symbol = tour.currency === 'EUR' ? '€' : '₺';

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pb-20 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      {/* HERO SECTION */}
      <motion.div variants={itemVariants} className="relative h-[70vh] overflow-hidden group">
        <img 
          src={tour.mainImage || tour.thumbnail || 'https://via.placeholder.com/1200x800?text=Tour'} 
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-300"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>

        <motion.div variants={itemVariants} className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight drop-shadow-lg">{tour.title}</h1>
          


          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {tour.guideName && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
                <MapPin size={18} /> 
                <span className="font-semibold">{tour.guideName}</span>
              </div>
            )}
            {Number.isFinite(tour.capacity) && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Users size={18} /> 
                <span className="font-semibold">{tour.capacity}</span>
              </div>
            )}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Clock size={18} /> 
                <span className="font-semibold">{tour.itinerary.length} {t('common.days')}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <motion.div variants={containerVariants} className="lg:col-span-2 space-y-8">
            
            {!!tour.description && (
              <motion.div 
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-900 to-blue-600 rounded-full"></div>
                  {t('tourDetail.about')}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{tour.description}</p>
              </motion.div>
            )}
            
            {/* ITINERARY */}
            <ScheduleSection itinerary={tour.itinerary} />

            {/* EXTRAS */}
            {(tour.extras || []).length > 0 && (
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-500 rounded-full"></div>
                  {t('tourDetail.extras') || 'Optional Extras'}
                </h2>
                <div className="space-y-3">
                  {tour.extras.map((ex, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 8 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 hover:from-green-50 hover:to-slate-100 transition-all border border-slate-200 hover:border-green-200"
                    >
                      <span className="font-semibold text-slate-800">{ex.title}</span>
                      <span className="text-xl font-bold text-green-600">
                        +{symbol}{ex.price}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* RIGHT COLUMN - BOOKING CARD */}
          <motion.div variants={itemVariants} className="relative">
            <div className="sticky top-24 space-y-6">
              {/* Booking Form */}
              <BookingForm tour={tour} />

              {/* WhatsApp Alternative */}
              <motion.a 
                href={`https://wa.me/?text=Hi%20I%20want%20to%20book%20${encodeURIComponent(tour.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
              >
                <img src="https://img.icons8.com/?size=100&id=7OeRNqg6S7Vf&format=png&color=000000" className='h-8' alt="WhatsApp" />
                {t('tourDetail.whatsappInfo')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
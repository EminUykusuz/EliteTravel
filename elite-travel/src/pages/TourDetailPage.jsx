import { useParams } from 'react-router-dom';
import ScheduleSection from '../components/sections/ScheduleSection';
import BookingForm from '../components/tours/BookingForm';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import { MapPin, Users, Clock, AlertCircle, User, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { tourService } from '../services/tourService';
import { setupPageSEO, generateTourSchema, generateBreadcrumbSchema } from '../utils/seoHelper';

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
                
        if (!dto) {
          setTour(null);
          return;
        }

        // Dil çevirisini çek
        const tourId = dto.id ?? dto.Id;
        const currentLang = i18n.language; // 'tr', 'en', 'de', 'nl'
        let translation = null;
        
        // Türkçe değilse çeviri dene
        if (currentLang !== 'tr') {
          translation = await tourService.getTranslation(tourId, currentLang);
        }

        const itinerary = (translation?.itineraries || dto.itineraries || dto.Itineraries || [])
          .map((it) => ({
            day: it.dayNumber ?? it.DayNumber,
            title: it.title ?? it.Title,
            description: it.description ?? it.Description
          }))
          .sort((a, b) => (a.day || 0) - (b.day || 0));

        const extras = (translation?.extras || dto.extras || dto.Extras || []).map((ex) => ({
          title: ex.title ?? ex.Title,
          price: ex.price ?? ex.Price,
          emoji: ex.emoji ?? ex.Emoji ?? '✨'
        }));

        const highlights = translation?.highlights || dto.highlights || dto.Highlights || [];

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067/api';
        const baseUrl = API_URL.replace('/api', ''); // Remove /api to get base URL

        const mainImageUrl = (dto.mainImage ?? dto.MainImage)?.startsWith('/') 
          ? baseUrl + (dto.mainImage ?? dto.MainImage)
          : (dto.mainImage ?? dto.MainImage);
        const thumbnailUrl = (dto.thumbnail ?? dto.Thumbnail)?.startsWith('/') 
          ? baseUrl + (dto.thumbnail ?? dto.Thumbnail)
          : (dto.thumbnail ?? dto.Thumbnail);

        // Gallery photos'ları parse et ve tam URL'e çevir
        let galleryPhotosArray = dto.galleryPhotos ?? dto.GalleryPhotos ?? dto.galleryPhotosJson ?? dto.GalleryPhotosJson ?? [];
        
        // Eğer string ise JSON parse et
        if (typeof galleryPhotosArray === 'string') {
          try {
            galleryPhotosArray = JSON.parse(galleryPhotosArray);
          } catch {
            galleryPhotosArray = [];
          }
        }

        // Backend'den gelen URL'lerden sadece filename'i çıkar ve temiz URL oluştur
        // Backend bazen path'leri birden fazla kez birleştiriyor, biz sadece son kısmı (filename) kullanacağız
        const galleryPhotos = (Array.isArray(galleryPhotosArray) ? galleryPhotosArray : [])
          .map(url => {
            if (!url) return null;
            
            // URL'den son segment'i (filename) al
            const urlString = String(url).trim();
            const segments = urlString.split('/');
            const filename = segments[segments.length - 1];
            
            // Eğer geçerli bir filename varsa temiz URL oluştur
            if (filename && filename.length > 0) {
              return `${baseUrl}/api/tours/image/${filename}`;
            }
            
            return null;
          })
          .filter(Boolean);

        const tourData = {
          id: dto.id ?? dto.Id,
          slug: dto.slug ?? dto.Slug,
          title: translation?.title || dto.title || dto.Title || '',
          description: translation?.description || dto.description || dto.Description || '',
          price: dto.price ?? dto.Price,
          currency: dto.currency ?? dto.Currency,
          capacity: dto.capacity ?? dto.Capacity,
          guideName: dto.guideName ?? dto.GuideName,
          datesText: dto.datesText ?? dto.DatesText,
          departureCity: dto.departureCity ?? dto.DepartureCity,
          mainImage: mainImageUrl,
          thumbnail: thumbnailUrl,
          galleryPhotos,
          itinerary,
          extras,
          highlights
        };
        
        setTour(tourData);
        
        // SEO Setup - Multi-language
        const tourPath = `/tours/${dto.slug ?? dto.Slug}`;
        const seoDescriptions = {
          tr: `${tourData.title} - Benzersiz bir seyahat deneyimi`,
          en: `${tourData.title} - Unique travel experience`,
          de: `${tourData.title} - Einzigartiges Reiseerlebnis`,
          nl: `${tourData.title} - Unieke reiservaring`
        };
        const seoKeywords = {
          tr: `${tourData.title}, tur, seyahat, tatil, ${tourData.departureCity || ''}, gezi`,
          en: `${tourData.title}, tour, travel, vacation, ${tourData.departureCity || ''}, trip`,
          de: `${tourData.title}, tour, reise, urlaub, ${tourData.departureCity || ''}, ausflug`,
          nl: `${tourData.title}, tour, reis, vakantie, ${tourData.departureCity || ''}, excursie`
        };
        const breadcrumbLabels = {
          tr: { home: 'Ana Sayfa', tours: 'Turlar' },
          en: { home: 'Home', tours: 'Tours' },
          de: { home: 'Startseite', tours: 'Touren' },
          nl: { home: 'Home', tours: 'Tours' }
        };
        const currentLangLabels = breadcrumbLabels[currentLang] || breadcrumbLabels.tr;
        
        setupPageSEO({
          title: tourData.title,
          description: tourData.description?.substring(0, 160) || seoDescriptions[currentLang] || seoDescriptions.tr,
          keywords: seoKeywords[currentLang] || seoKeywords.tr,
          path: tourPath,
          image: tourData.mainImage,
          type: 'article',
          structuredData: [
            generateTourSchema(tourData),
            generateBreadcrumbSchema([
              { name: currentLangLabels.home, path: '/' },
              { name: currentLangLabels.tours, path: '/tours' },
              { name: tourData.title, path: tourPath }
            ])
          ]
        });
      } catch {
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
  const currentUrl = `${window.location.origin}/tours/${tour.slug}`;

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
          alt={`${tour.title} - ${tour.departureCity || 'Elite Travel'} Turu`}
          loading="eager"
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
          {/* LEFT COLUMN - Main Content */}
          <motion.div variants={containerVariants} className="lg:col-span-2 space-y-8">
            
            {/* SOCIAL SHARE */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
            >
              <SocialShareButtons
                url={currentUrl}
                title={tour.title}
                description={tour.description}
                image={tour.mainImage}
              />
            </motion.div>
            
            {/* HIGHLIGHTS */}
            {(tour.highlights || []).length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  {t('tourDetail.highlights')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-base">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* ITINERARY */}
            <ScheduleSection itinerary={tour.itinerary} />

            {/* EXTRAS */}
            {(tour.extras || []).length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  {t('tourDetail.extras') || 'Ekstra Hizmetler'}
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  💡 {t('common:tourDetail.extrasNote') || 'Ekstra hizmetlerden yararlanmak isterseniz rezervasyon formunda "Özel İstekler" kısmında belirtiniz.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.extras.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-green-50 rounded-xl border border-green-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ex.emoji}</span>
                        <span className="text-base font-medium text-slate-700">{ex.title}</span>
                      </div>
                      <span className="text-base font-bold text-green-600">+{symbol}{ex.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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

            {/* GALLERY PHOTOS */}
            {(tour.galleryPhotos || []).length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-900 to-blue-600 rounded-full"></div>
                  📸 {t('tourDetail.gallery')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tour.galleryPhotos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <img
                        src={photo}
                        alt={`${tour.title} - Galeri Fotoğrafı ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                          #{idx + 1}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* RIGHT COLUMN - Booking Sidebar */}
          <motion.div variants={itemVariants} className="relative">
            <div className="sticky top-24 space-y-6">
              {/* Price & Info Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Price Header */}
                <div className="bg-[#163a58] text-white p-6">
                  <p className="text-xs text-slate-300 mb-2">{t('tourDetail.startingPrice') || 'Başlangıç Fiyatı'}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#dca725]">{symbol}{tour.price.toLocaleString()}</span>
                    <span className="text-slate-300 text-sm">/ {t('tourDetail.perPerson') || 'kişi'}</span>
                  </div>
                </div>
                
                {/* Tour Info */}
                <div className="p-6 space-y-4">
                  {tour.datesText && (
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <Clock size={20} className="text-[#163a58]" />
                      <div>
                        <p className="text-xs text-slate-500">Tarihler</p>
                        <p className="font-semibold text-slate-900">{tour.datesText}</p>
                      </div>
                    </div>
                  )}
                  
                  {tour.departureCity && (
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <MapPin size={20} className="text-[#dca725]" />
                      <div>
                        <p className="text-xs text-slate-500">Kalkış Noktası</p>
                        <p className="font-semibold text-slate-900">{tour.departureCity}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <Users size={20} className="text-[#163a58]" />
                    <div>
                      <p className="text-xs text-slate-500">Kapasite</p>
                      <p className="font-semibold text-slate-900">{tour.capacity} Kişi</p>
                    </div>
                  </div>
                  
                  {tour.guideName && (
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-[#dca725]" />
                      <div>
                        <p className="text-xs text-slate-500">Rehber</p>
                        <p className="font-semibold text-slate-900">{tour.guideName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <BookingForm tour={tour} />

              {/* WhatsApp Button */}
              <motion.a 
                href={`https://wa.me/?text=Hi%20I%20want%20to%20book%20${encodeURIComponent(tour.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=7OeRNqg6S7Vf&format=png&color=000000" 
                  className='h-7 group-hover:scale-110 transition-transform' 
                  alt="WhatsApp" 
                />
                <span>{t('tourDetail.whatsappInfo') || 'WhatsApp ile İletişim'}</span>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
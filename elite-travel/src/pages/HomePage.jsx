import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import TourGrid from '../components/tours/TourGrid';
import ContactSection from '../components/sections/ContactSection';
import FAQSection from '../components/sections/FAQSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setupPageSEO } from '../utils/seoHelper';
import { tourService } from '../services/tourService';

export default function HomePage() {
  const { t, i18n } = useTranslation(['common', 'tours']);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO meta tags - Multi-language
    const seoContent = {
      tr: {
        title: 'Unutulmaz Seyahat Deneyimleri',
        description: 'Profesyonel rehberlerimiz eşliğinde benzersiz kültür turları ve seyahat deneyimleri. Tarihi keşfedin, yeni yerler görün.',
        keywords: 'seyahat, tur, tatil, kültür turları, gezi, rehberli tur'
      },
      en: {
        title: 'Unforgettable Travel Experiences',
        description: 'Unique cultural tours and travel experiences with our professional guides. Discover history, see new places.',
        keywords: 'travel, tour, vacation, cultural tours, trip, guided tour'
      },
      de: {
        title: 'Unvergessliche Reiseerlebnisse',
        description: 'Einzigartige Kulturtouren und Reiseerlebnisse mit unseren professionellen Reiseführern. Entdecken Sie Geschichte, sehen Sie neue Orte.',
        keywords: 'reise, tour, urlaub, kulturtouren, ausflug, geführte tour'
      },
      nl: {
        title: 'Onvergetelijke Reiservaringen',
        description: 'Unieke culturele tours en reiservaringen met onze professionele gidsen. Ontdek geschiedenis, zie nieuwe plaatsen.',
        keywords: 'reis, tour, vakantie, culturele tours, excursie, begeleide tour'
      }
    };
    const lang = i18n.language || 'tr';
    const content = seoContent[lang] || seoContent.tr;
    
    setupPageSEO({
      title: content.title,
      description: content.description,
      keywords: content.keywords,
      path: '/'
    });

    // Turları API'den yükle
    const loadTours = async () => {
      try {
        const lang = i18n.language || 'tr';
        const data = await tourService.getAll({ isActive: true, languageCode: lang });
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067/api';
        const baseUrl = API_URL.replace('/api', ''); // Remove /api to get base URL
        
        const apiTours = (data || []).map((tour) => ({
          id: tour.id,
          slug: tour.slug || '',
          title: tour.title || '',
          price: tour.price,
          currency: tour.currency,
          capacity: tour.capacity,
          guideName: tour.guideName,
          thumbnail: tour.thumbnail?.startsWith('/') 
            ? baseUrl + tour.thumbnail 
            : (tour.thumbnail || tour.mainImage || 'https://via.placeholder.com/400x300?text=Tour'),
          mainImage: tour.mainImage?.startsWith('/') 
            ? baseUrl + tour.mainImage 
            : (tour.mainImage || tour.thumbnail || 'https://via.placeholder.com/1200x800?text=Tour')
        }));
        setTours(apiTours);
      } catch (error) {
                setTours([]);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, [i18n.language]);

  const featuredTours = tours.slice(0, 3);

  return (
    <>
      <Hero featuredTours={tours} />
      
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-elite-dark mb-4">{t('tours.title')}</h2>
          <p className="text-gray-600">
            {t('tours.subtitle')}
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : (
          <TourGrid tours={featuredTours} />
        )}
        
        <div className="text-center mt-12">
          <Link to="/tours" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-elite-dark text-elite-dark font-bold rounded-xl hover:bg-elite-dark hover:text-yellow-300 transition-all">
            {t('tours.viewAll')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* YENİ FAQ BÖLÜMÜ */}
      <FAQSection />

      
    </>
  );
}
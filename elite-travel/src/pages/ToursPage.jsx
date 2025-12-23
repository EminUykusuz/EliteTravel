import TourGrid from '../components/tours/TourGrid';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tourService } from '../services/tourService';
import { categoryService } from '../services/categoryService';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Map, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ToursPage() {
  const { t, i18n: i18nInstance } = useTranslation(['common', 'tours']);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryGroups, setCategoryGroups] = useState({ domestic: null, international: null });
  const [expandedGroup, setExpandedGroup] = useState('all');
  const location = useLocation();

  useEffect(() => {
    const loadTours = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const categoryId = searchParams.get('categoryId');

        const lang = i18nInstance.language || 'tr';
        const params = {
          isActive: true,
          languageCode: lang
        };
        if (categoryId) {
          params.categoryId = parseInt(categoryId);
        }

        const data = await tourService.getAll(params);
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5067/api';
        const baseUrl = API_URL.replace('/api', ''); // Remove /api to get base URL
        
        const apiTours = (data || []).map((tour) => ({
          id: tour.id,
          slug: tour.slug || '',
          title: tour.title || '',
          description: tour.description || '',
          price: tour.price,
          currency: tour.currency,
          capacity: tour.capacity,
          guideName: tour.guideName,
          thumbnail: tour.thumbnail?.startsWith('/') 
            ? baseUrl + tour.thumbnail 
            : (tour.thumbnail || tour.mainImage || 'https://via.placeholder.com/400x300?text=Tour'),
          mainImage: tour.mainImage?.startsWith('/') 
            ? baseUrl + tour.mainImage 
            : (tour.mainImage || tour.thumbnail || 'https://via.placeholder.com/1200x800?text=Tour'),
          type: categoryId ? 'featured' : 'standard'
        }));
        setTours(apiTours);
      } catch (error) {
        console.error('Turlar yüklenemedi:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, [location.search, i18nInstance.language]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();

        const normalized = (data || []).map(cat => ({
          id: cat.id || cat.Id,
          name: cat.name || cat.Name,
          slug: cat.slug || cat.Slug,
          children: (cat.children || cat.Children || []).map(ch => ({
            id: ch.id || ch.Id,
            name: ch.name || ch.Name,
            slug: ch.slug || ch.Slug
          }))
        }));

        const findParent = (slugValue, nameContains) => {
          return normalized.find(c =>
            (c.slug || '').toLowerCase() === slugValue ||
            (c.name || '').toLowerCase().includes(nameContains)
          );
        };

        const domestic = findParent('yurt-ici', 'yurt iç');
        const international = findParent('yurt-disi', 'yurt dış');

        setCategoryGroups({ domestic, international });
      } catch (error) {
        setCategoryGroups({ domestic: null, international: null });
      }
    };

    loadCategories();
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/40 backdrop-blur-sm">
              <span className="text-blue-200 text-sm font-semibold">{t('tours.exploreSoon')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {t('tours.allTours')}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('tours.pageSubtitle')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="text-yellow-300" size={24} />
              <span className="text-blue-100 font-semibold">{tours.length} {t('tours.availableTours')}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Category Filter Section - Enhanced */}
        {(categoryGroups.domestic || categoryGroups.international) && (
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Domestic Destinations */}
              {categoryGroups.domestic && (
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Map size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{t('tours.domestic')}</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(categoryGroups.domestic.children || []).map((child, idx) => (
                        <Link
                          key={child.id}
                          to={`/tours?categoryId=${child.id}`}
                          className="relative group/tag px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-sm font-semibold text-blue-900 transition-all border border-blue-200 hover:border-blue-400 hover:shadow-md overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {child.name}
                            <ArrowRight size={14} className="opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* International Destinations */}
              {categoryGroups.international && (
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                        <Globe size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{t('tours.international')}</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(categoryGroups.international.children || []).map((child, idx) => (
                        <Link
                          key={child.id}
                          to={`/tours?categoryId=${child.id}`}
                          className="relative group/tag px-4 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-sm font-semibold text-amber-900 transition-all border border-amber-200 hover:border-amber-400 hover:shadow-md"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {child.name}
                            <ArrowRight size={14} className="opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tours Grid */}
        {loading ? (
          <motion.div variants={itemVariants} className="flex items-center justify-center py-24">
            <div className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-slate-300 border-t-blue-900 rounded-full mx-auto mb-4"></motion.div>
              <p className="text-slate-600 font-semibold">{t('common.loading')}</p>
            </div>
          </motion.div>
        ) : tours.length > 0 ? (
          <motion.div variants={itemVariants}>
            <TourGrid tours={tours} />
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-600 font-semibold">{t('tours.noToursFound')}</p>
            <Link 
              to="/tours"
              className="mt-6 inline-block px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              {t('common.viewAll')}
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
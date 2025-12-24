import TourGrid from '../components/tours/TourGrid';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tourService } from '../services/tourService';
import { categoryService } from '../services/categoryService';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Map, Sparkles, ArrowRight, ChevronDown, ChevronUp, Filter } from 'lucide-react';

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
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadTours = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const categorySlug = searchParams.get('category'); // Slug kullan

        console.log('🔍 URL parametresi category:', categorySlug);

        const lang = i18nInstance.language || 'tr';
        const params = {
          isActive: true,
          languageCode: lang
        };
        if (categorySlug) {
          params.category = categorySlug; // Slug gönder
          console.log('📦 Backend\'e gönderilen params:', params);
        } else {
          setActiveCategoryName('');
        }

        const data = await tourService.getAll(params);
        console.log('✅ Backend\'den dönen tur sayısı:', data?.length);
        
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
          type: categorySlug ? 'featured' : 'standard'
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
          parentId: cat.parentId || cat.ParentId,
          children: (cat.children || cat.Children || []).map(ch => ({
            id: ch.id || ch.Id,
            name: ch.name || ch.Name,
            slug: ch.slug || ch.Slug,
            parentId: ch.parentId || ch.ParentId
          }))
        }));

        setCategories(normalized);

        // Set active category name from URL slug
        const searchParams = new URLSearchParams(location.search);
        const categorySlug = searchParams.get('category');
        
        if (categorySlug) {
          const findCategoryBySlug = (cats) => {
            for (const cat of cats) {
              if (cat.slug === categorySlug) return cat;
              if (cat.children) {
                const found = findCategoryBySlug(cat.children);
                if (found) return found;
              }
            }
            return null;
          };
          const found = findCategoryBySlug(normalized);
          if (found) {
            setActiveCategory(found.slug);
            setActiveCategoryName(found.name);
            // Auto-expand parent category
            const parent = normalized.find(c => c.id === found.parentId || c.children?.some(ch => ch.slug === categorySlug));
            if (parent) {
              setExpandedCategories(prev => ({ ...prev, [parent.id]: true }));
            }
          }
        } else {
          setActiveCategory(null);
          setActiveCategoryName('');
        }
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, [location.search]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-slate-50"
    >
      <div className="container mx-auto px-4 py-8">
        
        {/* Compact Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              {activeCategoryName && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Link to="/tours" className="hover:text-blue-600 transition-colors">{t('tours.allTours')}</Link>
                  <span>/</span>
                  <span className="text-slate-900 font-medium">{activeCategoryName}</span>
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {activeCategoryName || t('tours.allTours')}
              </h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Sparkles className="text-amber-500" size={20} />
              <span className="text-slate-900 font-semibold">{tours.length}</span>
              <span className="text-slate-500 text-sm">{t('tours.availableTours')}</span>
            </div>
          </div>

          {/* Category Filter - Dropdown Style */}
          {categories.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Filter size={20} className="text-slate-600" />
                  <span className="font-semibold text-slate-900">
                    {activeCategoryName || t('common.viewAll')}
                  </span>
                </div>
                {showCategoryMenu ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-200 overflow-hidden"
                  >
                    <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                      {/* All Tours Option */}
                      <Link
                        to="/tours"
                        onClick={() => setShowCategoryMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          !activeCategory
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Globe size={18} />
                        <span className="font-semibold">{t('common.viewAll')}</span>
                      </Link>

                      {/* Parent Categories with Children */}
                      {categories.filter(c => !c.parentId).map((parent) => (
                        <div key={parent.id} className="space-y-1">
                          <div className="flex items-center gap-0">
                            <Link
                              to={`/tours?category=${parent.slug}`}
                              onClick={() => setShowCategoryMenu(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all flex-1 ${
                                activeCategory === parent.slug
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-md'
                                  : 'hover:bg-amber-50 text-slate-700'
                              }`}
                            >
                              <Map size={18} />
                              <span className="font-bold text-sm uppercase tracking-wide flex-1 text-left">
                                {parent.name}
                              </span>
                            </Link>
                            {parent.children?.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedCategories(prev => ({
                                    ...prev,
                                    [parent.id]: !prev[parent.id]
                                  }));
                                }}
                                className={`p-3 rounded-lg transition-all ${
                                  activeCategory === parent.id
                                    ? 'text-white hover:bg-amber-600'
                                    : 'text-slate-600 hover:bg-amber-50'
                                }`}
                              >
                                {expandedCategories[parent.id] ? 
                                  <ChevronUp size={16} /> : 
                                  <ChevronDown size={16} />
                                }
                              </button>
                            )}
                          </div>

                          {/* Child Categories */}
                          <AnimatePresence>
                            {expandedCategories[parent.id] && parent.children?.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="pl-8 space-y-1 overflow-hidden"
                              >
                                {parent.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/tours?category=${child.slug}`}
                                    onClick={() => setShowCategoryMenu(false)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                                      activeCategory === child.slug
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-md'
                                        : 'hover:bg-amber-50 text-slate-600'
                                    }`}
                                  >
                                    <ArrowRight size={14} />
                                    {child.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

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
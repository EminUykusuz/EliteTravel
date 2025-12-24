import { motion } from 'framer-motion';
import { Home, Search, MapPin, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { tourService } from '../services/tourService';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [popularTours, setPopularTours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load popular tours
    const loadTours = async () => {
      try {
        const tours = await tourService.getAll();
        setPopularTours(tours.slice(0, 3));
      } catch (error) { /* ignored */ }
    };
    loadTours();

    // Set page title
    document.title = '404 - Sayfa Bulunamadı | Elite Travel';
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-900 to-blue-600 rounded-full shadow-2xl">
              <MapPin size={64} className="text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-black text-gray-800 mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-gray-700 mb-4"
          >
            Sayfa Bulunamadı
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Ana sayfaya dönebilir veya popüler turlarımıza göz atabilirsiniz.
          </motion.p>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tur ara..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors font-semibold"
              >
                Ara
              </button>
            </div>
          </motion.form>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Home size={20} />
              Ana Sayfaya Dön
            </Link>
            <Link
              to="/tours"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 border-2 border-blue-900 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <MapPin size={20} />
              Tüm Turlar
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <ArrowLeft size={20} />
              Geri Dön
            </button>
          </motion.div>

          {/* Popular Tours */}
          {popularTours.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Popüler Turlar</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {popularTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={tour.thumbnail || tour.mainImage}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors line-clamp-2">
                          {tour.title}
                        </h4>
                        <p className="text-blue-900 font-bold mt-2">
                          €{tour.price}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

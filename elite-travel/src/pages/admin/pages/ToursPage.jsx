import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, MapPin, Users, Euro, Calendar, Image as ImageIcon } from 'lucide-react';
import { showConfirm, showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';
import { tourService } from '../../../services/tourService';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAll();
      setTours(data);
    } catch (error) {
      showError('Turlar yüklenirken hata oluştu!');
          } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bu turu silmek istediğinizden emin misiniz?');
    
    if (confirmed) {
      try {
        showLoading();
        await tourService.delete(id);
        closeLoading();
        showSuccess('Tur silindi!');
        loadTours();
      } catch (error) {
        closeLoading();
        showError('Tur silinirken hata oluştu!');
              }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#dca725] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#163a58] flex items-center gap-3">
              <MapPin className="w-10 h-10 text-[#dca725]" />
              Turlar
            </h1>
            <p className="text-gray-600 mt-2 ml-14">{tours.length} adet tur listeleniyor</p>
          </div>
          <Link
            to="/admin/tours/new"
            className="bg-gradient-to-r from-[#dca725] to-[#b8941f] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Yeni Tur Ekle
          </Link>
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Henüz tur eklenmemiş</h3>
            <p className="text-gray-500 mb-6">İlk turunuzu ekleyerek başlayın!</p>
            <Link
              to="/admin/tours/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#dca725] to-[#b8941f] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Hemen Tur Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#163a58] to-[#1e4a6a] overflow-hidden">
                  {tour.mainImage ? (
                    <img
                      src={`https://localhost:7069${tour.mainImage}`}
                      alt={tour.tourTranslations?.[0]?.title || 'Tur'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#163a58] to-[#1e4a6a] flex items-center justify-center" style={{ display: tour.mainImage ? 'none' : 'flex' }}>
                    <ImageIcon className="w-20 h-20 text-white/30" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      tour.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {tour.isActive ? '✓ Aktif' : '✕ Pasif'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#163a58] mb-3 line-clamp-2 min-h-[3.5rem]">
                    {tour.tourTranslations?.[0]?.title || tour.title || 'Başlık yok'}
                  </h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Euro className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fiyat</p>
                        <p className="font-semibold text-sm">{tour.currency} {tour.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kapasite</p>
                        <p className="font-semibold text-sm">{tour.capacity} kişi</p>
                      </div>
                    </div>
                  </div>

                  {/* Guide Info */}
                  {tour.guideName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-2 bg-amber-50 rounded-lg">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span className="font-medium">Rehber:</span>
                      <span>{tour.guideName}</span>
                    </div>
                  )}

                  {/* Description Preview */}
                  {tour.tourTranslations?.[0]?.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {tour.tourTranslations[0].description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link
                      to={`/admin/tours/edit/${tour.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
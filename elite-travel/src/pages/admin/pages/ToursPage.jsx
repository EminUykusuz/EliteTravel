import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash } from 'lucide-react';
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
      console.error(error);
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
        loadTours(); // Reload list
      } catch (error) {
        closeLoading();
        showError('Tur silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Turlar</h1>
        <Link
          to="/admin/tours/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Yeni Tur
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Başlık</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fiyat</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Kapasite</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Durum</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tours.map((tour) => (
              <motion.tr
                key={tour.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {tour.tourTranslations?.[0]?.title || 'Başlık yok'}
                </td>
                <td className="px-6 py-4">{tour.currency} {tour.price}</td>
                <td className="px-6 py-4">{tour.capacity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    tour.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link 
                    to={`/admin/tours/edit/${tour.id}`} 
                    className="text-blue-600 hover:underline"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(tour.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {tours.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz tur bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
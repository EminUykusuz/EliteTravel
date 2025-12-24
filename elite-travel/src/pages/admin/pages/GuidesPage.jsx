import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, Instagram, DollarSign, X } from 'lucide-react';
import { showConfirm, showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';
import { guideService } from '../../../services/guideService';

// 👇 API Base URL - backend'in çalıştığı adres
const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hireAmount: '',
    currency: 'TRY',
    instagramUrl: '',
    image: null
  });

  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
      const response = await guideService.getAll();
      
      // 👇 DÜZELTME: Backend PaginatedResultDto dönüyor
       // Debug için
      
      let guidesData = [];
      if (response.items) {
        // Backend direkt response dönüyorsa
        guidesData = response.items;
      } else if (response.data?.items) {
        // Axios wrapped response
        guidesData = response.data.items;
      } else if (Array.isArray(response)) {
        guidesData = response;
      } else if (Array.isArray(response.data)) {
        guidesData = response.data;
      }
      
       // Debug için
      setGuides(guidesData);
    } catch (error) {
      showError('Rehberler yüklenirken hata oluştu!');
            setGuides([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bu rehberi silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        showLoading();
        await guideService.delete(id);
        closeLoading();
        showSuccess('Rehber silindi!');
        loadGuides();
      } catch (error) {
        closeLoading();
        showError('Rehber silinirken hata oluştu!');
              }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      showLoading();

      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('description', formData.description || '');
      dataToSend.append('hireAmount', formData.hireAmount || '0');
      dataToSend.append('currency', formData.currency || 'TRY');
      dataToSend.append('instagramUrl', formData.instagramUrl || '');
      
      if (formData.image instanceof File) {
        dataToSend.append('image', formData.image);
      }
      
      if (editingGuide) {
        await guideService.update(editingGuide.id, dataToSend);
        showSuccess('Rehber güncellendi!');
      } else {
        await guideService.create(dataToSend);
        showSuccess('Rehber eklendi!');
      }
      
      closeLoading();
      setShowForm(false);
      setEditingGuide(null);
      setFormData({ 
        name: '', 
        description: '', 
        hireAmount: '', 
        currency: 'TRY',
        instagramUrl: '', 
        image: null 
      });
      loadGuides();
    } catch (error) {
      closeLoading();
             // Debug
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0] ||
                       'İşlem sırasında hata oluştu!';
      showError(errorMsg);
    }
  };

  const handleEdit = (guide) => {
    setEditingGuide(guide);
    setFormData({
      name: guide.name,
      description: guide.description || '',
      hireAmount: guide.hireAmount || '',
      currency: guide.currency || 'TRY',
      instagramUrl: guide.instagramUrl || '',
      image: null
    });
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // 👇 YENİ: Resim URL'ini tam olarak oluştur
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rehberler</h1>
          <p className="text-gray-600">Tur rehberlerini yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingGuide(null);
            setFormData({ 
              name: '', 
              description: '', 
              hireAmount: '', 
              currency: 'TRY',
              instagramUrl: '', 
              image: null 
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Yeni Rehber
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Toplam Rehber</p>
              <p className="text-2xl font-bold text-gray-800">{guides.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ortalama Ücret</p>
              <p className="text-2xl font-bold text-gray-800">
                {guides.length > 0 
                  ? `${Math.round(guides.reduce((sum, g) => sum + (g.hireAmount || 0), 0) / guides.length)} ${currencySymbols[guides[0]?.currency] || '₺'}`
                  : '0 ₺'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Sosyal Medya</p>
              <p className="text-2xl font-bold text-gray-800">
                {guides.filter(g => g.instagramUrl).length}/{guides.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group"
          >
            {/* 👇 DÜZELTME: Resim URL'i tam olarak oluşturuldu */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
              {guide.image ? (
                <img 
                  src={getImageUrl(guide.image)} 
                  alt={guide.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                                        e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold"
                style={{ display: guide.image ? 'none' : 'flex' }}
              >
                {guide.name?.charAt(0) || '?'}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{guide.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description || 'Açıklama yok'}</p>

              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="text-sm text-gray-600">
                  {guide.tours?.length || 0} tur
                </div>
                {guide.hireAmount && (
                  <div className="text-lg font-bold text-green-600">
                    {currencySymbols[guide.currency] || '₺'}{guide.hireAmount}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {guide.instagramUrl && (
                  <a 
                    href={guide.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="font-medium">Instagram</span>
                  </a>
                )}
                <button 
                  onClick={() => handleEdit(guide)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(guide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
          Henüz rehber bulunmuyor. Yeni rehber eklemek için yukarıdaki "Yeni Rehber" butonuna tıklayın.
        </div>
      )}

      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingGuide ? 'Rehber Düzenle' : 'Yeni Rehber Ekle'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rehber Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ahmet Yılmaz"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Rehber hakkında kısa bilgi..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ücret
                  </label>
                  <input
                    type="number"
                    value={formData.hireAmount}
                    onChange={(e) => setFormData({ ...formData, hireAmount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="TRY">₺ TRY</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profil Fotoğrafı
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {editingGuide?.image && !formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img 
                      src={getImageUrl(editingGuide.image)} 
                      alt="Current" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-500">
                      Mevcut resim
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingGuide ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
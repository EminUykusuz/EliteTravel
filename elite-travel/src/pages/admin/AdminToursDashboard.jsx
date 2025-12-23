import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { tourService } from '../../../serivces/genericService';

const AdminToursDashboard = () => {
  const { t } = useTranslation(['common', 'admin']);
  const [activeTab, setActiveTab] = useState('list');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'TL',
    capacity: 0,
    isActive: true,
    mainImage: '',
    thumbnail: '',
    guideId: null,
    itineraries: [
      { dayNumber: 1, title: '', description: '' }
    ]
  });

  // Turları yükle
  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAll();
      setTours(data);
    } catch (error) {
      Swal.fire('Hata!', 'Turlar yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Form resetle
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      currency: 'TL',
      capacity: 0,
      isActive: true,
      mainImage: '',
      thumbnail: '',
      guideId: null,
      itineraries: [
        { dayNumber: 1, title: '', description: '' }
      ]
    });
    setSelectedTour(null);
    setImagePreview(null);
  };

  // Resim yükle
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyut kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Hata!', 'Dosya boyutu 5MB\'dan küçük olmalı', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload
      const result = await tourService.uploadImage(file);
      
      setFormData(prev => ({
        ...prev,
        mainImage: result.url,
        thumbnail: result.url
      }));

      Swal.fire({
        icon: 'success',
        title: 'Yüklendi!',
        text: 'Resim başarıyla yüklendi',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire('Hata!', 'Resim yüklenemedi', 'error');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Yeni tur ekle
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Swal.fire('Hata!', 'Lütfen tur başlığını girin', 'error');
      return;
    }

    if (!formData.mainImage) {
      Swal.fire('Hata!', 'Lütfen resim yükleyin', 'error');
      return;
    }

    try {
      const payload = {
        price: parseFloat(formData.price),
        currency: formData.currency,
        capacity: parseInt(formData.capacity),
        mainImage: formData.mainImage,
        thumbnail: formData.thumbnail,
        isActive: formData.isActive,
        guideId: formData.guideId,
        itineraries: formData.itineraries.filter(it => it.title.trim()),
        tourTranslations: [
          {
            languageCode: 'tr-TR',
            title: formData.title,
            description: formData.description,
            slug: formData.title.toLowerCase()
              .replace(/ğ/g, 'g').replace(/ü/g, 'u')
              .replace(/ş/g, 's').replace(/ı/g, 'i')
              .replace(/ö/g, 'o').replace(/ç/g, 'c')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
          }
        ]
      };

      await tourService.create(payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Tur başarıyla eklendi',
        timer: 2000,
        showConfirmButton: false
      });

      resetForm();
      loadTours();
      setActiveTab('list');

    } catch (error) {
      console.error(error);
      Swal.fire('Hata!', 'Tur eklenirken hata oluştu', 'error');
    }
  };

  // Tur güncelle
  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      Swal.fire('Hata!', 'Lütfen tur başlığını girin', 'error');
      return;
    }

    try {
      const payload = {
        id: selectedTour.id,
        price: parseFloat(formData.price),
        currency: formData.currency,
        capacity: parseInt(formData.capacity),
        mainImage: formData.mainImage,
        thumbnail: formData.thumbnail,
        isActive: formData.isActive,
        guideId: formData.guideId,
        itineraries: formData.itineraries.filter(it => it.title.trim()),
        tourTranslations: [
          {
            languageCode: 'tr-TR',
            title: formData.title,
            description: formData.description,
            slug: formData.title.toLowerCase()
              .replace(/ğ/g, 'g').replace(/ü/g, 'u')
              .replace(/ş/g, 's').replace(/ı/g, 'i')
              .replace(/ö/g, 'o').replace(/ç/g, 'c')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
          }
        ]
      };

      await tourService.update(selectedTour.id, payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Güncellendi!',
        text: 'Tur başarıyla güncellendi',
        timer: 2000,
        showConfirmButton: false
      });

      resetForm();
      loadTours();
      setActiveTab('list');

    } catch (error) {
      console.error(error);
      Swal.fire('Hata!', 'Tur güncellenirken hata oluştu', 'error');
    }
  };

  // Düzenleme için formu doldur
  const handleEdit = (tour) => {
    const trData = tour.tourTranslations?.find(t => t.languageCode === 'tr-TR') || tour.tourTranslations?.[0] || {};
    
    const newFormData = {
      title: trData.title || tour.title || '',
      description: trData.description || tour.description || '',
      price: tour.price || 0,
      currency: tour.currency || 'TL',
      capacity: tour.capacity || 0,
      isActive: tour.isActive !== undefined ? tour.isActive : true,
      mainImage: tour.mainImage || '',
      thumbnail: tour.thumbnail || '',
      guideId: tour.guideId || null,
      itineraries: tour.itineraries && tour.itineraries.length > 0 
        ? tour.itineraries 
        : [{ dayNumber: 1, title: '', description: '' }]
    };
    
    setFormData(newFormData);
    setImagePreview(tour.mainImage || '');
    setSelectedTour(tour);
    setActiveTab('edit');
  };

  // Tur sil
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misin?',
      text: "Bu turu silmek istediğinden emin misin?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        console.log('Silinecek tur ID:', id);
        const response = await tourService.delete(id);
        console.log('Delete response:', response);
        
        Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'Tur başarıyla silindi',
          timer: 2000,
          showConfirmButton: false
        });

        loadTours();
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Hata!', `Tur silinirken hata oluştu: ${error.message || error}`, 'error');
      }
    }
  };

  // Input değişiklikleri
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Tab geçişinde formu temizle
  const handleTabChange = (tab) => {
    if (tab === 'new') {
      resetForm();
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Tur Yönetim Paneli</h1>
          <p className="text-slate-600">Turları yönet, düzenle ve yeni turlar ekle</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          <button
            onClick={() => handleTabChange('list')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Tur Listesi ({tours.length})
          </button>
          <button
            onClick={() => handleTabChange('new')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'new'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ➕ Yeni Tur Ekle
          </button>
          {selectedTour && activeTab === 'edit' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-orange-600 text-white shadow-md"
            >
              ✏️ Düzenle
            </motion.button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* TUR LİSTESİ */}
          {activeTab === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {tours.length === 0 ? (
                <div className="col-span-3 text-center py-12 bg-white rounded-xl">
                  <p className="text-gray-500 text-lg">Henüz tur eklenmemiş</p>
                  <button
                    onClick={() => handleTabChange('new')}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    İlk Turu Ekle
                  </button>
                </div>
              ) : (
                tours.map((tour, index) => {
                  const trData = tour.tourTranslations?.find(t => t.languageCode === 'tr-TR') || tour.tourTranslations?.[0] || {};
                  const displayTitle = trData.title || tour.title || 'Başlık yok';
                  const displayDesc = trData.description || tour.description || '';
                  return (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                    >
                      <div className="flex items-start gap-6 p-6">
                        {/* Resim */}
                        <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                          <img
                            src={tour.mainImage || 'https://via.placeholder.com/200x200?text=No+Image'}
                            alt={displayTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* İçerik */}
                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{displayTitle}</h3>
                              <p className="text-slate-600 text-sm line-clamp-2 mb-3">{displayDesc}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${
                              tour.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tour.isActive ? '✓ Aktif' : '○ Pasif'}
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold">Fiyat</p>
                              <p className="text-lg font-bold text-blue-600">{tour.price} {tour.currency}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold">Kapasite</p>
                              <p className="text-lg font-bold text-slate-900">👥 {tour.capacity} kişi</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold">Rehber</p>
                              <p className="text-sm font-semibold text-slate-800">{tour.guideId ? 'Atanmış' : 'Atanmamış'}</p>
                            </div>
                          </div>

                          {/* Açıklama */}
                          {trData.description && (
                            <p className="text-sm text-gray-700 mb-4 max-h-16 overflow-hidden text-ellipsis line-clamp-2">
                              {trData.description}
                            </p>
                          )}
                        </div>

                        {/* Aksiyonlar */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(tour)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                          >
                            ✎ Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(tour.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                          >
                            🗑 Sil
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* YENİ TUR / DÜZENLEME FORMU */}
          {(activeTab === 'new' || activeTab === 'edit') && (
            <motion.div
              key={`form-${selectedTour?.id || 'new'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {activeTab === 'new' ? 'Yeni Tur Ekle' : `Turu Düzenle - ${formData.title || 'Yükleniyor...'}`}
              </h2>
              
              <div className="space-y-6">
                {/* Resim Yükleme */}
                <div>
                  <label className="block text-slate-700 font-bold mb-2">Tur Resmi *</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, mainImage: '', thumbnail: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-6xl mb-2">📸</div>
                        <p className="text-slate-600 mb-2">
                          {uploadingImage ? 'Yükleniyor...' : 'Resim seçmek için tıklayın'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          Dosya Seç
                        </label>
                        <p className="text-xs text-slate-500 mt-2">
                          JPG, PNG, WEBP - Max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Başlık */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-bold mb-2">Tur Başlığı *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Örn: Boğaz Turu"
                    />
                  </div>

                  {/* Fiyat */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Fiyat *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Para Birimi */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Para Birimi</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="TL">TL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  {/* Kapasite */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-2">Kapasite *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  {/* Aktif/Pasif */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id={`isActive-${activeTab}`}
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <label htmlFor={`isActive-${activeTab}`} className="ml-3 text-slate-700 font-bold">
                      Aktif Tur
                    </label>
                  </div>

                  {/* Açıklama */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-bold mb-2">Açıklama</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full border-2 border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Tur hakkında detaylı bilgi..."
                    ></textarea>
                  </div>

                  {/* İTİNERARY */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-slate-700 font-bold">Tur Programı (İtinerary)</label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            itineraries: [
                              ...prev.itineraries,
                              { dayNumber: prev.itineraries.length + 1, title: '', description: '' }
                            ]
                          }));
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold"
                      >
                        + Gün Ekle
                      </button>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                      {formData.itineraries.map((itinerary, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border-2 border-slate-300 space-y-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-slate-800">Gün {itinerary.dayNumber}</h3>
                            {formData.itineraries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    itineraries: prev.itineraries.filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold"
                              >
                                Sil
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-slate-600 text-sm font-bold mb-1">Başlık *</label>
                            <input
                              type="text"
                              value={itinerary.title}
                              onChange={(e) => {
                                const newItineraries = [...formData.itineraries];
                                newItineraries[idx].title = e.target.value;
                                setFormData(prev => ({ ...prev, itineraries: newItineraries }));
                              }}
                              className="w-full border-2 border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                              placeholder="Gün başlığı (ör: İstanbul Safranbolu Yolu)"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 text-sm font-bold mb-1">Açıklama</label>
                            <textarea
                              value={itinerary.description}
                              onChange={(e) => {
                                const newItineraries = [...formData.itineraries];
                                newItineraries[idx].description = e.target.value;
                                setFormData(prev => ({ ...prev, itineraries: newItineraries }));
                              }}
                              rows="3"
                              className="w-full border-2 border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                              placeholder="Bu gün ne yapılacağını açıklayın..."
                            ></textarea>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={activeTab === 'new' ? handleCreate : handleUpdate}
                    disabled={uploadingImage}
                    className={`flex-1 py-3 rounded-lg font-bold text-lg shadow-md transition ${
                      activeTab === 'new'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {activeTab === 'new' ? '💾 Kaydet' : '✏️ Güncelle'}
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      handleTabChange('list');
                    }}
                    className="flex-1 bg-slate-500 text-white py-3 rounded-lg hover:bg-slate-600 transition font-bold text-lg"
                  >
                    ❌ İptal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminToursDashboard;
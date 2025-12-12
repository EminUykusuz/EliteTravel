
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTourForm = ({ initialData = null, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  
  // Form State'i
  const [formData, setFormData] = useState({
    price: 0,
    currency: 'TL',
    capacity: 0,
    isActive: true,
    mainImage: '',
    // Backend Translation istediği için başlığı ayrı tutuyoruz, gönderirken birleştireceğiz
    title: '', 
    description: ''
  });

  // Eğer düzenleme modundaysak verileri doldur
  useEffect(() => {
    if (initialData) {
      // Backend'den gelen Translation arrayinden Türkçe başlığı buluyoruz
      const trData = initialData.translations?.find(t => t.languageCode === 'tr-TR') || {};
      
      setFormData({
        price: initialData.price,
        currency: initialData.currency || 'TL',
        capacity: initialData.capacity,
        isActive: initialData.isActive,
        mainImage: initialData.mainImage,
        title: trData.title || '',
        description: trData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend'in beklediği formatı hazırlıyoruz (Mapping)
    const payload = {
      ...formData,
      // Backend DTO'su Translations listesi bekliyor:
      translations: [
        {
          languageCode: 'tr-TR',
          title: formData.title,
          description: formData.description,
          slug: formData.title.toLowerCase().replace(/ /g, '-') // Basit slug oluşturma
        }
      ]
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Başlık */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Tur Başlığı (Türkçe)</label>
          <input 
            type="text" name="title" required
            value={formData.title} onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fiyat */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Fiyat</label>
          <input 
            type="number" name="price" required
            value={formData.price} onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Para Birimi */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Para Birimi</label>
            <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>
        </div>

        {/* Kapasite */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Toplam Kapasite</label>
          <input 
            type="number" name="capacity" required
            value={formData.capacity} onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Durum */}
        <div className="flex items-center mt-8">
          <input 
            type="checkbox" name="isActive" id="isActive"
            checked={formData.isActive} onChange={handleChange}
            className="w-5 h-5 text-blue-600"
          />
          <label htmlFor="isActive" className="ml-2 text-gray-700 font-bold">Aktif Tur</label>
        </div>

        {/* Resim URL (Şimdilik URL, sonra dosya yükleme yaparız) */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Resim URL</label>
          <input 
            type="text" name="mainImage"
            value={formData.mainImage} onChange={handleChange}
            placeholder="https://ornek.com/resim.jpg"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Açıklama */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-bold mb-2">Açıklama</label>
          <textarea 
            name="description" rows="4"
            value={formData.description} onChange={handleChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
            type="submit" 
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
            {isEditing ? 'Güncelle' : 'Kaydet'}
        </button>
        <button 
            type="button" 
            onClick={() => navigate('/admin/tours')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
        >
            İptal
        </button>
      </div>
    </form>
  );
};

export default AdminTourForm;
import { useState, useEffect } from 'react';
import { Trash2, Eye, Upload, Image, Video, Check, X } from 'lucide-react';

// Custom Sweet Alert Component
const SweetAlert = ({ show, type, title, text, onConfirm, onCancel, confirmText = 'Tamam', cancelText = 'İptal' }) => {
  if (!show) return null;

  const icons = {
    success: (
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    ),
    error: (
      <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <X className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    ),
    warning: (
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
    question: (
      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <Trash2 className="w-10 h-10 text-white" />
      </div>
    )
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform animate-[scaleIn_0.3s_ease-out]">
        {icons[type]}
        <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">{text}</p>
        <div className="flex gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              type === 'success' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : type === 'error'
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                : type === 'question'
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AddGaleri() {
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    kategoriSlug: '',
    il: '',
    ilce: '',
    medyaTipi: 'resim',
    medyaDosyasi: null,
    kapakResmi: null,
    altText: ''
  });

  const [kategoriler, setKategoriler] = useState([]);
  const [galeriItems, setGaleriItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [kapakPreview, setKapakPreview] = useState(null);
  const [selectedFilterSlug, setSelectedFilterSlug] = useState('all');
  
  const [alert, setAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    text: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Tamam',
    cancelText: 'İptal'
  });

  useEffect(() => {
    fetch('https://localhost:44361/api/kategoriler')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKategoriler(data.data);
        }
      })
      .catch(err => {
        console.error('Kategori yükleme hatası:', err);
        showAlert('error', 'Hata!', 'Kategoriler yüklenirken bir hata oluştu.');
      });
  }, []);

  useEffect(() => {
    if (activeTab === 'manage') {
      loadGaleriItems();
    }
  }, [activeTab]);

  const loadGaleriItems = () => {
    fetch('https://localhost:44361/api/galeri')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGaleriItems(data.data);
        }
      })
      .catch(err => {
        console.error('Galeri yükleme hatası:', err);
        showAlert('error', 'Hata!', 'Galeri yüklenirken bir hata oluştu.');
      });
  };

  const showAlert = (type, title, text, onConfirm = null, onCancel = null, confirmText = 'Tamam', cancelText = 'İptal') => {
    setAlert({
      show: true,
      type,
      title,
      text,
      onConfirm: onConfirm || (() => setAlert(prev => ({ ...prev, show: false }))),
      onCancel: onCancel || (() => setAlert(prev => ({ ...prev, show: false }))),
      confirmText,
      cancelText
    });
  };

  const handleDelete = async (id) => {
    showAlert(
      'question',
      'Emin misiniz?',
      'Bu galeri öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      async () => {
        try {
          const token = 'demo-token';
          const response = await fetch(`https://localhost:44361/api/galeri/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setGaleriItems(prev => prev.filter(item => item.id !== id));
            showAlert('success', 'Başarılı!', 'Galeri öğesi başarıyla silindi.');
          } else {
            showAlert('error', 'Hata!', 'Silme işlemi başarısız oldu.');
          }
        } catch (error) {
          console.error('Silme hatası:', error);
          showAlert('error', 'Hata!', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      },
      () => setAlert(prev => ({ ...prev, show: false })),
      'Evet, Sil',
      'İptal'
    );
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'Dosya boyutu 50MB\'dan küçük olmalıdır' }));
      showAlert('error', 'Dosya Çok Büyük!', 'Dosya boyutu 50MB\'dan küçük olmalıdır.');
      return;
    }

    const validTypes = field === 'medyaDosyasi' 
      ? formData.medyaTipi === 'resim' 
        ? ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        : ['video/mp4', 'video/webm', 'video/ogg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [field]: 'Geçersiz dosya tipi' }));
      showAlert('error', 'Geçersiz Dosya!', 'Lütfen geçerli bir dosya formatı seçin.');
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'medyaDosyasi' && formData.medyaTipi === 'resim') {
        setPreview(reader.result);
      } else if (field === 'kapakResmi') {
        setKapakPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.baslik.trim()) newErrors.baslik = 'Başlık gerekli';
    if (!formData.medyaDosyasi) newErrors.medyaDosyasi = 'Medya dosyası gerekli';
    if (formData.medyaTipi === 'video' && !formData.kapakResmi) {
      newErrors.kapakResmi = 'Video için kapak resmi gerekli';
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      showAlert('error', 'Eksik Bilgiler!', 'Lütfen tüm gerekli alanları doldurun.');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Baslik', formData.baslik);
      formDataToSend.append('Aciklama', formData.aciklama || '');
      
      if (formData.kategoriSlug && formData.kategoriSlug !== '') {
        formDataToSend.append('KategoriSlug', formData.kategoriSlug);
      }
      
      formDataToSend.append('Il', formData.il || '');
      formDataToSend.append('Ilce', formData.ilce || '');
      formDataToSend.append('MedyaTipi', formData.medyaTipi);
      
      if (formData.medyaDosyasi) {
        formDataToSend.append('MedyaDosyasi', formData.medyaDosyasi);
      }
      
      if (formData.kapakResmi) {
        formDataToSend.append('KapakResmi', formData.kapakResmi);
      }
      
      formDataToSend.append('AltText', formData.altText || '');

      const token = 'demo-token';
      const response = await fetch('https://localhost:44361/api/galeri', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('success', 'Başarılı!', 'Galeri öğesi başarıyla eklendi.', () => {
          setFormData({
            baslik: '',
            aciklama: '',
            kategoriSlug: '',
            il: '',
            ilce: '',
            medyaTipi: 'resim',
            medyaDosyasi: null,
            kapakResmi: null,
            altText: ''
          });
          setPreview(null);
          setKapakPreview(null);
          setAlert(prev => ({ ...prev, show: false }));
        });
      } else {
        const errorMsg = data.message || data.error || data.title || 'Bir hata oluştu';
        showAlert('error', 'Hata!', errorMsg);
      }
    } catch (error) {
      console.error('API Hatası:', error);
      showAlert('error', 'Hata!', 'Galeri eklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/')) {
      return `https://localhost:44361${path}`;
    }
    return `https://localhost:44361/${path}`;
  };

  const filteredItems = selectedFilterSlug === 'all' 
    ? galeriItems 
    : galeriItems.filter(item => item.kategori?.slug === selectedFilterSlug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <SweetAlert {...alert} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
            Galeri Yönetimi
          </h1>
          <p className="text-gray-600 text-lg">Yeni ekle veya mevcut öğeleri yönet</p>
        </div>

        <div className="flex gap-3 mb-8 animate-[fadeIn_0.8s_ease-out]">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl shadow-red-800/30'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <span className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Yeni Ekle
            </span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl shadow-red-800/30'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Galeriyi Yönet ({galeriItems.length})
            </span>
          </button>
        </div>

        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-6 md:p-10 animate-[fadeIn_0.5s_ease-out]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.baslik}
                  onChange={(e) => setFormData(prev => ({ ...prev, baslik: e.target.value }))}
                  className={`w-full p-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.baslik ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-600 focus:bg-white'
                  }`}
                  placeholder="Örn: Modern PVC Pencere Montajı"
                />
                {errors.baslik && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-[slideDown_0.3s_ease-out]">
                    <X className="w-4 h-4" />
                    {errors.baslik}
                  </p>
                )}
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Açıklama
                </label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData(prev => ({ ...prev, aciklama: e.target.value }))}
                  rows="4"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="Proje hakkında detaylı bilgi..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-gray-700 text-sm font-bold mb-3">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={formData.kategoriSlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, kategoriSlug: e.target.value }))}
                      className="w-full p-4 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="">Kategori Seçin</option>
                      {kategoriler.map(kat => (
                        <option key={kat.id} value={kat.slug}>
                          {kat.ustKategori ? `${kat.ustKategori} → ${kat.kategoriAdi || kat.kategori_adi}` : (kat.kategoriAdi || kat.kategori_adi)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Medya Tipi
                  </label>
                  <div className="relative">
                    <select
                      value={formData.medyaTipi}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, medyaTipi: e.target.value, medyaDosyasi: null }));
                        setPreview(null);
                      }}
                      className="w-full p-4 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="resim">📷 Resim</option>
                      <option value="video">🎥 Video</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-gray-700 text-sm font-bold mb-3">
                    İl
                  </label>
                  <input
                    type="text"
                    value={formData.il}
                    onChange={(e) => setFormData(prev => ({ ...prev, il: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300"
                    placeholder="Örn: İstanbul"
                  />
                </div>

                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-gray-700 text-sm font-bold mb-3">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={formData.ilce}
                    onChange={(e) => setFormData(prev => ({ ...prev, ilce: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300"
                    placeholder="Örn: Beşiktaş"
                  />
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {formData.medyaTipi === 'resim' ? 'Resim' : 'Video'} Dosyası
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  errors.medyaDosyasi ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
                }`}>
                  <input
                    type="file"
                    accept={formData.medyaTipi === 'resim' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileChange('medyaDosyasi', e.target.files[0])}
                    className="hidden"
                    id="medya-upload"
                  />
                  <label htmlFor="medya-upload" className="cursor-pointer">
                    {preview ? (
                      <div className="animate-[fadeIn_0.5s_ease-out]">
                        <img src={preview} alt="Preview" className="max-h-80 mx-auto rounded-xl shadow-lg mb-4 object-cover" />
                        <p className="text-gray-600 font-semibold">{formData.medyaDosyasi?.name}</p>
                      </div>
                    ) : (
                      <div className="animate-[fadeIn_0.5s_ease-out]">
                        {formData.medyaTipi === 'resim' ? (
                          <Image className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                        ) : (
                          <Video className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                        )}
                        <p className="text-gray-600 font-semibold mb-2">
                          {formData.medyaDosyasi ? formData.medyaDosyasi.name : 'Dosya seçmek için tıklayın'}
                        </p>
                        <p className="text-gray-500 text-sm">Max 50MB • {formData.medyaTipi === 'resim' ? 'JPG, PNG, WebP' : 'MP4, WebM'}</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {formData.medyaTipi === 'video' && (
                <div className="transform transition-all duration-300 hover:translate-x-1 animate-[slideDown_0.3s_ease-out]">
                  <label className="block text-gray-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Kapak Resmi (Video için)
                  </label>
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    errors.kapakResmi ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('kapakResmi', e.target.files[0])}
                      className="hidden"
                      id="kapak-upload"
                    />
                    <label htmlFor="kapak-upload" className="cursor-pointer">
                      {kapakPreview ? (
                        <div className="animate-[fadeIn_0.5s_ease-out]">
                          <img src={kapakPreview} alt="Kapak Preview" className="max-h-64 mx-auto rounded-xl shadow-lg mb-4 object-cover" />
                          <p className="text-gray-600 font-semibold">{formData.kapakResmi?.name}</p>
                        </div>
                      ) : (
                        <div className="animate-[fadeIn_0.5s_ease-out]">
                          <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 font-semibold mb-2">
                            {formData.kapakResmi ? formData.kapakResmi.name : 'Kapak resmi seçin'}
                          </p>
                          <p className="text-gray-500 text-sm">JPG, PNG, WebP</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Alt Text (SEO) 🎯
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300"
                  placeholder="Örn: Modern beyaz PVC pencere montajı yapılmış salon"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Google'da görünürlük için önemli! Resmi açıklayıcı şekilde yazın.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Yükleniyor...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Galeri Öğesi Ekle</span>
                  </span>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedFilterSlug('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedFilterSlug === 'all'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                }`}
              >
                Tümü ({galeriItems.length})
              </button>
              {kategoriler.map(kat => {
                const count = galeriItems.filter(item => item.kategori?.slug === kat.slug).length;
                return (
                  <button
                    key={kat.id}
                    onClick={() => setSelectedFilterSlug(kat.slug)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedFilterSlug === kat.slug
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                    }`}
                  >
                    {kat.kategoriAdi || kat.kategori_adi} ({count})
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Image className="w-16 h-16 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Henüz Galeri Öğesi Yok</h3>
                <p className="text-gray-600 mb-6">İlk galeri öğenizi eklemek için "Yeni Ekle" sekmesini kullanın.</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105"
                >
                  İlk Öğeyi Ekle
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-[fadeIn_0.5s_ease-out]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      {item.medyaTipi === 'resim' ? (
                        <img
                          src={getImageUrl(item.medyaDosyaYolu)}
                          alt={item.altText || item.baslik}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {item.kapakResmiYolu ? (
                            <>
                              <img
                                src={getImageUrl(item.kapakResmiYolu)}
                                alt={item.altText || item.baslik}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EVideo Kapağı%3C/text%3E%3C/svg%3E';
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                  <Video className="w-8 h-8 text-gray-800" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                              <Video className="w-16 h-16 text-gray-400 mb-2" />
                              <span className="text-gray-500 text-sm">Video</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {item.kategori && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            {item.kategori.kategoriAdi || item.kategori.kategori_adi}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.baslik}
                      </h3>
                      
                      {item.aciklama && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.aciklama}
                        </p>
                      )}

                      {(item.il || item.ilce) && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{item.il}{item.il && item.ilce ? ', ' : ''}{item.ilce}</span>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <a
                          href={getImageUrl(item.medyaTipi === 'resim' ? item.medyaDosyaYolu : item.medyaDosyaYolu)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          Görüntüle
                        </a>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 100px;
          }
        }
      `}</style>
    </div>
  );
}
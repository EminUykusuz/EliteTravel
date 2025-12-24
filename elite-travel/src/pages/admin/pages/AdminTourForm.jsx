import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tourService } from '../../../services/tourService';
import { categoryService } from '../../../services/categoryService';
import { guideService } from '../../../services/guideService';
import api from '../../../services/api';
import { 
  ArrowLeft, Save, X, Upload, Plus, Trash2, 
  MapPin, DollarSign, Users, Calendar, Image as ImageIcon,
  FileText, Settings, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';

// Dil seçenekleri
const LANGUAGES = [
  { id: 1, name: 'Türkçe', code: 'TR' },
  { id: 2, name: 'English', code: 'EN' },
  { id: 3, name: 'Nederlands', code: 'NL' },
  { id: 4, name: 'Deutsch', code: 'DE' }
];

// Popüler emoji'ler
const POPULAR_EMOJIS = [
  '✨', '🎈', '⭐', '🎁', '🚗', '🍽️', '🏨', '✈️', 
  '🎭', '🎨', '🏛️', '🕌', '🚢', '🎪', '🎯', '🏔️',
  '🌊', '🏖️', '🎿', '⛷️', '🚁', '🎢', '🎡', '🎠',
  '🍕', '🍝', '☕', '🍷', '🥂', '🎂', '🍰', '🧁'
];

export default function TourFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [guides, setGuides] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({}); // Kategori accordion state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    currency: 'EUR',
    capacity: '',
    mainImage: null,
    thumbnail: null,
    galleryPhotos: [],
    existingGalleryPhotos: [], // Backend'den gelen mevcut URL'ler
    description: '',
    isActive: true,
    guideId: '',
    categoryIds: [],
    datesText: '',
    departureCity: '',
    highlights: [],
    translations: [
      { languageId: 1, title: '', description: '', slug: '', itineraries: [], extras: [], highlights: [] }
    ],
    itineraries: [
      { dayNumber: 1, title: '', description: '', image: null }
    ],
    extras: [
      { title: '', price: '', emoji: '✨' }
    ]
  });

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPhotosPreview, setGalleryPhotosPreview] = useState([]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState({ step: null, index: null }); // Emoji picker state

  const steps = [
    { title: 'Temel Bilgiler', icon: FileText },
    { title: 'Görseller', icon: ImageIcon },
    { title: 'Program', icon: Calendar },
    { title: 'Detaylar', icon: Settings },
    { title: 'Ekstralar', icon: Plus },
  ];

  // Load categories and guides
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, guidesData] = await Promise.all([
          categoryService.getFlat(), // Flat endpoint kullan - tüm kategorileri al
          guideService.getAll()
        ]);
        // Extract data correctly - might come as { data: [...] } or direct array
        const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || []);
        // Guides come as PaginatedResultDto with Items array
        const guidesArray = guidesData?.Items || guidesData?.items || guidesData?.data?.Items || guidesData?.data || [];
        setCategories(cats);
        setGuides(guidesArray);
                      } catch (error) {
                setCategories([]);
        setGuides([]);
      }
    };
    loadData();

    // Edit modunda tur verilerini yükle
    if (isEdit) {
      loadTourData();
    }
  }, [id, isEdit]);

  const loadTourData = async () => {
    try {
      showLoading();
      const tour = await tourService.getById(parseInt(id));
      if (tour) {
        // Translations içindeki JSON alanlarını parse et
        const parsedTranslations = (tour.translations || []).map(trans => {
          let itineraries = [];
          let extras = [];
          let highlights = [];
          
          // ItinerariesJson parse
          if (trans.itinerariesJson) {
            try {
              itineraries = JSON.parse(trans.itinerariesJson);
            } catch (err) {
                          }
          }
          
          // ExtrasJson parse
          if (trans.extrasJson) {
            try {
              extras = JSON.parse(trans.extrasJson);
            } catch (err) {
                          }
          }
          
          // HighlightsJson parse
          if (trans.highlightsJson) {
            try {
              highlights = JSON.parse(trans.highlightsJson);
            } catch (err) {
                          }
          }
          
          return {
            languageId: trans.languageId,
            title: trans.title || '',
            description: trans.description || '',
            slug: trans.slug || '',
            itineraries: itineraries,
            extras: extras,
            highlights: highlights
          };
        });

        setFormData({
          title: tour.title || '',
          slug: tour.slug || '',
          price: tour.price || '',
          currency: tour.currency || 'EUR',
          capacity: tour.capacity || '',
          mainImage: null,
          thumbnail: null,
          galleryPhotos: [],
          description: tour.description || '',
          isActive: tour.isActive ?? true,
          guideId: tour.guideId || '',
          categoryIds: tour.categoryIds || [],
          datesText: tour.datesText || '',
          departureCity: tour.departureCity || '',
          highlights: tour.highlights || [],
          translations: parsedTranslations,
          itineraries: tour.itineraries || [{ dayNumber: 1, title: '', description: '' }],
          extras: (tour.extras || []).map(ex => ({
            title: ex.title || '',
            price: ex.price || '',
            emoji: ex.emoji || '✨'
          }))
        });
        
                                        
        // Helper function: relative URL'i tam URL'e çevir
        const getFullImageUrl = (url) => {
          if (!url) return null;
          if (url.startsWith('http')) return url; // Zaten tam URL
          // Relative URL'leri tam URL'e çevir
          const baseURL = api.defaults.baseURL.replace('/api', ''); // http://localhost:5067
          return url.startsWith('/') ? `${baseURL}${url}` : `${baseURL}/${url}`;
        };
        
        // Görselleri preview'de göster
        if (tour.mainImage) {
                    setMainImagePreview(getFullImageUrl(tour.mainImage));
        }
        if (tour.thumbnail) {
                    setThumbnailPreview(getFullImageUrl(tour.thumbnail));
        }
        
        // Gallery Photos'ı parse et
        let galleryPhotosArray = tour.galleryPhotos || [];
        if (typeof galleryPhotosArray === 'string') {
          try {
            galleryPhotosArray = JSON.parse(galleryPhotosArray);
                      } catch (e) {
                        galleryPhotosArray = [];
          }
        }
        
        if (Array.isArray(galleryPhotosArray) && galleryPhotosArray.length > 0) {
                    const fullGalleryUrls = galleryPhotosArray.map(getFullImageUrl);
          setGalleryPhotosPreview(fullGalleryUrls);
          // Mevcut URL'leri sakla (backend'e gönderilecek - relative URL olarak)
          setFormData(prev => ({ ...prev, existingGalleryPhotos: galleryPhotosArray }));
        }
      }
      closeLoading();
    } catch (error) {
      closeLoading();
      showError('Tur bilgileri yüklenemedi');
          }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          setMainImagePreview(reader.result);
          setFormData({ ...formData, mainImage: file });
        } else {
          setThumbnailPreview(reader.result);
          setFormData({ ...formData, thumbnail: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.title || !formData.price || !formData.capacity) {
      showError('Başlık, fiyat ve kapasite zorunludur');
      return;
    }

    showLoading();
    
    try {
      // FormData oluştur (görselleri multipart olarak gönder)
      const submitData = new FormData();
      
      // Temel alanlar - PascalCase kullan (backend binding için)
      submitData.append('Title', formData.title);
      submitData.append('Slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'));
      submitData.append('Price', parseFloat(formData.price));
      submitData.append('Currency', formData.currency);
      submitData.append('Capacity', parseInt(formData.capacity));
      submitData.append('Description', formData.description);
      submitData.append('IsActive', formData.isActive);
      submitData.append('DatesText', formData.datesText || '');
      submitData.append('DepartureCity', formData.departureCity || '');
      
      // Highlights - string array olarak gönder
      if (formData.highlights && formData.highlights.length > 0) {
        const validHighlights = formData.highlights.filter(h => h && h.trim() !== '');
        if (validHighlights.length > 0) {
          validHighlights.forEach(highlight => {
            submitData.append('Highlights', highlight);
          });
                  }
      }
      
      if (formData.guideId) {
        submitData.append('GuideId', parseInt(formData.guideId));
              }
      
      // Görseller (File objects olarak)
      if (formData.mainImage instanceof File) {
        submitData.append('MainImage', formData.mainImage);
      }
      if (formData.thumbnail instanceof File) {
        submitData.append('Thumbnail', formData.thumbnail);
      }
      
      // Gallery photos (multiple files)
      if (formData.galleryPhotos && formData.galleryPhotos.length > 0) {
        const newPhotos = formData.galleryPhotos.filter(p => p instanceof File);
        newPhotos.forEach((photo) => {
          submitData.append('GalleryPhotos', photo);
        });
        if (newPhotos.length > 0) {
                  }
      }
      
      // Mevcut galeri fotoğraflarını gönder (update sırasında korunacak)
      if (isEdit && formData.existingGalleryPhotos && formData.existingGalleryPhotos.length > 0) {
        formData.existingGalleryPhotos.forEach((photoUrl, index) => {
          submitData.append(`ExistingGalleryPhotos[${index}]`, photoUrl);
        });
              }
      
      // Kategoriler
      if (formData.categoryIds && formData.categoryIds.length > 0) {
        formData.categoryIds.forEach((catId, index) => {
          submitData.append(`CategoryIds[${index}]`, catId);
        });
              }
      
      // Çeviriler (sadece geçerli çeviriler - index'leri düzenle)
      if (formData.translations && formData.translations.length > 0) {
        // Önce valid translation'ları filtrele
        const validTranslations = formData.translations.filter(trans => 
          trans.languageId > 0 && trans.title && trans.title.trim() !== ''
        );
        
        // Ardışık index'lerle gönder
        validTranslations.forEach((trans, index) => {
          submitData.append(`Translations[${index}].LanguageId`, trans.languageId);
          submitData.append(`Translations[${index}].Title`, trans.title);
          submitData.append(`Translations[${index}].Description`, trans.description || '');
          submitData.append(`Translations[${index}].Slug`, trans.slug || '');
          
          // HighlightsJson: Eğer bu dilde highlight çevirisi varsa JSON olarak ekle
          if (trans.highlights && trans.highlights.length > 0) {
            const validHighlights = trans.highlights.filter(h => h && h.trim() !== '');
            if (validHighlights.length > 0) {
              submitData.append(`Translations[${index}].HighlightsJson`, JSON.stringify(validHighlights));
                          }
          }
          
          // ItinerariesJson: Eğer bu dilde itinerary çevirisi varsa JSON olarak ekle
          if (trans.itineraries && trans.itineraries.length > 0) {
            const validItins = trans.itineraries.filter(it => it.title || it.description);
            if (validItins.length > 0) {
              submitData.append(`Translations[${index}].ItinerariesJson`, JSON.stringify(validItins));
                          }
          }
          
          // ExtrasJson: Eğer bu dilde extra çevirisi varsa JSON olarak ekle
          if (trans.extras && trans.extras.length > 0) {
            const validExtras = trans.extras.filter(ex => ex.title);
            if (validExtras.length > 0) {
              submitData.append(`Translations[${index}].ExtrasJson`, JSON.stringify(validExtras));
                          }
          }
        });
        
              }
      
      // İtinerary'ler (sadece geçerli itineraryler - index'leri düzenle)
      if (formData.itineraries && formData.itineraries.length > 0) {
        // Önce valid itinerary'leri filtrele
        const validItineraries = formData.itineraries.filter(iter => 
          iter.dayNumber > 0 && iter.title && iter.title.trim() !== ''
        );
        
        // Ardışık index'lerle gönder (0, 1, 2, 3...)
        validItineraries.forEach((iter, index) => {
          submitData.append(`Itineraries[${index}].DayNumber`, iter.dayNumber);
          submitData.append(`Itineraries[${index}].Title`, iter.title);
          submitData.append(`Itineraries[${index}].Description`, iter.description || '');
        });
              } else {
              }

      // Ekstralar (sadece geçerli ekstralar - index'leri düzenle)
            if (formData.extras && formData.extras.length > 0) {
        // Önce valid extra'ları filtrele
        const validExtras = formData.extras.filter(extra => 
          extra.title && extra.title.trim() !== ''
        );
        
                
        // Ardışık index'lerle gönder
        validExtras.forEach((extra, index) => {
          submitData.append(`Extras[${index}].Title`, extra.title);
          submitData.append(`Extras[${index}].Price`, parseFloat(extra.price) || 0);
          submitData.append(`Extras[${index}].Emoji`, extra.emoji || '✨');
                  });
              } else {
              }

            for (let [key, value] of submitData) {
              }

      if (isEdit) {
        await tourService.update(id, submitData);
      } else {
        await tourService.create(submitData);
      }

      closeLoading();
      showSuccess(isEdit ? 'Tur güncellendi!' : 'Tur oluşturuldu!');
      navigate('/admin/tours');
    } catch (error) {
      closeLoading();
            const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0] ||
                       'Bir hata oluştu!';
      showError(errorMsg);
    }
  };

  const addItinerary = () => {
    setFormData({
      ...formData,
      itineraries: [...formData.itineraries, { 
        dayNumber: formData.itineraries.length + 1, 
        title: '', 
        description: '', 
        image: null 
      }]
    });
  };

  const removeItinerary = (index) => {
    const newItineraries = formData.itineraries.filter((_, i) => i !== index);
    setFormData({ ...formData, itineraries: newItineraries });
  };

  const addExtra = () => {
    setFormData({
      ...formData,
      extras: [...formData.extras, { title: '', price: '', emoji: '✨' }]
    });
  };

  const removeExtra = (index) => {
    const newExtras = formData.extras.filter((_, i) => i !== index);
    setFormData({ ...formData, extras: newExtras });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), '']
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = (formData.highlights || []).filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/admin/tours')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 group"
        >
          <motion.div whileHover={{ x: -5 }}>
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span className="font-medium">Turlar</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {isEdit ? 'Tur Düzenle' : 'Yeni Tur Oluştur'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Mevcut turu düzenleyin' : 'Yeni bir tur oluşturun ve yayınlayın'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Steps Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentStep(index)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                        : isActive
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/50'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                  </motion.div>
                  <p className={`mt-3 text-sm font-semibold ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full transition-all ${
                    isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Form */}
      <form 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Enter tuşuna basıldığında sadece son step'te submit olsun
          if (e.key === 'Enter' && currentStep < steps.length - 1) {
            e.preventDefault();
          }
        }}
      >
        <AnimatePresence mode="wait">
          {/* Step 0: Temel Bilgiler */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Temel Bilgiler</h2>
                  <p className="text-gray-600 text-sm">Turun temel özelliklerini girin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tur Başlığı *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Örn: Kapadokya Balon Turu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="kapadokya-balon-turu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Kapasite *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Fiyat (EUR) *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="2500"
                      required
                    />
                    <div className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center font-semibold text-gray-700">
                      € EUR
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rehber
                  </label>
                  <select
                    value={formData.guideId}
                    onChange={(e) => setFormData({ ...formData, guideId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Rehber Seçin</option>
                    {guides.map(guide => (
                      <option key={guide.id || guide.Id} value={guide.id || guide.Id}>
                        {guide.name || guide.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Kategoriler
                  </label>
                  <div className="space-y-3">
                    {/* Parent Kategoriler */}
                    {categories.filter(cat => !(cat.parentId || cat.ParentId)).map(parent => {
                      const parentId = parent.id || parent.Id;
                      const children = categories.filter(cat => (cat.parentId || cat.ParentId) === parentId);
                      const isExpanded = expandedCategories[parentId];
                      const isParentChecked = formData.categoryIds.includes(parentId);
                      
                      return (
                        <div key={parentId} className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all hover:border-amber-300">
                          {/* Parent Kategori Header - Tıklanabilir */}
                          <div 
                            className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                              isParentChecked 
                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50' 
                                : 'bg-gray-50 hover:bg-amber-50'
                            }`}
                            onClick={() => {
                              setExpandedCategories(prev => ({
                                ...prev,
                                [parentId]: !prev[parentId]
                              }));
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isParentChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setFormData({ ...formData, categoryIds: [...formData.categoryIds, parentId] });
                                  } else {
                                    setFormData({ ...formData, categoryIds: formData.categoryIds.filter(id => id !== parentId) });
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className="text-base font-bold text-gray-800 uppercase tracking-wide">
                                {parent.name || parent.Name}
                              </span>
                              {children.length > 0 && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                  {children.length}
                                </span>
                              )}
                            </div>
                            {children.length > 0 && (
                              <div className="text-amber-600">
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </div>
                            )}
                          </div>
                          
                          {/* Alt Kategoriler - Accordion */}
                          <AnimatePresence>
                            {isExpanded && children.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-white border-t border-gray-200">
                                  {children.map(child => {
                                    const childId = child.id || child.Id;
                                    const isChecked = formData.categoryIds.includes(childId);
                                    return (
                                      <label 
                                        key={childId}
                                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                                          isChecked
                                            ? 'border-amber-400 bg-amber-50'
                                            : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setFormData({ ...formData, categoryIds: [...formData.categoryIds, childId] });
                                            } else {
                                              setFormData({ ...formData, categoryIds: formData.categoryIds.filter(id => id !== childId) });
                                            }
                                          }}
                                          className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{child.name || child.Name}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="5"
                    placeholder="Tur hakkında detaylı açıklama yazın..."
                  />
                </div>

                {/* Tur Tarihleri */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Tur Tarihleri
                  </label>
                  <input
                    type="text"
                    value={formData.datesText}
                    onChange={(e) => setFormData({ ...formData, datesText: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Örn: 21 – 26 Kasım 2025"
                  />
                </div>

                {/* Kalkış Şehri */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ✈️ Kalkış Şehri
                  </label>
                  <input
                    type="text"
                    value={formData.departureCity}
                    onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Örn: Düsseldorf (DUS)"
                  />
                </div>

                {/* Öne Çıkan Özellikler */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      ✨ Öne Çıkan Özellikler (Highlights)
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addHighlight}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {(formData.highlights || []).map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...formData.highlights];
                            newHighlights[index] = e.target.value;
                            setFormData({ ...formData, highlights: newHighlights });
                          }}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Özellik ${index + 1} (Örn: Mescid-i Aksa)`}
                        />
                        {formData.highlights.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeHighlight(index)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Turu hemen yayınla (Aktif)
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Görseller */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Görseller</h2>
                  <p className="text-gray-600 text-sm">Ana görsel ve thumbnail yükleyin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ana Görsel (1920x1080)
                  </label>
                  <div className="relative">
                    {mainImagePreview ? (
                      <div className="relative group">
                        <img
                          src={mainImagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImagePreview(null);
                            setFormData({ ...formData, mainImage: null });
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group">
                        <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Görsel Yükle</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max. 5MB)</p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'main')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Küçük Görsel (400x300)
                  </label>
                  <div className="relative">
                    {thumbnailPreview ? (
                      <div className="relative group">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailPreview(null);
                            setFormData({ ...formData, thumbnail: null });
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group">
                        <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Görsel Yükle</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max. 2MB)</p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'thumbnail')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    📸 Galeri Fotoğrafları (Çoklu)
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Fotoğraf Ekle</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const newPhotos = [...formData.galleryPhotos, ...files];
                          setFormData({ ...formData, galleryPhotos: newPhotos });
                          
                          // Preview oluştur
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setGalleryPhotosPreview(prev => [...prev, reader.result]);
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Preview Grid */}
                {galleryPhotosPreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryPhotosPreview.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Preview'daki URL mevcut fotoğraf mı yoksa yeni mi?
                            const photoUrl = galleryPhotosPreview[index];
                            const isExisting = formData.existingGalleryPhotos.includes(photoUrl);
                            
                            if (isExisting) {
                              // Mevcut fotoğrafı existing listesinden çıkar
                              const newExisting = formData.existingGalleryPhotos.filter(p => p !== photoUrl);
                              setFormData({ ...formData, existingGalleryPhotos: newExisting });
                            } else {
                              // Yeni fotoğrafı galleryPhotos'dan çıkar
                              const photoFile = formData.galleryPhotos[index - formData.existingGalleryPhotos.length];
                              const newPhotos = formData.galleryPhotos.filter(p => p !== photoFile);
                              setFormData({ ...formData, galleryPhotos: newPhotos });
                            }
                            
                            // Preview'dan kaldır
                            const newPreviews = galleryPhotosPreview.filter((_, i) => i !== index);
                            setGalleryPhotosPreview(newPreviews);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {galleryPhotosPreview.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Henüz galeri fotoğrafı eklenmedi</p>
                    <p className="text-xs text-gray-400 mt-1">Yukarıdaki butonu kullanarak birden fazla fotoğraf ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Çeviriler (Genişletilmiş) */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Çeviriler</h2>
                  <p className="text-gray-600 text-sm">Her dil için başlık, açıklama, program ve ekstralar</p>
                </div>
              </div>

              <div className="space-y-6">
                {LANGUAGES.map((lang, langIndex) => {
                  const translation = formData.translations.find(t => t.languageId === lang.id) || {
                    languageId: lang.id,
                    title: '',
                    description: '',
                    slug: '',
                    itineraries: formData.itineraries.map(it => ({ dayNumber: it.dayNumber, title: '', description: '' })),
                    extras: formData.extras.map(() => ({ title: '', price: '' })),
                    highlights: formData.highlights.map(() => '')
                  };

                  return (
                    <details key={lang.id} className="group border-2 border-gray-200 rounded-xl overflow-hidden" open={langIndex === 0}>
                      <summary className="cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-between hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{lang.code === 'TR' ? '🇹🇷' : lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'}</span>
                          <div>
                            <span className="font-bold text-lg">{lang.name}</span>
                            <p className="text-xs text-gray-600">{translation.title || 'Henüz girilmedi'}</p>
                          </div>
                        </div>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>

                      <div className="p-6 space-y-6 bg-white">
                        {/* Temel Bilgiler */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Temel Bilgiler
                          </h3>
                          
                          {lang.code === 'TR' ? (
                            // Türkçe için formData'dan al (orijinal içerik)
                            <>
                              <input
                                type="text"
                                placeholder="Türkçe başlık"
                                value={formData.title}
                                onChange={(e) => {
                                  setFormData({ ...formData, title: e.target.value });
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <textarea
                                placeholder="Türkçe açıklama"
                                value={formData.description}
                                onChange={(e) => {
                                  setFormData({ ...formData, description: e.target.value });
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="4"
                              />
                            </>
                          ) : (
                            // Diğer diller için sol-sağ grid layout
                            <>
                              {/* Başlık */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">🇹🇷 Orijinal Başlık</label>
                                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                                    {formData.translations.find(t => t.languageId === 1)?.title || formData.title || 'Henüz girilmedi'}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">{lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'} {lang.name} Çeviri</label>
                                  <input
                                    type="text"
                                    placeholder={`${lang.name} başlığı`}
                                    value={translation.title}
                                    onChange={(e) => {
                                      const updated = formData.translations.map(t =>
                                        t.languageId === lang.id ? { ...t, title: e.target.value } : t
                                      );
                                      if (!updated.find(t => t.languageId === lang.id)) {
                                        updated.push({ ...translation, title: e.target.value });
                                      }
                                      setFormData({ ...formData, translations: updated });
                                    }}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {/* Açıklama */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">🇹🇷 Orijinal Açıklama</label>
                                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 max-h-32 overflow-y-auto">
                                    {formData.translations.find(t => t.languageId === 1)?.description || formData.description || 'Henüz girilmedi'}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600 mb-1 block">{lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'} {lang.name} Çeviri</label>
                                  <textarea
                                    placeholder={`${lang.name} açıklaması`}
                                    value={translation.description}
                                    onChange={(e) => {
                                      const updated = formData.translations.map(t =>
                                        t.languageId === lang.id ? { ...t, description: e.target.value } : t
                                      );
                                      if (!updated.find(t => t.languageId === lang.id)) {
                                        updated.push({ ...translation, description: e.target.value });
                                      }
                                      setFormData({ ...formData, translations: updated });
                                    }}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* İtinerary Çevirileri */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Program Günleri ({formData.itineraries.length} gün)
                          </h3>
                          {formData.itineraries.map((baseItin, idx) => {
                            const itinTranslation = translation.itineraries?.[idx] || { dayNumber: baseItin.dayNumber, title: '', description: '' };
                            return (
                              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    {baseItin.dayNumber}
                                  </div>
                                  <span className="text-sm font-medium text-gray-600">Gün {baseItin.dayNumber}</span>
                                </div>
                                
                                {lang.code === 'TR' ? (
                                  // Türkçe için direkt input (orijinal)
                                  <>
                                    <input
                                      type="text"
                                      placeholder={`Gün ${baseItin.dayNumber} başlığı`}
                                      value={itinTranslation.title}
                                      onChange={(e) => {
                                        const updatedTrans = formData.translations.map(t => {
                                          if (t.languageId === lang.id) {
                                            const newItins = [...(t.itineraries || [])];
                                            newItins[idx] = { ...itinTranslation, title: e.target.value };
                                            return { ...t, itineraries: newItins };
                                          }
                                          return t;
                                        });
                                        if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                          const newItins = formData.itineraries.map((_, i) => i === idx ? { ...itinTranslation, title: e.target.value } : { dayNumber: formData.itineraries[i].dayNumber, title: '', description: '' });
                                          updatedTrans.push({ ...translation, itineraries: newItins });
                                        }
                                        setFormData({ ...formData, translations: updatedTrans });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                                    />
                                    <textarea
                                      placeholder={`Gün ${baseItin.dayNumber} açıklaması`}
                                      value={itinTranslation.description}
                                      onChange={(e) => {
                                        const updatedTrans = formData.translations.map(t => {
                                          if (t.languageId === lang.id) {
                                            const newItins = [...(t.itineraries || [])];
                                            newItins[idx] = { ...itinTranslation, description: e.target.value };
                                            return { ...t, itineraries: newItins };
                                          }
                                          return t;
                                        });
                                        if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                          const newItins = formData.itineraries.map((_, i) => i === idx ? { ...itinTranslation, description: e.target.value } : { dayNumber: formData.itineraries[i].dayNumber, title: '', description: '' });
                                          updatedTrans.push({ ...translation, itineraries: newItins });
                                        }
                                        setFormData({ ...formData, translations: updatedTrans });
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      rows="2"
                                    />
                                  </>
                                ) : (
                                  // Diğer diller için sol-sağ layout
                                  <div className="grid grid-cols-2 gap-4">
                                    {/* Sol: Orijinal Türkçe */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">🇹🇷 Orijinal</label>
                                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mb-2 font-medium text-gray-800">
                                        {baseItin.title || 'Başlık yok'}
                                      </div>
                                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 max-h-24 overflow-y-auto">
                                        {baseItin.description || 'Açıklama yok'}
                                      </div>
                                    </div>
                                    
                                    {/* Sağ: Çeviri Input */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">{lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'} Çeviri</label>
                                      <input
                                        type="text"
                                        placeholder={`Başlık (${lang.name})`}
                                        value={itinTranslation.title}
                                        onChange={(e) => {
                                          const updatedTrans = formData.translations.map(t => {
                                            if (t.languageId === lang.id) {
                                              const newItins = [...(t.itineraries || [])];
                                              newItins[idx] = { ...itinTranslation, title: e.target.value };
                                              return { ...t, itineraries: newItins };
                                            }
                                            return t;
                                          });
                                          if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                            const newItins = formData.itineraries.map((_, i) => i === idx ? { ...itinTranslation, title: e.target.value } : { dayNumber: formData.itineraries[i].dayNumber, title: '', description: '' });
                                            updatedTrans.push({ ...translation, itineraries: newItins });
                                          }
                                          setFormData({ ...formData, translations: updatedTrans });
                                        }}
                                        className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-orange-500"
                                      />
                                      <textarea
                                        placeholder={`Açıklama (${lang.name})`}
                                        value={itinTranslation.description}
                                        onChange={(e) => {
                                          const updatedTrans = formData.translations.map(t => {
                                            if (t.languageId === lang.id) {
                                              const newItins = [...(t.itineraries || [])];
                                              newItins[idx] = { ...itinTranslation, description: e.target.value };
                                              return { ...t, itineraries: newItins };
                                            }
                                            return t;
                                          });
                                          if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                            const newItins = formData.itineraries.map((_, i) => i === idx ? { ...itinTranslation, description: e.target.value } : { dayNumber: formData.itineraries[i].dayNumber, title: '', description: '' });
                                            updatedTrans.push({ ...translation, itineraries: newItins });
                                          }
                                          setFormData({ ...formData, translations: updatedTrans });
                                        }}
                                        className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                                        rows="2"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Highlights Çevirileri */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Öne Çıkan Özellikler ({(formData.highlights || []).length} adet)
                          </h3>
                          {(formData.highlights || []).map((baseHighlight, idx) => {
                            // Translation'dan bu highlight'ı bul - eğer yoksa boş string
                            const highlightTranslation = translation.highlights?.[idx] || '';
                            
                            return (
                              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {lang.code === 'TR' ? (
                                  // Türkçe için direkt input (orijinal içerik)
                                  <input
                                    type="text"
                                    placeholder={`Özellik ${idx + 1}`}
                                    value={highlightTranslation}
                                    onChange={(e) => {
                                      const updatedTrans = formData.translations.map(t => {
                                        if (t.languageId === lang.id) {
                                          const newHighlights = [...(t.highlights || [])];
                                          newHighlights[idx] = e.target.value;
                                          return { ...t, highlights: newHighlights };
                                        }
                                        return t;
                                      });
                                      if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                        const newHighlights = formData.highlights.map((_, i) => i === idx ? e.target.value : '');
                                        updatedTrans.push({ ...translation, highlights: newHighlights });
                                      }
                                      setFormData({ ...formData, translations: updatedTrans });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                ) : (
                                  // Diğer diller için sol-sağ layout
                                  <div className="grid grid-cols-2 gap-4">
                                    {/* Sol: Orijinal Türkçe */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">🇹🇷 Orijinal</label>
                                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800">
                                        ✓ {baseHighlight || 'Özellik yok'}
                                      </div>
                                    </div>
                                    
                                    {/* Sağ: Çeviri Input */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">{lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'} Çeviri</label>
                                      <input
                                        type="text"
                                        placeholder={`Özellik (${lang.name})`}
                                        value={highlightTranslation}
                                        onChange={(e) => {
                                          const updatedTrans = formData.translations.map(t => {
                                            if (t.languageId === lang.id) {
                                              const newHighlights = [...(t.highlights || [])];
                                              newHighlights[idx] = e.target.value;
                                              return { ...t, highlights: newHighlights };
                                            }
                                            return t;
                                          });
                                          if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                            const newHighlights = formData.highlights.map((_, i) => i === idx ? e.target.value : '');
                                            updatedTrans.push({ ...translation, highlights: newHighlights });
                                          }
                                          setFormData({ ...formData, translations: updatedTrans });
                                        }}
                                        className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Extra Çevirileri */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Ekstra Hizmetler ({formData.extras.length} adet)
                          </h3>
                          {formData.extras.map((baseExtra, idx) => {
                            const extraTranslation = translation.extras?.[idx] || { title: '', price: baseExtra.price, emoji: baseExtra.emoji };
                            return (
                              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {lang.code === 'TR' ? (
                                  // Türkçe için direkt input
                                  <div className="flex gap-3">
                                    <div className="relative">
                                      <div className="flex flex-col gap-1">
                                        <input
                                          type="text"
                                          placeholder="Emoji"
                                          value={extraTranslation.emoji || ''}
                                          onChange={(e) => {
                                            const updatedTrans = formData.translations.map(t => {
                                              if (t.languageId === lang.id) {
                                                const newExtras = [...(t.extras || [])];
                                                newExtras[idx] = { ...extraTranslation, emoji: e.target.value };
                                                return { ...t, extras: newExtras };
                                              }
                                              return t;
                                            });
                                            if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                              const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, emoji: e.target.value } : { title: '', price: '', emoji: '' });
                                              updatedTrans.push({ ...translation, extras: newExtras });
                                            }
                                            setFormData({ ...formData, translations: updatedTrans });
                                          }}
                                          className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center text-xl"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setEmojiPickerOpen(
                                            emojiPickerOpen.step === 3 && emojiPickerOpen.index === `tr-${idx}` 
                                              ? { step: null, index: null } 
                                              : { step: 3, index: `tr-${idx}` }
                                          )}
                                          className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                          {emojiPickerOpen.step === 3 && emojiPickerOpen.index === `tr-${idx}` ? '✕' : '😀'}
                                        </button>
                                      </div>
                                      
                                      {/* Emoji Picker */}
                                      {emojiPickerOpen.step === 3 && emojiPickerOpen.index === `tr-${idx}` && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-3 z-50"
                                          style={{ width: '280px' }}
                                        >
                                          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                                            {POPULAR_EMOJIS.map((emoji, emojiIdx) => (
                                              <button
                                                key={emojiIdx}
                                                type="button"
                                                onClick={() => {
                                                  const updatedTrans = formData.translations.map(t => {
                                                    if (t.languageId === lang.id) {
                                                      const newExtras = [...(t.extras || [])];
                                                      newExtras[idx] = { ...extraTranslation, emoji };
                                                      return { ...t, extras: newExtras };
                                                    }
                                                    return t;
                                                  });
                                                  if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                                    const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, emoji } : { title: '', price: '', emoji: '' });
                                                    updatedTrans.push({ ...translation, extras: newExtras });
                                                  }
                                                  setFormData({ ...formData, translations: updatedTrans });
                                                  setEmojiPickerOpen({ step: null, index: null });
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-blue-100 rounded transition-all"
                                              >
                                                {emoji}
                                              </button>
                                            ))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder={`Extra ${idx + 1} başlığı`}
                                      value={extraTranslation.title}
                                      onChange={(e) => {
                                        const updatedTrans = formData.translations.map(t => {
                                          if (t.languageId === lang.id) {
                                            const newExtras = [...(t.extras || [])];
                                            newExtras[idx] = { ...extraTranslation, title: e.target.value };
                                            return { ...t, extras: newExtras };
                                          }
                                          return t;
                                        });
                                        if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                          const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, title: e.target.value } : { title: '', price: '', emoji: '' });
                                          updatedTrans.push({ ...translation, extras: newExtras });
                                        }
                                        setFormData({ ...formData, translations: updatedTrans });
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                ) : (
                                  // Diğer diller için sol-sağ layout
                                  <div className="grid grid-cols-2 gap-4">
                                    {/* Sol: Orijinal */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">🇹🇷 Orijinal</label>
                                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800">
                                        <span className="text-xl mr-2">{baseExtra.emoji || '✨'}</span>
                                        {baseExtra.title || 'Extra başlık yok'} <span className="text-green-600 ml-2">({baseExtra.price}€)</span>
                                      </div>
                                    </div>
                                    
                                    {/* Sağ: Çeviri */}
                                    <div>
                                      <label className="text-xs text-gray-600 mb-1 block">{lang.code === 'EN' ? '🇬🇧' : lang.code === 'NL' ? '🇳🇱' : '🇩🇪'} Çeviri</label>
                                      <div className="flex gap-2">
                                        <div className="relative">
                                          <div className="flex flex-col gap-1">
                                            <input
                                              type="text"
                                              placeholder="Emoji"
                                              value={extraTranslation.emoji || ''}
                                              onChange={(e) => {
                                                const updatedTrans = formData.translations.map(t => {
                                                  if (t.languageId === lang.id) {
                                                    const newExtras = [...(t.extras || [])];
                                                    newExtras[idx] = { ...extraTranslation, emoji: e.target.value };
                                                    return { ...t, extras: newExtras };
                                                  }
                                                  return t;
                                                });
                                                if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                                  const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, emoji: e.target.value } : { title: '', price: '', emoji: '' });
                                                  updatedTrans.push({ ...translation, extras: newExtras });
                                                }
                                                setFormData({ ...formData, translations: updatedTrans });
                                              }}
                                              className="w-16 px-2 py-2 border-2 border-green-200 rounded-lg text-sm text-center text-xl focus:ring-2 focus:ring-green-500"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => setEmojiPickerOpen(
                                                emojiPickerOpen.step === 3 && emojiPickerOpen.index === `${lang.code}-${idx}` 
                                                  ? { step: null, index: null } 
                                                  : { step: 3, index: `${lang.code}-${idx}` }
                                              )}
                                              className="text-[10px] text-green-600 hover:text-green-700 font-medium"
                                            >
                                              {emojiPickerOpen.step === 3 && emojiPickerOpen.index === `${lang.code}-${idx}` ? '✕' : '😀'}
                                            </button>
                                          </div>
                                          
                                          {/* Emoji Picker */}
                                          {emojiPickerOpen.step === 3 && emojiPickerOpen.index === `${lang.code}-${idx}` && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0.95 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-green-200 p-3 z-50"
                                              style={{ width: '280px' }}
                                            >
                                              <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                                                {POPULAR_EMOJIS.map((emoji, emojiIdx) => (
                                                  <button
                                                    key={emojiIdx}
                                                    type="button"
                                                    onClick={() => {
                                                      const updatedTrans = formData.translations.map(t => {
                                                        if (t.languageId === lang.id) {
                                                          const newExtras = [...(t.extras || [])];
                                                          newExtras[idx] = { ...extraTranslation, emoji };
                                                          return { ...t, extras: newExtras };
                                                        }
                                                        return t;
                                                      });
                                                      if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                                        const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, emoji } : { title: '', price: '', emoji: '' });
                                                        updatedTrans.push({ ...translation, extras: newExtras });
                                                      }
                                                      setFormData({ ...formData, translations: updatedTrans });
                                                      setEmojiPickerOpen({ step: null, index: null });
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-green-100 rounded transition-all"
                                                  >
                                                    {emoji}
                                                  </button>
                                                ))}
                                              </div>
                                            </motion.div>
                                          )}
                                        </div>
                                        <input
                                          type="text"
                                          placeholder={`Extra başlığı (${lang.name})`}
                                          value={extraTranslation.title}
                                          onChange={(e) => {
                                            const updatedTrans = formData.translations.map(t => {
                                              if (t.languageId === lang.id) {
                                                const newExtras = [...(t.extras || [])];
                                                newExtras[idx] = { ...extraTranslation, title: e.target.value };
                                                return { ...t, extras: newExtras };
                                              }
                                              return t;
                                            });
                                            if (!updatedTrans.find(t => t.languageId === lang.id)) {
                                              const newExtras = formData.extras.map((_, i) => i === idx ? { ...extraTranslation, title: e.target.value } : { title: '', price: '', emoji: '' });
                                              updatedTrans.push({ ...translation, extras: newExtras });
                                            }
                                            setFormData({ ...formData, translations: updatedTrans });
                                          }}
                                          className="flex-1 px-3 py-2 border-2 border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Program (Itineraries) */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gün Programı</h2>
                    <p className="text-gray-600 text-sm">Günlük aktiviteleri ekleyin</p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addItinerary}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Gün Ekle
                </motion.button>
              </div>

              <div className="space-y-4">
                {formData.itineraries.map((itinerary, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-700">Gün {index + 1}</span>
                      </div>
                      {formData.itineraries.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItinerary(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Gün başlığı"
                      value={itinerary.title}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries];
                        newItineraries[index].title = e.target.value;
                        setFormData({ ...formData, itineraries: newItineraries });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Gün programı açıklaması"
                      value={itinerary.description}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries];
                        newItineraries[index].description = e.target.value;
                        setFormData({ ...formData, itineraries: newItineraries });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Ekstralar */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              onAnimationComplete={() => {
                              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Ekstra Hizmetler</h2>
                    <p className="text-gray-600 text-sm">Ek ücretli hizmetler ekleyin</p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addExtra}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Ekstra Ekle
                </motion.button>
              </div>

              <div className="space-y-4">
                {formData.extras.map((extra, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 items-start p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 transition-all"
                  >
                    {/* Emoji Seçici */}
                    <div className="relative">
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Emoji"
                          value={extra.emoji || ''}
                          onChange={(e) => {
                            const newExtras = [...formData.extras];
                            newExtras[index].emoji = e.target.value;
                            setFormData({ ...formData, extras: newExtras });
                          }}
                          className="w-20 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-2xl"
                        />
                        <button
                          type="button"
                          onClick={() => setEmojiPickerOpen(
                            emojiPickerOpen.step === 4 && emojiPickerOpen.index === index 
                              ? { step: null, index: null } 
                              : { step: 4, index }
                          )}
                          className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                        >
                          {emojiPickerOpen.step === 4 && emojiPickerOpen.index === index ? '✕ Kapat' : '😀 Seç'}
                        </button>
                      </div>
                      
                      {/* Emoji Picker Dropdown */}
                      {emojiPickerOpen.step === 4 && emojiPickerOpen.index === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border-2 border-pink-200 p-4 z-50"
                          style={{ width: '320px' }}
                        >
                          <p className="text-xs text-gray-600 mb-3 font-semibold">🎨 Popüler Emoji'ler:</p>
                          <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                            {POPULAR_EMOJIS.map((emoji, emojiIdx) => (
                              <button
                                key={emojiIdx}
                                type="button"
                                onClick={() => {
                                  const newExtras = [...formData.extras];
                                  newExtras[index].emoji = emoji;
                                  setFormData({ ...formData, extras: newExtras });
                                  setEmojiPickerOpen({ step: null, index: null });
                                }}
                                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-pink-100 rounded-lg transition-all transform hover:scale-110"
                                title={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Hizmet adı (Örn: Balon Turu)"
                      value={extra.title}
                      onChange={(e) => {
                        const newExtras = [...formData.extras];
                        newExtras[index].title = e.target.value;
                        setFormData({ ...formData, extras: newExtras });
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Fiyat"
                      value={extra.price}
                      onChange={(e) => {
                        const newExtras = [...formData.extras];
                        newExtras[index].price = e.target.value;
                        setFormData({ ...formData, extras: newExtras });
                      }}
                      className="w-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    {formData.extras.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeExtra(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between mt-6"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Geri
          </motion.button>

          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                İleri
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="w-5 h-5" />
                {isEdit ? 'Güncelle' : 'Kaydet'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
}
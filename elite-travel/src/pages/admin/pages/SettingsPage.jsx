import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Upload, X } from 'lucide-react';
import { showSuccess, showError } from '../../../utils/alerts';
import { settingsService } from '../../../serivces/genericService';
import api from '../../../services/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteEmail: '',
    sitePhone: '',
    address: ''
  });

  const [seoSettings, setSeoSettings] = useState({
    googleAnalytics: '',
    faviconUrl: ''
  });

  const [socialMedia, setSocialMedia] = useState({
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: ''
  });

  // Ayarları yükle
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsService.getAll();
        const data = response.data ? response.data[0] : response[0];
        
        if (data) {
          setSettingsId(data.id);
          setGeneralSettings({
            siteName: data.siteName || '',
            siteEmail: data.siteEmail || '',
            sitePhone: data.sitePhone || '',
            address: data.address || ''
          });
          setSeoSettings({
            googleAnalytics: data.googleAnalytics || '',
            faviconUrl: data.faviconUrl || ''
          });
          if (data.faviconUrl) {
            setFaviconPreview(data.faviconUrl);
          }
          setSocialMedia({
            facebookUrl: data.facebookUrl || '',
            instagramUrl: data.instagramUrl || '',
            twitterUrl: data.twitterUrl || '',
            youtubeUrl: data.youtubeUrl || ''
          });
        }
      } catch (error) { /* ignored */ } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      if (settingsId) {
        await settingsService.update(settingsId, generalSettings);
      } else {
        const response = await settingsService.create(generalSettings);
        setSettingsId(response.data?.id || response.id);
      }
      showSuccess('Genel ayarlar kaydedildi!');
    } catch (error) {
      showError('Kaydedilemedi!');
          }
  };

  const handleSaveSEO = async (e) => {
    e.preventDefault();
    try {
      let faviconUrl = seoSettings.faviconUrl;
      
      // Eğer yeni favicon dosyası seçilmişse, önce upload et
      if (faviconFile) {
        const formData = new FormData();
        formData.append('file', faviconFile);
        
        try {
          const uploadResponse = await api.post('/FileUpload/upload-favicon', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (uploadResponse.data) {
            faviconUrl = uploadResponse.data.url || uploadResponse.data.data?.url;
                      }
        } catch (uploadError) {
                    showError('Favicon yüklenemedi!');
          return;
        }
      }
      
      const updatedSettings = { ...seoSettings, faviconUrl };
      
            
      if (settingsId) {
        await settingsService.update(settingsId, updatedSettings);
      } else {
        const response = await settingsService.create(updatedSettings);
        setSettingsId(response.data?.id || response.id);
      }
      
      setSeoSettings(updatedSettings);
      setFaviconFile(null); // Dosyayı temizle
      showSuccess('SEO ayarları kaydedildi!');
    } catch (error) {
      showError('Kaydedilemedi!');
          }
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    try {
      if (!settingsId) {
        showError('Önce genel ayarları kaydedin!');
        return;
      }

      const payload = {
        facebookUrl: socialMedia.facebookUrl || '',
        instagramUrl: socialMedia.instagramUrl || '',
        twitterUrl: socialMedia.twitterUrl || '',
        youtubeUrl: socialMedia.youtubeUrl || ''
      };
      
            await settingsService.update(settingsId, payload);
      showSuccess('Sosyal medya ayarları kaydedildi!');
    } catch (error) {
            showError(error.response?.data?.message || 'Kaydedilemedi!');
    }
  };

  const tabs = [
    { id: 'general', label: 'Genel', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'social', label: 'Sosyal Medya', icon: Instagram }
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ayarlar</h1>
        <p className="text-gray-600">Site ayarlarını yönetin</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Genel Ayarlar</h2>
                    <p className="text-gray-600 text-sm">Site bilgilerini düzenleyin</p>
                  </div>
                </div>

                <form onSubmit={handleSaveGeneral} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site Adı
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.siteEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteEmail: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.sitePhone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, sitePhone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Adres
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Kaydet
                  </button>
                </form>
              </motion.div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">SEO Ayarları</h2>
                    <p className="text-gray-600 text-sm">Arama motoru optimizasyonu</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSEO} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.googleAnalytics}
                      onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalytics: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="G-XXXXXXXXXX veya UA-XXXXXXXXX-X"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Google Analytics 4 (G-) veya Universal Analytics (UA-) tracking kodunu girin
                    </p>
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Favicon (Site İkonu)
                    </label>
                    <div className="flex items-start gap-4">
                      {/* Preview */}
                      {faviconPreview && (
                        <div className="relative group">
                          <img
                            src={faviconPreview}
                            alt="Favicon"
                            className="w-16 h-16 object-contain rounded-lg border-2 border-gray-300 bg-white p-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFaviconPreview(null);
                              setFaviconFile(null);
                              setSeoSettings({ ...seoSettings, faviconUrl: '' });
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-all flex-1">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Favicon Yükle</p>
                        <p className="text-xs text-gray-400 mt-1">ICO, PNG (32x32 veya 64x64)</p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".ico,.png"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFaviconPreview(reader.result);
                              };
                              reader.readAsDataURL(file);
                              setFaviconFile(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Favicon, tarayıcı sekmesinde görünen küçük site ikonudur. 32x32 veya 64x64 piksel boyutunda olmalıdır.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Kaydet
                  </button>
                </form>
              </motion.div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sosyal Medya</h2>
                    <p className="text-gray-600 text-sm">Sosyal medya hesaplarınız</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSocial} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 inline mr-1" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socialMedia.facebookUrl}
                      onChange={(e) => setSocialMedia({ ...socialMedia, facebookUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-1" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socialMedia.instagramUrl}
                      onChange={(e) => setSocialMedia({ ...socialMedia, instagramUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 inline mr-1" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={socialMedia.twitterUrl}
                      onChange={(e) => setSocialMedia({ ...socialMedia, twitterUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Youtube className="w-4 h-4 inline mr-1" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={socialMedia.youtubeUrl}
                      onChange={(e) => setSocialMedia({ ...socialMedia, youtubeUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/@..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Kaydet
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
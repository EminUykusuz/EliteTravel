import React, { useEffect, useState, useCallback } from "react"; 
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";
import { Bell, LogOut, Settings, Search, Image, Save, Upload, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 

// Sweet Alert Component (Aynen kalıyor)
const SweetAlert = ({ show, type, title, text, onConfirm, confirmText = 'Tamam' }) => {
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
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform animate-[scaleIn_0.3s_ease-out]">
        {icons[type]}
        <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <p className="text-gray-600 text-center mb-8 text-lg">{text}</p>
        <button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cardsData, setCardsData] = useState([
    { title: 'Toplam Mesaj', value: '0' },
    { title: 'Aktif Blog', value: '0' },
    { title: 'Galeri Öğesi', value: '0' },
    { title: 'Ziyaretçi (Aylık)', value: '0' }
  ]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const [weeklyTrendData, setWeeklyTrendData] = useState([
    { day: 'Pzt', value: 10 }, { day: 'Sal', value: 30 }, { day: 'Çar', value: 25 },
    { day: 'Per', value: 50 }, { day: 'Cum', value: 45 }, { day: 'Cmt', value: 60 },
    { day: 'Paz', value: 55 },
  ]);
  const [interactionData, setInteractionData] = useState([
    { type: 'Blog', value: 120 }, { type: 'Galeri', value: 300 }, { type: 'Mesaj', value: 80 },
  ]);
  
  const [seoData, setSeoData] = useState({
    id: null, sayfa_tipi: 'anasayfa', sayfa_id: null, title: '',
    description: '', meta_keywords: '', aciklama: ''
  });
  const [availablePages, setAvailablePages] = useState([]);
  const [loadingSeoPages, setLoadingSeoPages] = useState(false);
  
  const [logoData, setLogoData] = useState({ logo: null, favicon: null });
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', title: '', text: '' });

  const API_BASE_URL = 'https://localhost:44361/api';

  const showAlert = useCallback((type, title, text) => {
    setAlert({ show: true, type, title, text });
  }, []); 

  const handleLogout = useCallback(async () => {
    console.log("Çıkış yapılıyor...");
    try {
      await axios.post(`${API_BASE_URL}/AdminAuth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Çıkış yaparken hata:", error);
    } finally {
      navigate("/admin/login");
    }
  }, [navigate]); 

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const mergedOptions = {
      ...options,
      credentials: 'include', 
      headers: { ...defaultHeaders, ...options.headers },
    };
    if (options.body instanceof FormData) {
      delete mergedOptions.headers['Content-Type'];
    }

    const response = await fetch(url, mergedOptions);
    
    if (response.status === 401) {
      console.error("API isteği yetkisiz (401), çıkış yapılıyor.");
      await handleLogout(); 
      throw new Error('Yetkisiz');
    }

    if (response.status === 204) return null;

    if (!response.ok) {
      const errorText = await response.text(); 
      if (!errorText || errorText.startsWith("Cannot GET")) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `HTTP ${response.status}`);
      } catch (e) {
        throw new Error(errorText);
      }
    }
    
    const result = await response.json(); 

    if (result && typeof result === 'object' && result.hasOwnProperty('data') && result.success) {
      return result.data; 
    }
    
    return result; 
  }, [handleLogout]); 

  useEffect(() => {
    console.log("Dashboard yüklendi, API verileri çekiliyor...");
    
    const fetchData = async () => {
      let localAvailablePages = []; 

      // --- KANKA DÜZELTME BURADA BAŞLIYOR ---
      // Tüm sabit sayfaları tanımla
      const defaultPages = [
        { sayfaTipi: 'anasayfa', sayfaId: null, sayfaAdi: 'Anasayfa' },
        { sayfaTipi: 'hakkimizda', sayfaId: null, sayfaAdi: 'Hakkımızda' },
        { sayfaTipi: 'urunler', sayfaId: null, sayfaAdi: 'Ürünler (Genel)' },
        { sayfaTipi: 'galeri', sayfaId: null, sayfaAdi: 'Galeri (Genel)' },
        { sayfaTipi: 'blog', sayfaId: null, sayfaAdi: 'Blog (Genel)' },
        { sayfaTipi: 'iletisim', sayfaId: null, sayfaAdi: 'İletişim' }
      ];

      try {
        setLoadingSeoPages(true);
        const pagesResult = await fetchWithAuth(`${API_BASE_URL}/Seo/all`);
        
        let formattedPages = [];
        if (pagesResult && Array.isArray(pagesResult)) {
          // API'den gelen, ID'si olan sayfaları formatla
          formattedPages = pagesResult.map(page => ({
            id: page.id, 
            sayfaAdi: page.title || `${page.sayfa_tipi} (ID: ${page.sayfa_id})`, 
            sayfaTipi: page.sayfa_tipi?.toLowerCase(), 
            sayfaId: page.sayfa_id,
            aciklama: page.aciklama,
            metaDescription: page.metaDescription, 
            metaKeywords: page.metaKeywords
          }));
        }

        // Sabit sayfaları (Anasayfa, Galeri vb.) kontrol et
        defaultPages.forEach(defaultPage => {
          const exists = formattedPages.some(
            p => p.sayfaTipi === defaultPage.sayfaTipi && p.sayfaId === defaultPage.sayfaId
          );
          
          // Eğer API'den gelen listede bu sayfa YOKSA, manuel olarak ekle
          if (!exists) {
            formattedPages.unshift({ // Başa ekle
                id: null, 
                sayfaAdi: `${defaultPage.sayfaAdi} (Yeni Kayıt)`, 
                sayfaTipi: defaultPage.sayfaTipi, 
                sayfaId: defaultPage.sayfaId,
                aciklama: `${defaultPage.sayfaAdi} sayfası için SEO kaydı henüz oluşturulmamış.`,
                metaDescription: '',
                metaKeywords: ''
            });
          }
        });
        // --- DÜZELTME SONU ---
          
        localAvailablePages = formattedPages; 
        setAvailablePages(formattedPages); 
      
      } catch (err) {
        if (err.message !== 'Yetkisiz') console.error('SEO sayfaları yükleme hatası:', err);
        // Hata olsa bile, en azından sabit sayfaları (Yeni Kayıt olarak) göster
        setAvailablePages(defaultPages.map(p => ({
            id: null,
            sayfaAdi: `${p.sayfaAdi} (Yeni Kayıt)`,
            sayfaTipi: p.sayfaTipi,
            sayfaId: p.sayfaId,
            aciklama: 'API yüklenemedi, yeni kayıt oluşturulacak.',
            metaDescription: '',
            metaKeywords: ''
        })));
      } finally {
        setLoadingSeoPages(false);
      }

      // SEO - Varsayılan olarak anasayfayı yükle
      try {
        const anasayfaFromList = localAvailablePages.find(p => p.sayfaTipi === 'anasayfa' && p.sayfaId === null);

        if (anasayfaFromList && anasayfaFromList.id === null) {
          // Bu, bizim manuel eklediğimiz "(Yeni Kayıt)"
          setSeoData({
            id: null,
            sayfa_tipi: 'anasayfa',
            sayfa_id: null,
            title: '', 
            description: '', 
            meta_keywords: '', 
            aciklama: anasayfaFromList.aciklama 
          });
        } else {
          // Bu, ID'si olan gerçek bir kayıt. API'den verilerini çek.
          const seoResult = await fetchWithAuth(`${API_BASE_URL}/Seo?sayfaTipi=anasayfa`);
          if (seoResult) {
            setSeoData({
              id: anasayfaFromList?.id || null, 
              sayfa_tipi: 'anasayfa', 
              sayfa_id: null, 
              title: seoResult.title || '',
              description: seoResult.metaDescription || '', 
              meta_keywords: seoResult.metaKeywords || '',
              aciklama: anasayfaFromList?.aciklama || '' 
            });
          }
        }
      } catch (err) {
        if (err.message !== 'Yetkisiz') console.error('SEO yükleme hatası:', err);
      }

      // Site Ayarları
      try {
        const siteResult = await fetchWithAuth(`${API_BASE_URL}/SiteAyarlari`);
        if (siteResult && Array.isArray(siteResult)) {
          const settings = siteResult;
          const logoSetting = settings.find(item => item.ayarAdi === 'logo');
          if (logoSetting) setLogoPreview(logoSetting.ayarDegeri);

          const faviconSetting = settings.find(item => item.ayarAdi === 'favicon');
          if (faviconSetting) setFaviconPreview(faviconSetting.ayarDegeri);
        }
      } catch (err) {
        if (err.message !== 'Yetkisiz') console.error('Site ayarları yükleme hatası:', err);
      }

      // Dashboard kart verileri
      setLoadingMessages(true);
      try {
        const [msgResult, blogResult, galeriResult] = await Promise.all([
          fetchWithAuth(`${API_BASE_URL}/Iletisim`), 
          fetchWithAuth(`${API_BASE_URL}/Blog`), 
          fetchWithAuth(`${API_BASE_URL}/Galeri`) 
        ]);

        const messagesData = msgResult || [];
        const blogData = blogResult || [];
        const galeriData = galeriResult || [];

        setMessages(messagesData);
        setCardsData([
          { title: 'Toplam Mesaj', value: messagesData.length.toString() },
          { title: 'Aktif Blog', value: blogData.length.toString() },
          { title: 'Galeri Öğesi', value: galeriData.length.toString() },
          { title: 'Ziyaretçi (Aylık)', value: '0' }
        ]);

      } catch (err) {
        if (err.message !== 'Yetkisiz') {
          console.error('Dashboard kart verileri yüklenemedi:', err);
          showAlert('error', 'Hata!', `Dashboard kart verileri yüklenemedi. (Hata: ${err.message})`);
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchData();
  }, [navigate, fetchWithAuth, showAlert]); 


  // Sayfa değiştirildiğinde SEO verilerini yükle
  const handlePageChange = useCallback(async (pageKey) => {
    const [sayfaTipi, sayfaIdStr] = pageKey.split('-');
    const sayfaId = (sayfaIdStr === 'null' || sayfaIdStr === undefined) ? null : parseInt(sayfaIdStr);
    setLoadingSeoPages(true);
    
    try {
      const pageFromList = availablePages.find(p => p.sayfaTipi === sayfaTipi && p.sayfaId === sayfaId);

      if (pageFromList && pageFromList.id === null) {
        // Bu, manuel eklediğimiz "(Yeni Kayıt)"
        setSeoData({
          id: null,
          sayfa_tipi: sayfaTipi,
          sayfa_id: sayfaId,
          title: '', 
          description: '', 
          meta_keywords: '', 
          aciklama: pageFromList.aciklama 
        });
      } else {
        // Bu, ID'si olan gerçek bir kayıt. API'den verilerini çek.
        const url = sayfaId
          ? `${API_BASE_URL}/Seo?sayfaTipi=${sayfaTipi}&sayfaId=${sayfaId}`
          : `${API_BASE_URL}/Seo?sayfaTipi=${sayfaTipi}`;
        
        const result = await fetchWithAuth(url); 

        if (result) {
          setSeoData({
            id: pageFromList?.id || null, 
            sayfa_tipi: sayfaTipi, 
            sayfa_id: sayfaId, 
            title: result.title || '',
            description: result.metaDescription || '', 
            meta_keywords: result.metaKeywords || '',
            aciklama: pageFromList?.aciklama || '' 
          });
        } 
      }
    } catch (err) {
      console.error('SEO verisi yükleme hatası:', err);
      showAlert('error', 'Hata!', 'SEO verileri yüklenemedi.');
       setSeoData({
          id: null, sayfa_tipi: sayfaTipi, sayfa_id: sayfaId,
          title: '', description: '', meta_keywords: '', aciklama: ''
        });
    } finally {
      setLoadingSeoPages(false);
    }
  }, [availablePages, fetchWithAuth, showAlert]); 

  // SEO Kaydet
  const handleSaveSEO = useCallback(async () => {
    if (!seoData.title.trim()) {
      showAlert('error', 'Eksik Alan!', 'Title alanı zorunludur.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const payload = {
        Id: seoData.id,
        SayfaTipi: seoData.sayfa_tipi,
        SayfaId: seoData.sayfa_id,
        Title: seoData.title,
        MetaDescription: seoData.description, 
        MetaKeywords: seoData.meta_keywords,
        Aciklama: seoData.aciklama
      };

      const response = await fetch(
        `${API_BASE_URL}/Seo`, 
        {
          method: 'POST', 
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.status === 401) { 
        await handleLogout();
        return; 
      }
      
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        showAlert('success', 'Başarılı!', result.message || `SEO ayarları başarıyla kaydedildi.`);
      } else {
        showAlert('error', 'Hata!', result.message || `SEO ayarları kaydedilemedi (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('SEO kaydetme hatası:', error);
      showAlert('error', 'Hata!', 'Bir sunucu hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  }, [seoData, showAlert, handleLogout]); 

  // Dosya Seçme
  const handleFileChange = (field, file, previewSetter) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      showAlert('error', 'Dosya Çok Büyük!', 'Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }
    const validTypes = field === 'favicon'
      ? ['image/png', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/x-icon']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      showAlert('error', 'Geçersiz Dosya!', field === 'favicon' ? 'Sadece PNG, ICO, SVG dosyaları.' : 'Sadece JPG, PNG, WEBP, SVG dosyaları.');
      return;
    }
    setLogoData(prev => ({ ...prev, [field]: file }));
    const reader = new FileReader();
    reader.onloadend = () => previewSetter(reader.result);
    reader.readAsDataURL(file);
  };

  // Logo Kaydet
  const handleSaveLogo = useCallback(async () => {
    if (!logoData.logo && !logoData.favicon) {
      showAlert('error', 'Dosya Seçilmedi!', 'Lütfen kaydetmek için logo veya favicon seçin.');
      return;
    }
    setIsSaving(true);
    let errorMessage = '';

    const uploadFile = async (ayarAdi, file, aciklama) => {
      if (!file) return true; 

      const formData = new FormData();
      formData.append('ayarAdi', ayarAdi);
      formData.append('Dosya', file);
      formData.append('Aciklama', aciklama);

      try {
        const response = await fetch(`${API_BASE_URL}/SiteAyarlari/upload`, {
          method: 'POST',
          credentials: 'include', 
          body: formData 
        });

        if (response.status === 401) { 
          await handleLogout();
          return false; 
        }
        
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          errorMessage += `${ayarAdi} yüklenemedi: ${result.message || `HTTP ${response.status}`}. `;
          return false;
        }
        
        if (ayarAdi === 'logo') setLogoPreview(result.fileUrl);
        if (ayarAdi === 'favicon') setFaviconPreview(result.fileUrl);
        return true;
      } catch(err) {
        console.error(`${ayarAdi} yükleme hatası:`, err);
        errorMessage += `${ayarAdi} yüklenirken sunucu hatası. `;
        return false;
      }
    };

    const logoSuccess = await uploadFile('logo', logoData.logo, 'Site logosu');
    const faviconSuccess = await uploadFile('favicon', logoData.favicon, 'Site favicon');

    if (logoSuccess && faviconSuccess) {
      showAlert('success', 'Başarılı!', 'Logo ve/veya favicon başarıyla kaydedildi.');
      setLogoData({ logo: null, favicon: null }); 
    } else {
      showAlert('error', 'Hata!', errorMessage || 'Dosyalar kaydedilemedi.');
    }

    setIsSaving(false);
  }, [logoData, showAlert, handleLogout]); 
  
  // --- TASARIM (JSX) ---
  // (Hiçbir değişiklik yapılmadı)
  return (
    <div> 
      <SweetAlert
        {...alert}
        onConfirm={() => setAlert(prev => ({ ...prev, show: false }))}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 shadow-md border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Mesajları Gör"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {messages.length}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              <LogOut className="w-5 h-5" /> Çıkış Yap
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 sticky top-[81px] z-10">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${activeTab === 'overview' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />Genel Bakış
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('seo')} 
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${activeTab === 'seo' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            >
              <span className="flex items-center gap-2">
                <Search className="w-5 h-5" />SEO Ayarları
              </span>
            </button>
            <button 
                onClick={() => setActiveTab('logo')} 
                className={`px-6 py-4 font-semibold transition-all border-b-2 ${activeTab === 'logo' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            >
                <span className="flex items-center gap-2">
                 <Image className="w-5 h-5" />Logo Ayarları
                </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
           <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
             {/* Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {cardsData.map((card, index) => (
                 <div 
                   key={card.title} 
                   className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                   style={{ animationDelay: `${index * 0.1}s` }}
                 >
                   <h3 className="text-gray-500 text-sm font-semibold mb-2">{card.title}</h3>
                   <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                 </div>
               ))}
             </div>

             {/* Message List */}
             <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
               <h3 className="text-xl font-bold mb-6 text-gray-800">Son İletişim Mesajları</h3>
               <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto pr-2">
                 {loadingMessages ? (
                   <p className="text-gray-500 text-center py-4">Mesajlar yükleniyor...</p>
                 ) : messages.length === 0 ? (
                   <p className="text-gray-500 text-center py-4">Henüz mesaj yok.</p>
                 ) : (
                   messages.slice(0, 10).map((msg) => ( 
                     <div key={msg.id} className="flex justify-between items-center py-4 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                       <div>
                         <p className="font-semibold text-gray-800">{msg.adSoyad || 'İsimsiz'}</p>
                         <p className="text-sm text-gray-500 truncate max-w-md">{msg.mesaj || 'Mesaj yok'}</p>
                         <p className="text-xs text-gray-400 mt-1">{msg.tarih ? new Date(msg.tarih).toLocaleString('tr-TR') : 'Tarih yok'}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             </div>

             {/* Charts */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                 <h3 className="text-xl font-bold mb-6 text-gray-800">Haftalık Ziyaretçi Trendi</h3>
                 <ResponsiveContainer width="100%" height={250}>
                   <LineChart data={weeklyTrendData}>
                     <XAxis dataKey="day" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip 
                       contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                       }}
                     />
                     <Line 
                       type="monotone" 
                       dataKey="value" 
                       stroke="#DC2626" 
                       strokeWidth={3} 
                       dot={{ r: 5 }} 
                       activeDot={{ r: 8 }}
                     />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                 <h3 className="text-xl font-bold mb-6 text-gray-800">Sayfa Etkileşim Oranları</h3>
                 <ResponsiveContainer width="100%" height={250}>
                   <BarChart data={interactionData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="type" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip 
                       cursor={{fill: 'rgba(220, 38, 38, 0.1)'}} 
                       contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                       }}
                     />
                     <Bar 
                       dataKey="value" 
                       fill="#DC2626" 
                        radius={[10, 10, 0, 0]} 
                        barSize={40} 
                      />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
           <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
               <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                 <Search className="w-8 h-8 text-red-600" />
                 SEO Ayarları
               </h2>
               <div className="space-y-6">
                 {/* Sayfa Seçimi */}
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-3">Düzenlenecek Sayfa</label>
                   {loadingSeoPages ? (
                     <div className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-500">
                       Sayfalar yükleniyor...
                     </div>
                   ) : (
                     <select 
                       value={`${seoData.sayfa_tipi}-${seoData.sayfa_id || 'null'}`} 
                       onChange={(e) => handlePageChange(e.target.value)}
                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 bg-gray-50"
                     >
                       {availablePages.length === 0 ? (
                         <option value="anasayfa-null">Anasayfa (Yüklenemedi)</option>
                       ) : (
                         availablePages.map((page) => (
                           <option 
                             key={`${page.sayfaTipi}-${page.sayfaId || 'null'}`} 
                             value={`${page.sayfaTipi}-${page.sayfaId || 'null'}`}
                           >
                             {page.sayfaAdi}
                           </option>
                         ))
                       )}
                     </select>
                   )}
                   <small className="text-gray-500 block mt-2">
                     {seoData.id ? `✓ Bu sayfa için SEO kaydı mevcut (ID: ${seoData.id})` : '⚠ Bu sayfa için henüz SEO kaydı yok (yeni oluşturulacak)'}
                   </small>
                 </div>

                 {/* Title */}
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-3">
                     Title (Sayfa Başlığı) *
                   </label>
                   <input 
                     type="text" 
                     value={seoData.title} 
                     onChange={(e) => setSeoData({ ...seoData, title: e.target.value })} 
                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600" 
                     maxLength={70} 
                     placeholder="Siteniz için çekici bir başlık" 
                   />
                   <small className="text-gray-500">
                     Önerilen: 50-60 karakter. Kalan: {70 - seoData.title.length}
                   </small>
                 </div>

                 {/* Meta Description */}
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-3">
                     Meta Description (Sayfa Açıklaması)
                   </label>
                   <textarea 
                     value={seoData.description} 
                     onChange={(e) => setSeoData({ ...seoData, description: e.target.value })} 
                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 h-24 resize-none" 
                     maxLength={160} 
                     placeholder="Sayfanızın kısa ve etkileyici açıklaması" 
                   />
                   <small className="text-gray-500">
                     Önerilen: 150-160 karakter. Kalan: {160 - seoData.description.length}
                   </small>
                 </div>

                 {/* Meta Keywords */}
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-3">
                     Meta Keywords (Anahtar Kelimeler, virgülle ayırın)
                   </label>
                   <input 
                     type="text" 
                     value={seoData.meta_keywords} 
                     onChange={(e) => setSeoData({ ...seoData, meta_keywords: e.target.value })} 
                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600" 
                     placeholder="örnek, anahtar, kelimeler" 
                   />
                   <small className="text-gray-500">
                     Google artık keywords'e çok önem vermese de ekleyebilirsiniz.
                   </small>
                 </div>

                 {/* Açıklama */}
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-3">
                     Açıklama (Dashboard için not)
                   </label>
                   <textarea 
                     value={seoData.aciklama} 
                     onChange={(e) => setSeoData({ ...seoData, aciklama: e.target.value })} 
                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 h-20 resize-none" 
                     placeholder="Bu ayarın ne işe yaradığına dair not (ör: Anasayfa SEO)" 
                   />
                 </div>
                 
                 {/* SEO Önizleme */}
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Search className="w-5 h-5 text-blue-600" />
                     Google Arama Önizlemesi
                   </h3>
                   <div className="bg-white rounded-lg p-4 shadow-sm">
                     <div className="text-xs text-green-700 mb-1">
                       www.siteniz.com › {seoData.sayfa_tipi}
                     </div>
                     <div className="text-blue-600 text-xl font-normal mb-1 hover:underline cursor-pointer">
                       {seoData.title || 'Sayfa Başlığı Buraya Gelecek'}
                     </div>
                     <div className="text-sm text-gray-600">
                       {seoData.description || 'Meta description buraya gelecek. Kullanıcılar bu açıklamayı Google arama sonuçlarında görecekler.'}
                     </div>
                   </div>
                 </div>

                 {/* Kaydet Butonu */}
                 <button 
                   onClick={handleSaveSEO} 
                   disabled={isSaving || !seoData.title.trim()} 
                   className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${isSaving || !seoData.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <Save className="w-5 h-5" />
                   {isSaving ? 'Kaydediliyor...' : (seoData.id ? 'SEO Ayarlarını Güncelle' : 'SEO Ayarlarını Oluştur')}
                 </button>
               </div>
             </div>
           </div>
          )}

          {/* Logo Tab */}
          {activeTab === 'logo' && (
           <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">
               <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                 <Image className="w-8 h-8 text-red-600" />
                 Logo & Favicon Ayarları
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Logo Upload */}
                 <div className="flex flex-col items-center border border-gray-200 rounded-xl p-6">
                   <label className="block text-gray-700 text-lg font-bold mb-4">Logo Yükle</label>
                   {logoPreview && (
                     <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                       <img src={logoPreview} alt="Mevcut Logo" className="max-h-24 mx-auto" />
                       <p className="text-xs text-center text-gray-500 mt-2">Mevcut Logo</p>
                     </div>
                   )}
                   <label className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2">
                     <Upload className="w-5 h-5"/>
                     Logo Seç (.jpg, .png, .webp, .svg)
                     <input 
                       type="file" 
                       accept="image/jpeg, image/png, image/webp, image/svg+xml" 
                       onChange={(e) => handleFileChange('logo', e.target.files[0], setLogoPreview)} 
                       className="hidden"
                     />
                   </label>
                   {logoData.logo && (
                     <p className="text-sm text-green-600 mt-2 text-center">
                       Yeni logo seçildi: {logoData.logo.name}
                     </p>
                   )}
                   <small className="text-gray-500 mt-2 text-center">
                     Max 5MB. Önerilen boyut: 200x50px.
                   </small>
                 </div>

                 {/* Favicon Upload */}
                 <div className="flex flex-col items-center border border-gray-200 rounded-xl p-6">
                   <label className="block text-gray-700 text-lg font-bold mb-4">Favicon Yükle</label>
                   {faviconPreview && (
                     <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                       <img src={faviconPreview} alt="Mevcut Favicon" className="w-10 h-10 mx-auto" />
                       <p className="text-xs text-center text-gray-500 mt-2">Mevcut Favicon</p>
                     </div>
                   )}
                   <label className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2">
                     <Upload className="w-5 h-5"/>
                     Favicon Seç (.png, .ico, .svg)
                     <input 
                       type="file" 
                       accept="image/png, image/vnd.microsoft.icon, image/svg+xml, image/x-icon" 
                       onChange={(e) => handleFileChange('favicon', e.target.files[0], setFaviconPreview)} 
                       className="hidden"
                     />
                   </label>
                   {logoData.favicon && (
                     <p className="text-sm text-green-600 mt-2 text-center">
                       Yeni favicon seçildi: {logoData.favicon.name}
                     </p>
                   )}
                   <small className="text-gray-500 mt-2 text-center">
                     Max 5MB. Kare olmalı (örn: 32x32px, 64x64px).
                   </small>
                 </div>
               </div>

               {/* Logo Kaydet Butonu */}
               <button 
                 onClick={handleSaveLogo} 
                 disabled={isSaving || (!logoData.logo && !logoData.favicon)} 
                 className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${isSaving || (!logoData.logo && !logoData.favicon) ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <Save className="w-5 h-5" />
                 {isSaving ? 'Kaydediliyor...' : 'Logo & Favicon Kaydet'}
               </button>
             </div>
           </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;


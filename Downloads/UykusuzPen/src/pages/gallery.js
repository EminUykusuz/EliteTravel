import React, { useState, useEffect, useCallback } from 'react';
import { Grid, List, Filter, ArrowLeft, Phone, Mail, MapPin, Share2, Calendar, Tag, Play } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // <-- 1. Helmet'i import et

// --- DÜZELTME 1: 'process is not defined' Hatasını Düzelt ---
// API_URL'i component dışına, sabit bir değişken olarak al
const API_URL = 'https://localhost:44361';

// Resim URL'ini API adresine göre düzelt (Bunu da dışarı taşıdık)
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
};
// --- DÜZELTME SONU ---

const PVCGallery = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [pvcProjects, setPvcProjects] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 2. SEO state'i eklendi ---
  const [seoData, setSeoData] = useState(null);
  
  // --- Component içindeki API_URL tanımı kaldırıldı ---

  // --- 3. 'slug' yerine 'id' ile çalışacak fonksiyonlar ---
  const getProjectById = useCallback((id) => {
    return pvcProjects.find(p => p.id === parseInt(id));
  }, [pvcProjects]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    // URL'i '/galeri/ID' olarak güncelle
    window.history.pushState({}, '', `/galeri/${project.id}`);
    // Tıklayınca o ID'nin SEO'sunu çek
    fetchSeoData('galeri', project.id);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
    window.history.pushState({}, '', '/galeri');
    // Geri dönünce, 'galeri' (liste) sayfası için SEO'yu yeniden çek
    fetchSeoData('galeri'); 
  };
  // --- BİTİŞ ---

  // SEO Verisini çekmek için ayrı bir fonksiyon
  const fetchSeoData = useCallback(async (sayfaTipi, sayfaId = null) => {
    try {
      const url = sayfaId
        ? `${API_URL}/api/Seo?sayfaTipi=${sayfaTipi}&sayfaId=${sayfaId}`
        : `${API_URL}/api/Seo?sayfaTipi=${sayfaTipi}`;
        
      const seoResponse = await fetch(url);
      // API'nin { success: true, data: ... } döndüğünü varsayıyoruz
      const seoResult = await seoResponse.json();
      if (seoResult.success) {
        setSeoData(seoResult.data);
      }
    } catch (error) {
      console.error('SEO verisi yüklenemedi:', error);
    }
  }, []); // API_URL bağımlılıktan kaldırıldı

  // API'den ana verileri çek (İlk yüklenme)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [katResponse, galeriResponse] = await Promise.all([
          fetch(`${API_URL}/api/kategoriler`), // Kategori API'n olduğunu varsayıyorum
          fetch(`${API_URL}/api/galeri`)
        ]);

        const katData = await katResponse.json();
        const galeriData = await galeriResponse.json();

        if (katData.success) setKategoriler(katData.data);
        if (galeriData.success) setPvcProjects(galeriData.data);
        
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // API_URL bağımlılıktan kaldırıldı

  // URL'den ID'yi çek (pvcProjects yüklendiğinde)
  useEffect(() => {
    if (pvcProjects.length === 0) return; // Projeler daha yüklenmediyse bekle

    const path = window.location.pathname;
    const match = path.match(/\/galeri\/(\d+)/); // URL'den ID'yi (/12) yakala
    
    if (match && match[1]) {
      // Detay sayfası
      const id = match[1];
      const project = getProjectById(id);
      if (project) {
        setSelectedProject(project);
        fetchSeoData('galeri', id); // Detay sayfası SEO'sunu çek
      }
    } else {
      // Liste sayfası
      fetchSeoData('galeri'); // Liste sayfası SEO'sunu çek
    }
  }, [pvcProjects, getProjectById, fetchSeoData]); // Bağımlılıklar güncellendi

  // Kategori değiştiğinde filtreleme
  useEffect(() => {
    // Kategori değiştiğinde API'den filtreli veri çekme (bu kısım sende zaten vardı)
    const filterUrl = selectedCategory === 'all'
      ? `${API_URL}/api/galeri`
      : `${API_URL}/api/galeri?kategori=${selectedCategory}`; // API'nin bu filtreyi desteklediğini varsayıyorum

    fetch(filterUrl)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPvcProjects(data.data);
      })
      .catch(err => console.error('Filtreleme hatası:', err));

  }, [selectedCategory]); // API_URL bağımlılıktan kaldırıldı

  // ... (categories, filteredProjects, loading JSX aynı kalıyor) ...
  const categories = [
    { id: 'all', name: 'Tüm Projeler', count: pvcProjects.length },
    ...kategoriler
      .map(kat => ({
        id: kat.slug, // Kategori filtresi slug ile çalışabilir, sorun yok
        name: kat.kategoriAdi,
        count: pvcProjects.filter(p => p.kategori?.slug === kat.slug).length
      }))
      .filter(k => k.count > 0)
  ];
 
  const filteredProjects = selectedCategory === 'all'
    ? pvcProjects
    : pvcProjects.filter(project => project.kategori?.slug === selectedCategory);
 
  const ProjectCard = ({ project, index }) => (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
      onClick={() => handleProjectClick(project)}
      style={{
        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(project.medyaTipi === 'video' ? project.kapakResmi : project.medyaYolu)}
          alt={project.altText || project.baslik}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full flex items-center gap-2">
              {project.medyaTipi === 'video' && <Play className="w-4 h-4 text-red-600" />}
              <span className="text-sm font-medium text-gray-700">Detayları Gör</span>
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          {project.medyaTipi === 'video' ? '🎥 Video' : '📷 Fotoğraf'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
          {project.baslik}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {project.aciklama || 'Detaylı bilgi için tıklayın'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
            {project.kategori?.kategoriAdi || 'Genel'}
          </span>
          {project.il && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.il}
            </span>
          )}
        </div>
      </div>
    </div>
  );
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  // DETAY SAYFASI
  if (selectedProject) {
    return (
      <>
        {/* --- 4. DETAY SAYFASI İÇİN HELMET --- */}
        {seoData && (
          <Helmet>
            <title>{seoData.title || selectedProject.baslik}</title>
            <meta name="description" content={seoData.metaDescription || selectedProject.aciklama} />
            <meta name="keywords" content={seoData.metaKeywords || selectedProject.kategori?.kategoriAdi} />
          </Helmet>
        )}
        {/* --- HELMET SONU --- */}
      
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
          <style>{`
             @keyframes fadeIn {
               from { opacity: 0; }
               to { opacity: 1; }
             }
             @keyframes slideDown {
               from { transform: translateY(-20px); opacity: 0; }
               to { transform: translateY(0); opacity: 1; }
             }
             @keyframes slideInLeft {
               from { transform: translateX(-50px); opacity: 0; }
               to { transform: translateX(0); opacity: 1; }
             }
             @keyframes slideInRight {
               from { transform: translateX(50px); opacity: 0; }
               to { transform: translateX(0); opacity: 1; }
             }
             @keyframes slideUp {
               from { transform: translateY(30px); opacity: 0; }
               to { transform: translateY(0); opacity: 1; }
             }
             @keyframes fadeInUp {
               from { opacity: 0; transform: translateY(20px); }
               to { opacity: 1; transform: translateY(0); }
             }
          `}</style>

          {/* Header - Navbar altında kalacak şekilde */}
          <div
            className="bg-white shadow-sm border-b border-gray-200"
            style={{ animation: 'slideDown 0.3s ease-out' }}
          >
            <div className="container mx-auto px-4 md:px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackClick}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 hover:border-red-600 group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:text-red-600 transition-colors" />
                  </button>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">
                      {selectedProject.baslik}
                    </h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      {selectedProject.kategori && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {selectedProject.kategori.kategoriAdi}
                        </span>
                      )}
                      {selectedProject.il && selectedProject.ilce && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedProject.il}, {selectedProject.ilce}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedProject.baslik,
                        text: selectedProject.aciklama || 'PVC Proje Detayı',
                        url: window.location.href
                      });
                    }
                  }}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95 border border-gray-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Paylaş</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sol Taraf - Medya */}
              <div
                className="lg:col-span-2 space-y-6"
                style={{ animation: 'slideInLeft 0.4s ease-out 0.2s both' }}
              >
                {/* Ana Medya */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  {selectedProject.medyaTipi?.toLowerCase() === 'video' ? (
                    <div className="relative bg-black">
                      <video
                        controls
                        playsInline
                        className="w-full aspect-video"
                        poster={getImageUrl(selectedProject.kapakResmi)}
                        preload="metadata"
                      >
                        <source src={getImageUrl(selectedProject.medyaYolu)} type="video/mp4" />
                        Tarayıcınız video oynatmayı desteklemiyor.
                      </video>
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(selectedProject.medyaYolu)}
                      alt={selectedProject.altText || selectedProject.baslik}
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  )}
                </div>

                {/* Açıklama */}
                {selectedProject.aciklama && (
                  <div
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                    style={{ animation: 'slideUp 0.4s ease-out 0.3s both' }}
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                      Proje Hakkında
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedProject.aciklama}
                    </p>
                  </div>
                )}

                {/* Özellikler */}
                <div
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
                  style={{ animation: 'slideUp 0.4s ease-out 0.4s both' }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">✨ Proje Özellikleri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-xs text-gray-500 mb-1">Kategori</div>
                      <div className="font-semibold text-gray-800">
                        {selectedProject.kategori?.kategoriAdi || 'Genel'}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl mb-2">📍</div>
                      <div className="text-xs text-gray-500 mb-1">Konum</div>
                      <div className="font-semibold text-gray-800">
                        {selectedProject.il || 'Belirtilmemiş'}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl mb-2">🎬</div>
                      <div className="text-xs text-gray-500 mb-1">Medya Tipi</div>
                      <div className="font-semibold text-gray-800">
                        {selectedProject.medyaTipi === 'video' ? 'Video' : 'Fotoğraf'}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl mb-2">⭐</div>
                      <div className="text-xs text-gray-500 mb-1">Durum</div>
                      <div className="font-semibold text-green-600">Tamamlandı</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - İletişim */}
              <div className="space-y-6">
                {/* İletişim Kartı */}
                <div
                  className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white"
                  style={{ animation: 'slideInRight 0.4s ease-out 0.3s both' }}
                >
                  <h2 className="text-2xl font-bold mb-2">Benzer Bir Proje İster misiniz?</h2>
                  <p className="text-red-100 mb-6 text-sm">
                    Uzman ekibimizle iletişime geçin, size özel çözümler sunalım.
                  </p>

                  <div className="space-y-3 mb-6">
                    <a
                      href="tel:05524731481"
                      className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all hover:translate-x-1 backdrop-blur-sm"
                    >
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-red-100">Hemen Ara</div>
                        <div className="font-semibold">0552 473 14 81</div>
                      </div>
                    </a>

                    <a
                      href="mailto:uykusuzpen@hotmail.com"
                      className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all hover:translate-x-1 backdrop-blur-sm"
                    >
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-red-100">E-posta Gönder</div>
                        <div className="font-semibold text-sm">uykusuzpen@hotmail.com</div>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-red-100">Adres</div>
                        <div className="font-semibold">Kaynaşlı, Düzce</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = '/iletisim'}
                    className="block w-full bg-white text-red-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 text-center shadow-lg"
                  >
                    Ücretsiz Teklif Al
                  </button>
                </div>

                {/* Bilgi Kartı */}
                <div
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                  style={{ animation: 'slideInRight 0.4s ease-out 0.4s both' }}
                >
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    Neden Bizi Tercih Etmelisiniz?
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">15+ yıllık tecrübe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">Kaliteli malzeme garantisi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">Uzman montaj ekibi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">Zamanında teslimat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">Satış sonrası destek</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benzer Projeler */}
            <div
              className="mt-12"
              style={{ animation: 'fadeIn 0.4s ease-out 0.6s both' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Benzer Projeler</h2>
                <button
                  onClick={handleBackClick}
                  className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
                >
                  Tümünü Gör →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pvcProjects
                  .filter(p => p.id !== selectedProject.id && p.kategori?.slug === selectedProject.kategori?.slug)
                  .slice(0, 3)
                  .map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
              </div>
              {pvcProjects.filter(p => p.id !== selectedProject.id && p.kategori?.slug === selectedProject.kategori?.slug).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Bu kategoride başka proje bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ANA SAYFA - GALERİ LİSTESİ
  return (
    <>
      {/* --- 5. LİSTE SAYFASI İÇİN HELMET --- */}
      {seoData && (
        <Helmet>
          <title>{seoData.title || 'Galeri | Projelerimiz'}</title>
          <meta name="description" content={seoData.metaDescription || 'Tamamladığımız kaliteli projelerimizi keşfedin'} />
          <meta name="keywords" content={seoData.metaKeywords || 'pvc, galeri, cam balkon, projeler'} />
        </Helmet>
      )}
      {/* --- HELMET SONU --- */}

      <div className="min-h-screen ">
        <style>{`
           @keyframes fadeInUp {
             from { opacity: 0; transform: translateY(20px); }
             to { opacity: 1; transform: translateY(0); }
           }
           @keyframes fadeIn {
             from { opacity: 0; }
             to { opacity: 1; }
           }
        `}</style>

        {/* Hero Section */}
        <div
          className="w-full h-full pt-48 pb-20 flex flex-col items-center text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(249,250,251,0.6), rgba(249,250,251,0.6)), url('https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-red-700">
            Galeri
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mt-3">
            Tamamladığımız kaliteli projelerimizi keşfedin
          </p>
        </div>
        {/* Filters Header */}
        <header className="bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all hover:scale-105 active:scale-95 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all hover:scale-105 active:scale-95 ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{filteredProjects.length}</span> proje görüntüleniyor
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside
              className="w-full md:w-64 flex-shrink-0"
              style={{ animation: 'fadeInUp 0.4s ease-out 0.2s both' }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-red-600" />
                  <h2 className="font-bold text-gray-800">Kategoriler</h2>
                </div>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all hover:translate-x-1 active:scale-98 flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                      style={{ animation: `fadeInUp 0.3s ease-out ${0.3 + index * 0.05}s both` }}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main
              className="flex-1"
              style={{ animation: 'fadeIn 0.4s ease-out 0.3s both' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {categories.find(c => c.id === selectedCategory)?.name || 'Tüm Projelerimiz'}
                  </h2>
                  <p className="text-gray-600">{filteredProjects.length} proje</p>
                </div>
              </div>

              <div
                key={selectedCategory}
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Bu kategoride proje bulunamadı</h3>
                  <p className="text-gray-600">Başka bir kategori seçmeyi deneyin</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default PVCGallery;


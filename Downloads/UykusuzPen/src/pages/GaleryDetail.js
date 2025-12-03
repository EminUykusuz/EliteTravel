import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Share2, Calendar, Tag, Play, ExternalLink, Star } from 'lucide-react';

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL'den slug parametresini al (gerçek uygulamada react-router kullanılır)
  const projectSlug = 'ornek-proje'; // Bu dinamik olmalı

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Slug ile projeyi çek
        const response = await fetch(`https://localhost:44361/api/galeri/slug/${projectSlug}`);
        const data = await response.json();

        if (data.success) {
          setProject(data.data);
          
          // Benzer projeleri çek (aynı kategori)
          if (data.data.kategori?.slug) {
            const similarResponse = await fetch(`https://localhost:44361/api/galeri?kategori=${data.data.kategori.slug}`);
            const similarData = await similarResponse.json();
            
            if (similarData.success) {
              // Mevcut projeyi hariç tut
              setSimilarProjects(similarData.data.filter(p => p.id !== data.data.id).slice(0, 3));
            }
          }
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectSlug]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `https://localhost:44361${path}`;
    return `https://localhost:44361/${path}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.baslik,
        text: project.aciklama || 'PVC Proje Detayı',
        url: window.location.href
      });
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız proje mevcut değil.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      {/* Header */}
      <header
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95"
        style={{ animation: 'slideDown 0.3s ease-out' }}
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 hover:border-red-600 group flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 group-hover:text-red-600 transition-colors" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                  {project.baslik}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                  {project.kategori && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{project.kategori.kategoriAdi}</span>
                    </span>
                  )}
                  {project.il && project.ilce && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{project.il}, {project.ilce}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95 border border-gray-200 flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Paylaş</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Medya & İçerik */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{ animation: 'slideInLeft 0.4s ease-out 0.2s both' }}
          >
            {/* Ana Medya */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {project.medyaTipi?.toLowerCase() === 'video' ? (
                <div className="relative bg-black">
                  <video
                    controls
                    playsInline
                    className="w-full aspect-video"
                    poster={getImageUrl(project.kapakResmi)}
                    preload="metadata"
                  >
                    <source src={getImageUrl(project.medyaYolu)} type="video/mp4" />
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                </div>
              ) : (
                <img
                  src={getImageUrl(project.medyaYolu)}
                  alt={project.altText || project.baslik}
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}
            </div>

            {/* Proje Hakkında */}
            {project.aciklama && (
              <div
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                style={{ animation: 'slideUp 0.4s ease-out 0.3s both' }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                  Proje Hakkında
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.aciklama}
                </p>
              </div>
            )}

            {/* Proje Özellikleri */}
            <div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
              style={{ animation: 'slideUp 0.4s ease-out 0.4s both' }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Proje Özellikleri
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-xs text-gray-500 mb-1">Kategori</div>
                  <div className="font-semibold text-gray-800">
                    {project.kategori?.kategoriAdi || 'Genel'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">📍</div>
                  <div className="text-xs text-gray-500 mb-1">Konum</div>
                  <div className="font-semibold text-gray-800">
                    {project.il || 'Belirtilmemiş'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="text-xs text-gray-500 mb-1">Medya Tipi</div>
                  <div className="font-semibold text-gray-800">
                    {project.medyaTipi === 'video' ? 'Video' : 'Fotoğraf'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-xs text-gray-500 mb-1">Durum</div>
                  <div className="font-semibold text-green-600">Tamamlandı</div>
                </div>
              </div>
            </div>

            {/* Teknik Detaylar */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              style={{ animation: 'slideUp 0.4s ease-out 0.5s both' }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Teknik Detaylar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Yüksek Kalite Malzeme</div>
                    <div className="text-sm text-gray-600">Dayanıklı ve uzun ömürlü PVC</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Profesyonel Montaj</div>
                    <div className="text-sm text-gray-600">Uzman ekip tarafından kurulum</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Garanti</div>
                    <div className="text-sm text-gray-600">Kapsamlı garanti süresi</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Müşteri Memnuniyeti</div>
                    <div className="text-sm text-gray-600">%100 müşteri memnuniyeti</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - İletişim & Bilgi */}
          <div className="space-y-6">
            {/* İletişim Kartı */}
            <div
              className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white sticky top-24"
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

            {/* Neden Biz Kartı */}
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
                  <span className="text-gray-700">20+ yıllık tecrübe</span>
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

            {/* Hızlı Bilgi */}
            <div
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
              style={{ animation: 'slideInRight 0.4s ease-out 0.5s both' }}
            >
              <h3 className="font-bold text-gray-800 mb-3">💡 Hızlı Bilgi</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Bu projede kullanılan PVC malzemeler, yüksek dayanıklılık ve uzun ömür sağlar. 
                Profesyonel montaj ekibimiz, işinizi zamanında ve eksiksiz teslim eder.
              </p>
            </div>
          </div>
        </div>

        {/* Benzer Projeler */}
        {similarProjects.length > 0 && (
          <div
            className="mt-12"
            style={{ animation: 'fadeIn 0.4s ease-out 0.6s both' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Benzer Projeler</h2>
              <a
                href="/galeri"
                className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline flex items-center gap-1"
              >
                Tümünü Gör <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProjects.map((proj, index) => (
                <div
                  key={proj.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => window.location.href = `/proje/${proj.id}`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(proj.medyaTipi === 'video' ? proj.kapakResmi : proj.medyaYolu)}
                      alt={proj.altText || proj.baslik}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EResim Yüklenemedi%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {proj.medyaTipi === 'video' && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Video
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                      {proj.baslik}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
                        {proj.kategori?.kategoriAdi || 'Genel'}
                      </span>
                      {proj.il && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {proj.il}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
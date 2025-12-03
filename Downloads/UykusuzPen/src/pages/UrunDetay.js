import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Package,
  Shield,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const product = location.state?.urun;
  const allProducts = location.state?.allProducts;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!product) {
      console.warn("Product state bulunamadı. Sayfa yenilenmiş olabilir.");
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, slug, navigate]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-semibold">Ürün bilgisi yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-2">Veya listeye geri dönün.</p>
        </div>
      </div>
    );
  }

  const images = [
    product.resim, 
    ...(product.digerResimler || [])
  ].filter(Boolean);

  const currentImage = images[selectedImageIndex] || "";
  const hasMultipleImages = images.length > 1;

  const relatedProducts = (allProducts || [])
    .filter(p => p.kategori === product.kategori && p.id !== product.id)
    .slice(0, 3);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const navigateToContact = () => {
    navigate('/iletisim');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Spacing for Navbar */}
      <div className="h-24"></div>

      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack} 
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Geri Dön</span>
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Ürünler</span>
              <span>/</span>
              <span>{product.kategori}</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.ad}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="relative w-full h-[500px] flex items-center justify-center bg-white">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.ad}
                    className="max-w-full max-h-full object-contain p-8"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Package className="w-24 h-24 text-gray-300" />
                    <p className="text-gray-400">Görsel Yükleniyor</p>
                  </div>
                )}

                {hasMultipleImages && ( 
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg p-3 shadow-lg border border-gray-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg p-3 shadow-lg border border-gray-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      idx === selectedImageIndex 
                        ? 'border-red-600' 
                        : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Ürün Özellikleri Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Kategori</p>
                    <p className="font-bold text-gray-900">{product.kategori}</p>
                  </div>
                </div>
              </div>

              

              {product.altKategori && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Alt Kategori</p>
                      <p className="font-bold text-gray-900">{product.altKategori}</p>
                    </div>
                  </div>
                </div>
              )}

              {product.renkler && product.renkler.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700 font-medium">Renk Seçenekleri</p>
                      <p className="font-bold text-gray-900">{product.renkler.length} Renk</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Garantiler ve Özellikler */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Ürün Garantileri
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Kalite Garantisi</p>
                    <p className="text-sm text-gray-600">Yüksek standartlarda üretim ve test edilmiş ürünler</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Uzman Montaj</p>
                    <p className="text-sm text-gray-600">Deneyimli ekibimizle profesyonel kurulum hizmeti</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Satış Sonrası Destek</p>
                    <p className="text-sm text-gray-600">Hafta içi ve cumartesi mesai saatleri içerisinde müşteri hizmeti</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Hızlı Teslimat</p>
                    <p className="text-sm text-gray-600">Zamanında ve güvenli teslimat garantisi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-8">
            {/* Product Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
                  {product.kategori}
                </span>
                {product.altKategori && (
                  <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    {product.altKategori}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.ad}</h1>
              <p className="text-gray-600 leading-relaxed text-lg">{product.aciklama}</p>
            </div>

            {/* Colors */}
            {product.renkler && product.renkler.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Mevcut Renkler</p>
                <div className="flex flex-wrap gap-2">
                  {product.renkler.map((renk, index) => {
                    const renkAdi = renk.RenkAdi || renk.renkAdi || renk.ad || renk.name || renk;
                    return (
                      <span
                        key={renk.Id || index}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                      >
                        {typeof renkAdi === 'string' ? renkAdi : 'Renk ' + (index + 1)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-red-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Ürün Hakkında Bilgi Alın</h3>
              <p className="text-red-50 mb-6">Uzman ekibimizle iletişime geçin, size yardımcı olalım.</p>
               
              <div className="space-y-3 mb-6">
                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-100">Telefon</p>
                    <p className="font-semibold">0552 473 14 81</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-100">E-posta</p>
                    <p className="font-semibold text-sm">uykusuzpen@hotmail.com</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-100">Adres</p>
                    <p className="font-semibold">Kaynaşlı, Düzce</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={navigateToContact}
                className="w-full bg-white text-red-600 px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                İletişime Geç
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Neden Bizi Seçmelisiniz?</h3>
              </div>
               
              <div className="space-y-3">
                {[
                  '15+ yıllık tecrübe',
                  'Kaliteli malzeme garantisi',
                  'Uzman montaj ekibi',
                  'Zamanında teslimat',
                  'Satış sonrası destek'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(`/urunler/${relatedProduct.slug}`, { state: { urun: relatedProduct, allProducts: allProducts } });
                  }}
                >
                  <div className="relative overflow-hidden bg-gray-50 h-48">
                    {relatedProduct.resim ? (
                      <img
                        src={relatedProduct.resim}
                        alt={relatedProduct.ad}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedProduct.ad}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">{relatedProduct.kategori}</p>
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                      İncele
                      <ArrowRight className="w-4 h-4" />
                    </button>
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

export default ProductDetailPage;
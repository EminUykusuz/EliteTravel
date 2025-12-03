import React from 'react';
import { Home, Search, ArrowLeft, Package, AlertCircle } from 'lucide-react';

export default function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center">
          {/* Animated 404 */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-red-200 opacity-20 rounded-full animate-ping"></div>
            <div className="relative">
              <h1 className="text-[180px] sm:text-[220px] font-black bg-gradient-to-r from-red-600 via-red-500 to-blue-900 bg-clip-text text-transparent leading-none animate-pulse">
                404
              </h1>
            </div>
          </div>

          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sayfa Bulunamadı
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
            </p>
            <p className="text-md text-gray-500">
              Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Geri Dön
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Ana Sayfa
            </button>

            <button
              onClick={() => window.location.href = '/urunler'}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Package className="w-5 h-5" />
              Ürünler
            </button>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Aradığınız ürünü buradan arayın..."
                  className="flex-1 py-3 px-2 text-gray-700 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      window.location.href = `/ara?q=${encodeURIComponent(e.target.value)}`;
                    }
                  }}
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  Ara
                </button>
              </div>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
              Popüler Sayfalar
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'PVC Kapılar', url: '/kategori/pvc-kapilar' },
                { name: 'Pencere Sistemleri', url: '/kategori/pencere-sistemleri' },
                { name: 'Cam & Sürgü', url: '/kategori/cam-surgu' },
                { name: 'Hakkımızda', url: '/hakkimizda' },
                { name: 'İletişim', url: '/iletisim' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Sorun devam ederse lütfen{' '}
              <a href="/iletisim" className="text-red-600 hover:text-red-700 font-medium underline">
                bizimle iletişime geçin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
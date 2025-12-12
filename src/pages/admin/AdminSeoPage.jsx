import React, { useState, useEffect } from 'react';

const AdminSeoPage = () => {
  // Aktif olarak hangi sayfanın ayarını yapıyoruz? (Default: Home)
  const [selectedPage, setSelectedPage] = useState('Home');

  // Form Verileri (Normalde burası API'den selectedPage'e göre gelecek)
  // Şimdilik MOCK DATA (Örnek) yapıyoruz
  const [formData, setFormData] = useState({
    title: 'Elite Travel - Hayalinizdeki Tatil',
    description: 'Avrupa turları, kültür turları ve daha fazlası en uygun fiyatlarla.',
    keywords: 'seyahat, tur, tatil, vizesiz turlar',
    ogImage: null 
  });

  // Sayfa değişince (Selectbox değişince) çalışacak simülasyon
  const handlePageChange = (e) => {
    const pageKey = e.target.value;
    setSelectedPage(pageKey);
    // BURADA API İSTEĞİ OLACAK: fetch(`/api/seo/${pageKey}`)
    console.log(`${pageKey} için veriler getiriliyor...`);
    
    // Örnek: Verileri temizleyelim ki değiştiği belli olsun
    setFormData({
        title: pageKey === 'Home' ? 'Anasayfa Başlığı' : (pageKey === 'About' ? 'Hakkımızda Başlığı' : 'İletişim Başlığı'),
        description: '',
        keywords: '',
        ogImage: null
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(`KAYDEDİLİYOR -> Sayfa: ${selectedPage}`, formData);
    alert(`${selectedPage} SEO ayarları güncellendi!`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">⚙️ Genel Site SEO Ayarları</h1>
      <p className="text-gray-500 mb-8">Sabit sayfaların (Anasayfa, İletişim vb.) Google görünümünü buradan yönetin.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SOL TARA F: FORM */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Sayfa Seçimi */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                <label className="block text-sm font-bold text-indigo-900 mb-2">Hangi Sayfayı Düzenliyorsun?</label>
                <select 
                    value={selectedPage} 
                    onChange={handlePageChange}
                    className="w-full p-3 border-2 border-indigo-100 rounded-lg font-bold text-indigo-700 focus:border-indigo-500 outline-none"
                >
                    <option value="Home">🏠 Anasayfa (Home)</option>
                    <option value="About">ℹ️ Hakkımızda (About)</option>
                    <option value="Contact">📞 İletişim (Contact)</option>
                    <option value="Tours">📦 Turlar Listesi (Tours Page)</option>
                </select>
            </div>

            {/* Form Alanları */}
            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title (Başlık)</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        maxLength={60}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="text-right text-xs text-gray-400">{formData.title.length}/60</div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description (Açıklama)</label>
                    <textarea 
                        name="description" 
                        rows="3" 
                        value={formData.description} 
                        onChange={handleChange} 
                        maxLength={160}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                    <div className="text-right text-xs text-gray-400">{formData.description.length}/160</div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords (Virgülle ayırın)</label>
                    <input 
                        type="text" 
                        name="keywords" 
                        value={formData.keywords} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition">
                    💾 Ayarları Kaydet
                </button>
            </form>
        </div>

        {/* SAĞ TARAF: CANLI ÖNİZLEME */}
        <div className="md:col-span-1">
            <div className="sticky top-4">
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">Google Önizleme</h3>
                
                <div className="bg-white p-4 rounded shadow border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">E</div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-800">Elite Travel</span>
                            <span className="text-xs text-slate-500">https://elitetravel.com/{selectedPage === 'Home' ? '' : selectedPage.toLowerCase()}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">
                        {formData.title || "Başlık Yok"}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {formData.description || "Açıklama girilmedi..."}
                    </p>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <p className="font-bold mb-1">💡 İpucu:</p>
                    <p>Anasayfa başlığında mutlaka <b>"Tur Şirketi"</b>, <b>"Elite Travel"</b> gibi marka ve sektör kelimeleri geçmelidir.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSeoPage;
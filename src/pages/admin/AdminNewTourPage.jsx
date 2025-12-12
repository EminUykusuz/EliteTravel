import React, { useState } from 'react';

const AdminNewTourPage = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    // dbo.Tours Tablosu Karşılıkları
    isActive: true,       // IsActive
    price: '',            // Price
    currency: 'EUR',      // Currency
    capacity: '',         // Capacity (SQL'den geldi)
    guideId: '',          // GuideId (SQL'den geldi - Selectbox olacak)
    
    // UI ve İçerik Alanları (JSON verisi)
    title: '',
    slug: '',
    type: '',             
    summary: '',          
    datesText: '',        
    duration: '',         
    departureCity: '',    
    whatsappNumber: '',   
    
    // Görseller
    mainImage: null,      // SQL'deki 'MainImage' -> Kart Resmi (Thumbnail)
    heroImage: null,      // Detay Sayfası Kapak Resmi (Bunu DB'ye eklemen gerekecek!)

    // Diziler
    highlights: [''],     
    itinerary: [          
      { day: 1, title: '', description: '' }
    ],
    
    // dbo.TourExtras Tablosu (Yeni Eklendi)
    extras: [
      { title: '', price: '' } // Title ve Price sütunları
    ]
  });

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  // --- EXTRAS YÖNETİMİ (dbo.TourExtras) ---
  const handleExtraChange = (index, field, value) => {
    const newExtras = [...formData.extras];
    newExtras[index][field] = value;
    setFormData(prev => ({ ...prev, extras: newExtras }));
  };

  const addExtra = () => {
    setFormData(prev => ({ ...prev, extras: [...prev.extras, { title: '', price: '' }] }));
  };

  const removeExtra = (index) => {
    const newExtras = formData.extras.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, extras: newExtras }));
  };

  // --- HIGHLIGHTS YÖNETİMİ ---
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addHighlight = () => setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  const removeHighlight = (index) => setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  // --- ITINERARY YÖNETİMİ ---
  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addDay = () => setFormData(prev => ({ ...prev, itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }] }));
  const removeDay = () => {
    if (formData.itinerary.length > 1) {
      setFormData(prev => ({ ...prev, itinerary: prev.itinerary.slice(0, -1) }));
    }
  };

  // --- SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // SQL'e gidecek yapıyı simüle ediyoruz
    const dbPayload = {
        // dbo.Tours için
        tour: {
            Title: formData.title,
            Price: parseFloat(formData.price),
            Currency: formData.currency,
            Capacity: parseInt(formData.capacity),
            IsActive: formData.isActive,
            GuideId: parseInt(formData.guideId),
            MainImage: formData.mainImage ? formData.mainImage.name : "dosya_yok.jpg",
            // Diğer JSON alanları description veya ayrı sütun olarak gidebilir
            Slug: formData.slug,
            Summary: formData.summary
        },
        // dbo.TourExtras için
        extras: formData.extras.map(ex => ({
            Title: ex.title,
            Price: parseFloat(ex.price)
        }))
    };

    console.log("💾 SQL'e Hazır Veri:", dbPayload);
    console.log("Ham Form Data:", formData);
    alert('Veriler loglandı! F12 Console sekmesine bak.');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">🌍 Yeni Tur Ekle (SQL Mode)</h1>
        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border border-green-200">
           <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
           <label className="text-green-800 font-semibold text-sm">Aktif (IsActive)</label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BÖLÜM 1: TEMEL BİLGİLER & SQL ZORUNLU ALANLAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-indigo-700 mb-4 border-b pb-2">📌 Genel & Kapasite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="col-span-2">
               <label className="label">Tur Başlığı (Title)</label>
               <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Tur adı..." required />
            </div>

            {/* SQL: Capacity */}
            <div>
               <label className="label text-red-600">Kapasite (Capacity) *</label>
               <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input" placeholder="Örn: 45" required />
            </div>

            {/* SQL: GuideId (Normalde API'den rehber listesi gelir) */}
            <div>
               <label className="label text-red-600">Rehber Seç (GuideId) *</label>
               <select name="guideId" value={formData.guideId} onChange={handleChange} className="input" required>
                 <option value="">Rehber Seçiniz...</option>
                 <option value="1">Ahmet Anapalı (ID: 1)</option>
                 <option value="2">Talha Uğurluel (ID: 2)</option>
                 <option value="3">Diğer Rehber (ID: 3)</option>
               </select>
            </div>

            <div>
               <label className="label">URL (Slug)</label>
               <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input" placeholder="tur-url-yolu" />
            </div>

            <div>
               <label className="label">Tur Tipi</label>
               <input type="text" name="type" value={formData.type} onChange={handleChange} className="input" placeholder="Kültür Turu" />
            </div>
          </div>
        </div>

        {/* BÖLÜM 2: FİYAT & TARİH */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-indigo-700 mb-4 border-b pb-2">📅 Fiyat ve Tarih</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
               <label className="label">Fiyat (Price)</label>
               <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" placeholder="0.00" />
            </div>
            <div>
               <label className="label">Para Birimi</label>
               <select name="currency" value={formData.currency} onChange={handleChange} className="input">
                 <option value="EUR">€ EUR</option>
                 <option value="USD">$ USD</option>
                 <option value="TRY">₺ TRY</option>
               </select>
            </div>
            <div>
               <label className="label">Whatsapp No</label>
               <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="input" />
            </div>
            <div className="col-span-1">
               <label className="label">Tarih Metni</label>
               <input type="text" name="datesText" value={formData.datesText} onChange={handleChange} className="input" placeholder="21-25 Kasım" />
            </div>
             <div className="col-span-1">
               <label className="label">Süre</label>
               <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="input" placeholder="3 Gün 2 Gece" />
            </div>
             <div className="col-span-1">
               <label className="label">Kalkış Şehri</label>
               <input type="text" name="departureCity" value={formData.departureCity} onChange={handleChange} className="input" placeholder="İstanbul" />
            </div>
          </div>
        </div>

        {/* BÖLÜM 3: MEDYA (MainImage + HeroImage) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-indigo-700 mb-4 border-b pb-2">📸 Medya Yönetimi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MainImage -> Card */}
            <div className="file-box">
               <span className="text-3xl block mb-2">🖼️</span>
               <label className="font-bold text-slate-600 block">Main Image (Liste Resmi)</label>
               <p className="text-xs text-slate-400 mb-3">DB: MainImage sütunu</p>
               <input type="file" name="mainImage" onChange={handleChange} className="file-input"/>
            </div>
            {/* HeroImage -> Detay */}
            <div className="file-box">
               <span className="text-3xl block mb-2">🌟</span>
               <label className="font-bold text-slate-600 block">Hero Image (Kapak Resmi)</label>
               <p className="text-xs text-slate-400 mb-3">DB: Yeni sütun açılmalı veya ayrı kaydedilmeli</p>
               <input type="file" name="heroImage" onChange={handleChange} className="file-input"/>
            </div>
          </div>
        </div>

        {/* BÖLÜM 4: TUR EXTRAS (dbo.TourExtras) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 ring-1 ring-red-100">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
             <h2 className="text-lg font-bold text-red-600">🎁 Ekstra Hizmetler (dbo.TourExtras)</h2>
             <button type="button" onClick={addExtra} className="btn-small bg-red-100 text-red-700 hover:bg-red-200">
                + Ekstra Ekle
             </button>
           </div>
           <div className="space-y-3">
              {formData.extras.map((extra, index) => (
                <div key={index} className="flex gap-4 items-end">
                   <div className="flex-1">
                      <label className="text-xs text-gray-500">Hizmet Adı (Title)</label>
                      <input 
                        type="text" 
                        value={extra.title} 
                        onChange={(e) => handleExtraChange(index, 'title', e.target.value)}
                        className="input" 
                        placeholder="Örn: Vize Ücreti"
                      />
                   </div>
                   <div className="w-32">
                      <label className="text-xs text-gray-500">Fiyat (Price)</label>
                      <input 
                        type="number" 
                        value={extra.price} 
                        onChange={(e) => handleExtraChange(index, 'price', e.target.value)}
                        className="input" 
                        placeholder="0.00"
                      />
                   </div>
                   <button type="button" onClick={() => removeExtra(index)} className="text-red-500 font-bold px-2 py-3 hover:bg-red-50 rounded">🗑️</button>
                </div>
              ))}
           </div>
        </div>

        {/* BÖLÜM 5: ITINERARY (PROGRAM) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
             <h2 className="text-lg font-bold text-indigo-700">🗺️ Günlük Program</h2>
             <button type="button" onClick={addDay} className="btn-small bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                + Gün Ekle
             </button>
           </div>
           <div className="space-y-6">
             {formData.itinerary.map((item, index) => (
               <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded border border-slate-200 relative">
                  <div className="w-10 h-10 flex-shrink-0 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">
                    {item.day}
                  </div>
                  <div className="flex-1 space-y-2">
                     <input type="text" value={item.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} className="input font-bold" placeholder="Gün Başlığı" />
                     <textarea rows="2" value={item.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} className="input text-sm" placeholder="Açıklama..."></textarea>
                  </div>
                  {index > 0 && <button type="button" onClick={removeDay} className="absolute top-2 right-2 text-red-400">🗑️</button>}
               </div>
             ))}
           </div>
        </div>

        {/* BÖLÜM 6: HIGHLIGHTS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
             <h2 className="text-lg font-bold text-indigo-700">✨ Öne Çıkanlar</h2>
             <button type="button" onClick={addHighlight} className="btn-small bg-indigo-100 text-indigo-700 hover:bg-indigo-200">+ Madde Ekle</button>
           </div>
           <div className="space-y-2">
              {formData.highlights.map((item, index) => (
                <div key={index} className="flex gap-2">
                   <input type="text" value={item} onChange={(e) => handleHighlightChange(index, e.target.value)} className="input" placeholder="Örn: Ayasofya Ziyareti" />
                   <button type="button" onClick={() => removeHighlight(index)} className="text-red-500 font-bold px-2">✖</button>
                </div>
              ))}
           </div>
        </div>

        {/* KAYDET */}
        <div className="sticky bottom-5 z-20">
            <button type="submit" className="w-full py-4 bg-slate-900 text-white text-xl font-bold rounded-xl shadow-xl hover:bg-slate-800 transition">
                💾 DB'YE KAYDET
            </button>
        </div>

      </form>
    </div>
  );
};

// Styles
const input = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition";
const label = "block text-sm font-semibold text-gray-700 mb-1";
const fileBox = "p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-slate-50 transition text-center cursor-pointer";
const fileInput = "w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700";
const btnSmall = "text-sm px-3 py-1 rounded font-bold transition";

export default AdminNewTourPage;
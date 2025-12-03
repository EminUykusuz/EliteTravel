import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Package, ArrowRight, Eye, X, ChevronDown, Grid3x3, List, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:44361";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedAltKategori, setSelectedAltKategori] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid veya list
  const [sortBy, setSortBy] = useState(""); // name-asc, name-desc

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resUrunler, resKategoriler] = await Promise.all([
        fetch(`${API_BASE_URL}/api/urunler`),
        fetch(`${API_BASE_URL}/api/kategoriler`)
      ]);

      const dataUrunler = await resUrunler.json();
      const dataKategoriler = await resKategoriler.json();

      if (dataUrunler.success) {
        const mapped = dataUrunler.data.map((u) => ({
          id: u.id,
          ad: u.urunAdi,
          aciklama: u.aciklama,
          kategori: u.kategori?.kategoriAdi || "Genel",
          kategoriId: u.kategori?.id,
          altKategori: u.altKategori?.altKategoriAdi || "",
          altKategoriId: u.altKategori?.id,
          slug: u.slug || u.Slug || `urun-${u.id}`,
          resim:
            u.anaResim ||
            u.urunResimleri?.[0]?.resimYolu ||
            "/no-image.jpg",
          digerResimler: (u.urunResimleri || []).map(r => r.resimYolu),
          renkler: u.renkler || []
        }));
        console.log("Mapped ürünler (ilk 2):", mapped.slice(0, 2));
        setUrunler(mapped);
      }

      if (dataKategoriler.success) {
        // Ana kategorileri ve alt kategorileri ayır
        const tumKategoriler = dataKategoriler.data;
        
        // Sadece ana kategorileri al (ustKategoriId null veya undefined olanlar)
        const anaKategoriler = tumKategoriler.filter(k => !k.ustKategoriId);
        
        // Her ana kategoriye alt kategorilerini ekle
        const kategoriAgaci = anaKategoriler.map(anaKat => ({
          ...anaKat,
          altKategoriler: tumKategoriler.filter(k => k.ustKategoriId === anaKat.id)
        }));
        
        console.log("Kategori Ağacı:", kategoriAgaci);
        setKategoriler(kategoriAgaci);
      }
    } catch (err) {
      setError("Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Seçili kategoriye ait alt kategorileri bul
  const activeKategori = kategoriler.find(k => k.id === parseInt(selectedKategori));
  const altKategoriler = activeKategori?.altKategoriler || [];

  console.log("Seçili Kategori ID:", selectedKategori);
  console.log("Bulunan Kategori:", activeKategori);
  console.log("Alt Kategoriler:", altKategoriler);

  // Filtreleme ve sıralama - useMemo ile optimize
  const filtered = useMemo(() => {
    let result = urunler.filter((p) => {
      const matchSearch = 
        p.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.altKategori.toLowerCase().includes(searchTerm.toLowerCase());

      // Kategori filtresi - Seçili kategori VE onun alt kategorilerindeki ürünleri göster
      let matchKategori = !selectedKategori;
      if (selectedKategori) {
        const secilenKatId = parseInt(selectedKategori);
        // Seçilen kategorinin kendisi mi, yoksa seçilen kategorinin alt kategorilerinden biri mi?
        const secilenKategori = kategoriler.find(k => k.id === secilenKatId);
        const altKatIds = secilenKategori?.altKategoriler?.map(ak => ak.id) || [];
        
        // Ürün ya seçilen kategoride ya da onun alt kategorilerinden birinde
        matchKategori = p.kategoriId === secilenKatId || altKatIds.includes(p.kategoriId);
      }

      // Alt kategori filtresi - Sadece alt kategori seçiliyse
      const matchAltKategori = !selectedAltKategori || p.kategoriId === parseInt(selectedAltKategori);

      return matchSearch && matchKategori && matchAltKategori;
    });

    // Sıralama
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.ad.localeCompare(a.ad, 'tr'));
    }

    return result;
  }, [urunler, searchTerm, selectedKategori, selectedAltKategori, sortBy, kategoriler]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedKategori("");
    setSelectedAltKategori("");
    setSortBy("");
  };

  const hasActiveFilters = searchTerm || selectedKategori || selectedAltKategori || sortBy;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Ürünler yükleniyor...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="text-center">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );

  return (
    <motion.div
      key="product-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50"
    >
      {/* Hero Başlık */}
      <div
        className="w-full h-full pt-48 pb-20 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(249,250,251,0.7), rgba(249,250,251,0.7)), url('https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-red-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-red-700">
              Ürünlerimiz
            </h1>
            <Sparkles className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl md:text-2xl text-gray-800 mt-3 font-light">
            En kaliteli ürünleri keşfedin
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-12">
        {/* Filtre Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl mb-6 border border-gray-100 overflow-hidden"
        >
          {/* Filtre Başlığı */}
          <div 
            className="p-5 cursor-pointer flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-red-600" />
              <span className="text-lg font-semibold text-gray-800">
                Filtreler & Sıralama
              </span>
              {hasActiveFilters && (
                <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {Object.entries({searchTerm, selectedKategori, selectedAltKategori, sortBy}).filter(([_, v]) => v).length} Aktif
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </motion.div>
          </div>

          {/* Filtre İçeriği */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100 overflow-hidden"
              >
                <div className="p-6 space-y-5">
              {/* Arama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ürün Ara
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ürün adı, kategori veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full transition-shadow hover:border-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Kategori Seçimi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedKategori}
                    onChange={(e) => {
                      console.log("Kategori seçildi:", e.target.value);
                      setSelectedKategori(e.target.value);
                      setSelectedAltKategori("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-shadow hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {kategoriler.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.kategoriAdi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alt Kategori Seçimi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alt Kategori {!selectedKategori && <span className="text-xs text-gray-400">(Önce kategori seçin)</span>}
                  </label>
                  <select
                    key={`alt-${selectedKategori}`}
                    value={selectedAltKategori}
                    onChange={(e) => {
                      console.log("Alt kategori seçildi:", e.target.value);
                      setSelectedAltKategori(e.target.value);
                    }}
                    disabled={!selectedKategori || altKategoriler.length === 0}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow text-gray-700 ${
                      !selectedKategori || altKategoriler.length === 0
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'bg-white hover:border-gray-400 cursor-pointer'
                    }`}
                  >
                    <option value="" className="text-gray-700">
                      {!selectedKategori 
                        ? "Önce kategori seçin" 
                        : altKategoriler.length === 0 
                        ? "Alt kategori yok" 
                        : "Tüm Alt Kategoriler"}
                    </option>
                    {selectedKategori && altKategoriler.map((alt) => {
                      console.log("Alt kategori render:", alt.kategoriAdi);
                      return (
                        <option 
                          key={alt.id} 
                          value={alt.id}
                          className="text-gray-700 bg-white"
                        >
                          {alt.kategoriAdi}
                        </option>
                      );
                    })}
                  </select>
                  {selectedKategori && altKategoriler.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {altKategoriler.length} alt kategori mevcut: {altKategoriler.map(a => a.kategoriAdi).join(", ")}
                    </p>
                  )}
                </div>

                {/* Sıralama */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition-shadow hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Varsayılan</option>
                    <option value="name-asc">İsim (A-Z)</option>
                    <option value="name-desc">İsim (Z-A)</option>
                  </select>
                </div>
              </div>

              {/* Temizle Butonu */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow"
                >
                  <X className="w-4 h-4" />
                  Tüm Filtreleri Temizle
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

        {/* Sonuç Sayısı ve Görünüm Değiştirici */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="text-sm text-gray-600">
            <span className="font-bold text-lg text-red-600">{filtered.length}</span> 
            <span className="ml-1">ürün bulundu</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Görünüm:</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" 
                  ? "bg-red-600 text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" 
                  ? "bg-red-600 text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Ürünler */}
        <motion.div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filtered.length > 0 ? (
            filtered.map((urun, index) => (
              viewMode === "grid" ? (
                // Grid Görünüm
                <motion.div
                  key={urun.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div 
                    onClick={() => {
                      console.log("Grid - Tıklanan ürün:", urun.ad, "Slug:", urun.slug);
                      navigate(`/urunler/${urun.slug}`, { state: { urun, allProducts: urunler } });
                    }}
                    className="relative overflow-hidden bg-gray-50"
                  >
                    {urun.resim ? (
                      <img
                        src={urun.resim}
                        alt={urun.ad}
                        className="w-full h-52 object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                        <Package className="w-14 h-14 text-gray-300" />
                      </div>
                    )}
                    {urun.altKategori && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                        {urun.altKategori}
                      </div>
                    )}
                  </div>
                  <div 
                    onClick={() => {
                      console.log("Grid - İçerik tıklanan ürün:", urun.ad, "Slug:", urun.slug);
                      navigate(`/urunler/${urun.slug}`, { state: { urun, allProducts: urunler } });
                    }}
                    className="p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                        {urun.kategori}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                      {urun.ad}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {urun.aciklama}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Detayları Gör
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Grid - Buton tıklanan ürün:", urun.ad, "Slug:", urun.slug);
                          navigate(`/urunler/${urun.slug}`, { state: { urun, allProducts: urunler } });
                        }}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        İncele <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Liste Görünüm
                <motion.div
                  key={urun.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  whileHover={{ x: 5 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div 
                    onClick={() => {
                      console.log("Liste - Tıklanan ürün:", urun.ad, "Slug:", urun.slug);
                      navigate(`/urunler/${urun.slug}`, { state: { urun, allProducts: urunler } });
                    }}
                    className="flex flex-col sm:flex-row"
                  >
                    <div className="relative overflow-hidden bg-gray-50 sm:w-64 flex-shrink-0">
                      {urun.resim ? (
                        <img
                          src={urun.resim}
                          alt={urun.ad}
                          className="w-full h-48 sm:h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-14 h-14 text-gray-300" />
                        </div>
                      )}
                      {urun.altKategori && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                          {urun.altKategori}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                            {urun.kategori}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                          {urun.ad}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {urun.aciklama}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Detaylı İncele
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Liste - Buton tıklanan ürün:", urun.ad, "Slug:", urun.slug);
                            navigate(`/urunler/${urun.slug}`, { state: { urun, allProducts: urunler } });
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                        >
                          Ürünü İncele <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl font-medium mb-2">Hiç ürün bulunamadı</p>
                <p className="text-gray-400 text-sm mb-4">Aradığınız kriterlere uygun ürün bulunmuyor</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-red-600 hover:text-red-700 font-semibold text-sm inline-flex items-center gap-2 hover:underline"
                  >
                    <X className="w-4 h-4" />
                    Filtreleri temizle ve tekrar dene
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
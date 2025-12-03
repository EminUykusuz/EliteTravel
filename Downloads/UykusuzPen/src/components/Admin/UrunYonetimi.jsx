import React, { useEffect, useState } from "react";
// YENİ: Framer Motion eklendi
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, X, Upload, FolderPlus, Package, Palette, Image as ImageIcon } from "lucide-react";
import Swal from 'sweetalert2';

const API_BASE = "https://localhost:44361";

export default function UrunYonetimi() {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [renkler, setRenkler] = useState([]);
  const [tumRenkler, setTumRenkler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [kategoriModalOpen, setKategoriModalOpen] = useState(false);
  const [kategoriYonetimModalOpen, setKategoriYonetimModalOpen] = useState(false);
  const [renkYonetimModalOpen, setRenkYonetimModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [anaResimPreview, setAnaResimPreview] = useState("");
  const [digerResimlerPreview, setDigerResimlerPreview] = useState([]);
  const [yeniKategori, setYeniKategori] = useState("");
  const [ustKategoriId, setUstKategoriId] = useState("");
  const [kategoriTipi, setKategoriTipi] = useState("ana");
  const [yeniRenk, setYeniRenk] = useState("");
  const [renkKategoriId, setRenkKategoriId] = useState("");
  const [formData, setFormData] = useState({
    ad: "",
    aciklama: "",
    kategoriId: "",
    altKategoriId: "",
    anaResimFile: null,
    digerResimFiles: [],
    secilenRenkler: []
  });

    const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  };

  useEffect(() => {
    fetchUrunler();
    fetchKategoriler();
    fetchTumRenkler();
  }, []);

  useEffect(() => {
    const secilenKategori = formData.altKategoriId || formData.kategoriId;
    if (secilenKategori && modalOpen) {
      fetchRenkler(secilenKategori);
    } else {
      setRenkler([]);
    }
  }, [formData.kategoriId, formData.altKategoriId, modalOpen]);
  // BUNU EKLE
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
};

  const fetchUrunler = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/urunler`);
      const data = await res.json();
      if (data.success) {
        const mappedUrunler = data.data.map(u => ({
          id: u.id,
          ad: u.urunAdi,
          aciklama: u.aciklama,
          kategoriId: u.kategoriId,
          kategori: u.kategori?.kategoriAdi || "",
          resim: u.anaResim || "",
          renkler: u.renkler || []
        }));
        setUrunler(mappedUrunler);
      } else {
        setError("Ürünler yüklenemedi.");
      }
    } catch (err) {
      setError("Ürünleri çekerken hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategoriler = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/kategoriler`);
      const data = await res.json();
      if (data.success) {
        setKategoriler(data.data);
      }
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const fetchRenkler = async (kategoriId = null) => {
    try {
      const url = kategoriId 
        ? `${API_BASE}/api/renkler?kategoriId=${kategoriId}`
        : `${API_BASE}/api/renkler`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRenkler(data.data);
      }
    } catch (err) {
      console.error("Renkler yüklenemedi:", err);
    }
  };

  const fetchTumRenkler = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/renkler`);
      const data = await res.json();
      if (data.success) {
        setTumRenkler(data.data);
      }
    } catch (err) {
      console.error("Renkler yüklenemedi:", err);
    }
  };

  const handleAnaResimChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, anaResimFile: file});
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnaResimPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDigerResimlerChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData({...formData, digerResimFiles: [...formData.digerResimFiles, ...files]});
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDigerResimlerPreview(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeDigerResim = (index) => {
    const newFiles = formData.digerResimFiles.filter((_, i) => i !== index);
    const newPreviews = digerResimlerPreview.filter((_, i) => i !== index);
    setFormData({...formData, digerResimFiles: newFiles});
    setDigerResimlerPreview(newPreviews);
  };

  const handleRenkToggle = (renkId) => {
    const secilenRenkler = formData.secilenRenkler.includes(renkId)
      ? formData.secilenRenkler.filter(id => id !== renkId)
      : [...formData.secilenRenkler, renkId];
    setFormData({...formData, secilenRenkler});
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Emin misin?",
      text: "Bu ürünü kalıcı olarak silmek istiyor musun?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Vazgeç"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/urunler/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.success) {
          setUrunler(urunler.filter(u => u.id !== id));
          Swal.fire("Silindi!", "Ürün başarıyla silindi.", "success");
        } else {
          Swal.fire("Hata!", "Ürün silinemedi.", "error");
        }
      } catch (err) {
        Swal.fire("Hata!", "Ürün silinirken bir hata oluştu.", "error");
        console.error(err);
      }
    }
  };

  const handleKategoriSil = async (id) => {
    const result = await Swal.fire({
      title: "Emin misin?",
      text: "Bu kategoriyi silmek istiyor musun?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Vazgeç"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/kategoriler/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.success) {
          Swal.fire("Silindi!", "Kategori başarıyla silindi.", "success");
          fetchKategoriler();
        } else {
          Swal.fire("Hata!", data.message || "Kategori silinemedi.", "error");
        }
      } catch (err) {
        Swal.fire("Hata!", "Kategori silinirken bir hata oluştu.", "error");
        console.error(err);
      }
    }
  };

  const handleRenkSil = async (id) => {
    const result = await Swal.fire({
      title: "Emin misin?",
      text: "Bu rengi silmek istiyor musun?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Vazgeç"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/renkler/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Silindi!", "Renk başarıyla silindi.", "success");
          fetchTumRenkler();
        } else {
          Swal.fire("Hata!", data.message || "Renk silinemedi.", "error");
        }
      } catch (err) {
        Swal.fire("Hata!", "Renk silinirken bir hata oluştu.", "error");
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({ ad: "", aciklama: "", kategoriId: "", altKategoriId: "", anaResimFile: null, digerResimFiles: [], secilenRenkler: [] });
    setAnaResimPreview("");
    setDigerResimlerPreview([]);
    setModalOpen(true);
  };

  const openEditModal = (urun) => {
    setEditMode(true);
    setCurrentProduct(urun);
    
    const urunKategorisi = kategoriler.find(k => k.id === urun.kategoriId);
    const ustKatId = urunKategorisi?.ustKategoriId;
    
    setFormData({
      ad: urun.ad,
      aciklama: urun.aciklama,
      kategoriId: ustKatId ? String(ustKatId) : String(urun.kategoriId),
      altKategoriId: ustKatId ? String(urun.kategoriId) : "",
      anaResimFile: null,
      digerResimFiles: [],
      secilenRenkler: urun.renkler ? urun.renkler.map(r => r.id) : []
    });
    setAnaResimPreview(urun.resim);
    setDigerResimlerPreview([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
    setFormData({ ad: "", aciklama: "", kategoriId: "", altKategoriId: "", anaResimFile: null, digerResimFiles: [], secilenRenkler: [] });
    setAnaResimPreview("");
    setDigerResimlerPreview([]);
  };

  const handleSubmit = async () => {
    if (!formData.ad.trim()) {
      Swal.fire("Uyarı!", "Ürün adı zorunludur!", "warning");
      return;
    }

    if (!formData.kategoriId) {
      Swal.fire("Uyarı!", "Lütfen bir kategori seçin!", "warning");
      return;
    }

    const altKategoriler = kategoriler.filter(k => k.ustKategoriId === parseInt(formData.kategoriId));
    if (altKategoriler.length > 0 && !formData.altKategoriId) {
      Swal.fire("Uyarı!", "Lütfen bir alt kategori seçin!", "warning");
      return;
    }

    if (!editMode && !formData.anaResimFile) {
      Swal.fire("Uyarı!", "Lütfen bir ana resim seçin!", "warning");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("UrunAdi", formData.ad);
      formDataToSend.append("Aciklama", formData.aciklama || "");
      formDataToSend.append("KategoriId", formData.altKategoriId || formData.kategoriId);
      formDataToSend.append("slug", slugify(formData.ad));

      
      if (formData.anaResimFile) {
        formDataToSend.append("AnaResim", formData.anaResimFile);
      }

      if (formData.digerResimFiles && formData.digerResimFiles.length > 0) {
        formData.digerResimFiles.forEach(file => {
          formDataToSend.append("DigerResimler", file);
        });
      }

      if (formData.secilenRenkler.length > 0) {
        formData.secilenRenkler.forEach(renkId => {
          formDataToSend.append("RenkIds", renkId);
        });
      }

      const url = editMode 
        ? `${API_BASE}/api/urunler/${currentProduct.id}`
        : `${API_BASE}/api/urunler`;
      const method = editMode ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const data = await res.json();
      if (data.success || res.ok) {
        Swal.fire({
          icon: "success",
          title: editMode ? "Ürün güncellendi!" : "Ürün eklendi!",
          showConfirmButton: false,
          timer: 1500
        });
        fetchUrunler();
        closeModal();
      } else {
        Swal.fire("Hata!", data.message || "İşlem başarısız oldu!", "error");
        console.error("API Error:", data);
      }
    } catch (err) {
      Swal.fire("Hata!", "İşlem sırasında hata oluştu.", "error");
      console.error("Fetch Error:", err);
    }
  };

  // KANKA BU FONKSİYONU GÜNCELLEDİM
  // Slug hatasını çözmek için kontrolleri sağlamlaştırdım
  const handleKategoriEkle = async () => {
    if (!yeniKategori.trim()) {
      Swal.fire("Uyarı!", "Kategori adı boş olamaz!", "warning");
      return;
    }

    if (kategoriTipi === "alt" && !ustKategoriId) {
      Swal.fire("Uyarı!", "Lütfen bir üst kategori seçin!", "warning");
      return;
    }
    
    const slug = yeniKategori
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // DEĞİŞTİ: Kontrol sağlamlaştırıldı
    if (!slug || slug.trim() === "") {
        Swal.fire("Geçersiz Ad!", "Kategori adı geçerli bir 'slug' oluşturmuyor. Lütfen harf veya rakam kullanın.", "warning");
        return; // Hata varsa burada dur
    }
    
    const payload = { 
      KategoriAdi: yeniKategori,
      // DEĞİŞTİ: Artık 'slug'ın boş gitmediğinden eminiz
      Slug: slug, 
      Aciklama: "",
      UstKategoriId: kategoriTipi === "alt" ? parseInt(ustKategoriId) : null
    };
    
    try {
      const res = await fetch(`${API_BASE}/api/kategoriler`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: kategoriTipi === "ana" ? "Ana kategori eklendi!" : "Alt kategori eklendi!",
          showConfirmButton: false,
          timer: 1500
        });
        await fetchKategoriler();
        setYeniKategori("");
        setUstKategoriId("");
        setKategoriTipi("ana");
        setKategoriModalOpen(false);
      } else {
        Swal.fire("Hata!", data.message || data.title || "Kategori eklenemedi!", "error");
        console.error("API Error:", data);
      }
    } catch (err) {
      Swal.fire("Hata!", "Kategori eklenirken hata oluştu.", "error");
      console.error("Fetch Error:", err);
    }
  };

  const handleRenkEkle = async () => {
    if (!yeniRenk.trim()) {
      Swal.fire("Uyarı!", "Renk adı boş olamaz!", "warning");
      return;
    }

    if (!renkKategoriId) {
      Swal.fire("Uyarı!", "Lütfen bir kategori seçin!", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/renkler`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          RenkAdi: yeniRenk,
          KategoriId: parseInt(renkKategoriId)
        })
      });
      
      const data = await res.json();
      
      if (data.success || res.ok) {
        Swal.fire({
          icon: "success",
          title: "Renk başarıyla eklendi!",
          showConfirmButton: false,
          timer: 1500
        });
        await fetchTumRenkler();
        setYeniRenk("");
        setRenkKategoriId("");
      } else {
        Swal.fire("Hata!", data.message || "Renk eklenemedi!", "error");
        console.error("API Error:", data);
      }
    } catch (err) {
      Swal.fire("Hata!", "Renk eklenirken hata oluştu.", "error");
      console.error("Fetch Error:", err);
    }
  };

  const filteredUrunler = urunler.filter(
    urun =>
      urun.ad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      urun.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ustKategoriler = kategoriler.filter(k => !k.ustKategoriId);
  const secilenKategorininAltKategorileri = kategoriler.filter(k => k.ustKategoriId === parseInt(formData.kategoriId));

  const getRenkKategorisi = (kategoriId) => {
    return kategoriler.find(k => k.id === kategoriId)?.kategoriAdi || "Kategorisiz";
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p className="text-red-800 text-center">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
              <p className="text-gray-500 mt-1">Ürünlerinizi yönetin ve düzenleyin</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setKategoriYonetimModalOpen(true)} 
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Kategoriler
              </button>
              <button 
                onClick={() => setRenkYonetimModalOpen(true)} 
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Palette className="w-4 h-4 mr-2" />
                Renkler
              </button>
              <button 
                onClick={() => setKategoriModalOpen(true)} 
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Kategori Ekle
              </button>
              <button 
                onClick={openAddModal} 
                // DEĞİŞTİ: Renk eklendi
                className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ürün
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Ürün veya kategori ara..."
              // DEĞİŞTİ: Renk eklendi
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>

        {filteredUrunler.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Ürün bulunamadı</h3>
            <p className="text-gray-500">Yeni ürün eklemek için yukarıdaki butonu kullanın</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* YENİ: Framer Motion AnimatePresence eklendi */}
            <AnimatePresence>
              {filteredUrunler.map(urun => (
                // YENİ: motion.div ve animasyon propları eklendi
                <motion.div
                  key={urun.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-100">
                    {urun.resim ? (
                      <img src={urun.resim} alt={urun.ad} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {urun.kategori && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-white text-xs font-medium text-gray-900 rounded-md shadow-sm">
                        {urun.kategori}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{urun.ad}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{urun.aciklama}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(urun)} 
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDelete(urun.id)} 
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Sil
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Ürün ekleme/düzenleme modalı */}
        {/* YENİ: AnimatePresence eklendi */}
        <AnimatePresence>
          {modalOpen && (
            // YENİ: motion.div ve animasyon propları eklendi (Arka plan)
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              {/* YENİ: motion.div ve animasyon propları eklendi (Modal Panel) */}
              <motion.div
                key="modal"
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10 rounded-t-lg">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editMode ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                  </h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Ürün Adı *
  </label>
  <input
    type="text"
    value={formData.ad}
    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
  />

  {/* URL Önizleme */}
  {formData.ad && (
    <p className="text-sm mt-1 text-gray-600">
      URL önizleme:{" "}
      <span className="text-red-600">
        /urunler/{slugify(formData.ad)}
      </span>
    </p>
  )}
</div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                      <textarea 
                        value={formData.aciklama} 
                        onChange={e => setFormData({...formData, aciklama: e.target.value})} 
                        rows="4"
                        // DEĞİŞTİ: Renk eklendi
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Üst Kategori <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={formData.kategoriId} 
                        onChange={e => {
                          setFormData({...formData, kategoriId: e.target.value, altKategoriId: ""});
                        }}
                        // DEĞİŞTİ: Renk eklendi
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      >
                        <option value="">Seçiniz</option>
                        {ustKategoriler.map(kat => (
                          <option key={kat.id} value={kat.id}>{kat.kategoriAdi}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Kategori 
                        {secilenKategorininAltKategorileri.length > 0 && (
                          <span className="text-red-500"> *</span>
                        )}
                      </label>
                      <select 
                        value={formData.altKategoriId} 
                        onChange={e => setFormData({...formData, altKategoriId: e.target.value})}
                        disabled={!formData.kategoriId}
                        // DEĞİŞTİ: Renk eklendi
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {!formData.kategoriId 
                            ? "Önce üst kategori seçin" 
                            : secilenKategorininAltKategorileri.length === 0 
                              ? "Alt kategori yok" 
                              : "Seçiniz"}
                        </option>
                        {secilenKategorininAltKategorileri.map(kat => (
                          <option key={kat.id} value={kat.id}>{kat.kategoriAdi}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Renkler
                        {!formData.kategoriId && (
                          <span className="text-gray-500 text-xs ml-2">(Önce kategori seçin)</span>
                        )}
                      </label>
                      {formData.kategoriId ? (
                        renkler.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {renkler.map(renk => (
                              <button
                                key={renk.id}
                                type="button"
                                onClick={() => handleRenkToggle(renk.id)}
                                // DEĞİŞTİ: Renk eklendi
                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                  formData.secilenRenkler.includes(renk.id)
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {renk.renkAdi}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Seçili kategori için renk bulunamadı. Yeni renk eklemek için Renkler panelini kullanabilirsiniz.</p>
                        )
                      ) : (
                        <p className="text-sm text-gray-500">Önce kategori seçin.</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ana Resim {editMode ? "(Zorunlu değil)":"*"}</label>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm">
                          <input type="file" accept="image/*" onChange={handleAnaResimChange} className="hidden" />
                          <Upload className="w-4 h-4 mr-2" /> Ana Resim Seç
                        </label>

                        {anaResimPreview ? (
                          <div className="w-24 h-24 rounded-md overflow-hidden border"> 
                            <img src={anaResimPreview} alt="ana" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-md border flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diğer Resimler</label>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm">
                          <input type="file" accept="image/*" multiple onChange={handleDigerResimlerChange} className="hidden" />
                          <Upload className="w-4 h-4 mr-2" /> Resim Ekle
                        </label>
                        <div className="flex gap-2 overflow-x-auto">
                          {digerResimlerPreview.length > 0 ? (
                            digerResimlerPreview.map((src, i) => (
                              <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
                                <img src={src} alt={`dig-${i}`} className="w-full h-full object-cover" />
                                <button onClick={() => removeDigerResim(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">Henüz eklenmiş resim yok.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
                      <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">İptal</button>
                      {/* DEĞİŞTİ: Renk eklendi */}
                      <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">{editMode ? 'Güncelle' : 'Kaydet'}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kategori ekleme modalı (küçük) */}
        {/* YENİ: AnimatePresence eklendi */}
        <AnimatePresence>
          {kategoriModalOpen && (
            // YENİ: motion.div ve animasyon propları eklendi
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-md w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Kategori Ekle</h3>
                  <button onClick={() => setKategoriModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Tipi</label>
                    <div className="flex gap-2">
                      {/* DEĞİŞTİ: Renk eklendi */}
                      <label className={`px-3 py-2 rounded-lg border cursor-pointer ${kategoriTipi === 'ana' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700'}`}>
                        <input type="radio" name="tip" value="ana" checked={kategoriTipi === 'ana'} onChange={() => setKategoriTipi('ana')} className="hidden" /> Ana
                      </label>
                      {/* DEĞİŞTİ: Renk eklendi */}
                      <label className={`px-3 py-2 rounded-lg border cursor-pointer ${kategoriTipi === 'alt' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700'}`}>
                        <input type="radio" name="tip" value="alt" checked={kategoriTipi === 'alt'} onChange={() => setKategoriTipi('alt')} className="hidden" /> Alt
                      </label>
                    </div>
                  </div>

                  {kategoriTipi === 'alt' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Üst Kategori</label>
                      <select value={ustKategoriId} onChange={e => setUstKategoriId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                        <option value="">Seçiniz</option>
                        {ustKategoriler.map(k => <option key={k.id} value={k.id}>{k.kategoriAdi}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                    <input value={yeniKategori} onChange={e => setYeniKategori(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setKategoriModalOpen(false)} className="px-4 py-2 border rounded-lg">İptal</button>
                    {/* DEĞİŞTİ: Renk eklendi */}
                    <button onClick={handleKategoriEkle} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Ekle</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kategori yönetim modalı (kategori listesi + silme) */}
        {/* YENİ: AnimatePresence eklendi */}
        <AnimatePresence>
          {kategoriYonetimModalOpen && (
            // YENİ: motion.div ve animasyon propları eklendi
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-md w-full max-w-3xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Kategoriler</h3>
                  <button onClick={() => setKategoriYonetimModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kategoriler.length === 0 ? (
                    <p className="text-gray-500">Henüz kategori yok.</p>
                  ) : (
                    kategoriler.map(k => (
                      <div key={k.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="text-sm font-medium">{k.kategoriAdi}</div>
                          <div className="text-xs text-gray-500">{k.ustKategoriId ? `Alt kategori (Üst: ${k.ustKategoriId})` : 'Ana kategori'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setYeniKategori(k.kategoriAdi); setKategoriTipi(k.ustKategoriId ? 'alt' : 'ana'); setUstKategoriId(k.ustKategoriId || ''); setKategoriModalOpen(true); }} className="px-3 py-2 border rounded-md text-sm">Düzenle</button>
                          <button onClick={() => handleKategoriSil(k.id)} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm">Sil</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Renk yönetim modalı */}
        {/* YENİ: AnimatePresence eklendi */}
        <AnimatePresence>
          {renkYonetimModalOpen && (
            // YENİ: motion.div ve animasyon propları eklendi
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* DEĞİŞTİ: Renk eklendi */}
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Renk Yönetimi</h3>
                      <p className="text-sm text-gray-500">Ürün renklerini yönetin</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setRenkYonetimModalOpen(false);
                      setYeniRenk('');
                      setRenkKategoriId('');
                    }} 
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Renk Ekleme Formu */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Yeni Renk Ekle
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Renk Adı <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={yeniRenk} 
                          onChange={e => setYeniRenk(e.target.value)}
                          placeholder="Örn: Kırmızı, Mavi"
                          // DEĞİŞTİ: Renk eklendi
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={renkKategoriId} 
                          onChange={e => setRenkKategoriId(e.target.value)}
                          // DEĞİŞTİ: Renk eklendi
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        >
                          <option value="">Kategori seçin</option>
                          {kategoriler.map(k => (
                            <option key={k.id} value={k.id}>
                              {k.kategoriAdi}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button 
                          onClick={handleRenkEkle}
                          disabled={!yeniRenk.trim() || !renkKategoriId}
                          // DEĞİŞTİ: Renk eklendi
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Ekle
                        </button>
                        <button 
                          onClick={() => { setYeniRenk(''); setRenkKategoriId(''); }}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Renk Listesi */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Mevcut Renkler ({tumRenkler.length})
                    </h4>
                    {tumRenkler.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Palette className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">Henüz renk eklenmemiş</p>
                        <p className="text-gray-400 text-xs mt-1">Yukarıdaki formu kullanarak renk ekleyin</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tumRenkler.map(r => (
                          <div 
                            key={r.id} 
                            // DEĞİŞTİ: Renk eklendi
                            className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-red-300"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {/* DEĞİŞTİ: Renk eklendi */}
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600"></div>
                                  <span className="text-sm font-semibold text-gray-900">{r.renkAdi}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <FolderPlus className="w-3 h-3" />
                                  {getRenkKategorisi(r.kategoriId)}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => { 
                                    setYeniRenk(r.renkAdi); 
                                    setRenkKategoriId(String(r.kategoriId)); 
                                  }}
                                  // DEĞİŞTİ: Renk eklendi
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Düzenle"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleRenkSil(r.id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Toplam <span className="font-semibold text-gray-900">{tumRenkler.length}</span> renk
                    </p>
                    <button 
                      onClick={() => {
                        setRenkYonetimModalOpen(false);
                        setYeniRenk('');
                        setRenkKategoriId('');
                      }}
                      // DEĞİŞTİ: Renk eklendi
                      className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
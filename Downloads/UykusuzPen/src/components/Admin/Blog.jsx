import React, { useState, useEffect } from "react";
import { Upload, X, FileText, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import Swal from "sweetalert2";

function BlogForm() {
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [resim, setResim] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("https://localhost:44361/api/Blog");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Blog'lar yüklenemedi:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Blog'lar yüklenemedi!",
      });
    }
  };

  const createSlug = (text) => {
    const trMap = {
      ç: "c", Ç: "c",
      ğ: "g", Ğ: "g",
      ı: "i", İ: "i",
      ö: "o", Ö: "o",
      ş: "s", Ş: "s",
      ü: "u", Ü: "u",
    };

    return text
      .split("")
      .map((char) => trMap[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResim(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setResim(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!baslik.trim() || !aciklama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı",
        text: "Başlık ve açıklama alanlarını doldurun!",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Baslik", baslik);
      formData.append("Aciklama", aciklama);
      if (resim) formData.append("Resim", resim);

      const response = await fetch("https://localhost:44361/api/Blog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Blog eklenemedi");
      }

      Swal.fire({
        icon: "success",
        title: "Başarılı",
        text: "Blog başarıyla eklendi!",
      });

      setBaslik("");
      setAciklama("");
      setResim(null);
      setPreviewUrl("");
      fetchBlogs();
    } catch (error) {
      console.error("Hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: error.message || "Blog eklenirken bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu blog yazısını silmek istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "İptal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`https://localhost:44361/api/Blog/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Silindi",
          text: "Blog başarıyla silindi!",
        });
        fetchBlogs();
      } else {
        throw new Error("Blog silinemedi");
      }
    } catch (error) {
      console.error("Hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Blog silinirken bir hata oluştu",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 📘 Blog Ekleme Formu */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Blog yazınızın başlığını girin..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                required
              />
              {baslik && (
                <p className="text-xs text-gray-500 mt-2">
                  URL önizleme:{" "}
                  <span className="font-mono text-red-600">
                    /blog/{createSlug(baslik)}-###
                  </span>
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                İçerik <span className="text-red-500">*</span>
              </label>
              <textarea
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                placeholder="Blog yazınızın içeriğini girin..."
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                required
              />
            </div>

            {/* Görsel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kapak Görseli
              </label>
              {!previewUrl ? (
                <label
                  htmlFor="blog-image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="blog-image-upload"
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mb-3 group-hover:text-red-500 transition-colors" />
                  <p className="text-sm text-gray-600 font-medium">
                    Kapak görseli yüklemek için tıklayın
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG veya GIF (Max. 5MB)
                  </p>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setBaslik("");
                  setAciklama("");
                  setResim(null);
                  setPreviewUrl("");
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                Temizle
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Blog Yayınla
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 📰 Blog Listesi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mevcut Blog Yazıları</h2>
          {blogs.length === 0 ? (
            <p className="text-gray-500 text-center">Henüz blog yazısı yok</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                >
                  {blog.resimUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.resimUrl}
                        alt={blog.baslik}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {blog.baslik}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {blog.aciklama}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(blog.olusturulmaTarihi)}
                      </span>
                      <a
                        href={`/blog/${createSlug(blog.baslik)}-${blog.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Görüntüle
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogForm;

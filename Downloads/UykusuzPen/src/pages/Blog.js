import React, { useState, useEffect } from "react";
import { Calendar, Loader2, AlertCircle } from "lucide-react";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://localhost:44361/api/Blog");
      if (!response.ok) throw new Error("Blog'lar yüklenirken hata oluştu");
      const data = await response.json();
      setBlogs(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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

  const sortedBlogs = blogs
    .filter((b) =>
      b.baslik.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.olusturulmaTarihi) - new Date(a.olusturulmaTarihi);
      if (sortType === "oldest")
        return new Date(a.olusturulmaTarihi) - new Date(b.olusturulmaTarihi);
      if (sortType === "alphabetical")
        return a.baslik.localeCompare(b.baslik);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Başlık */}
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
          Blog Yazıları
        </h1>
        <p className="text-xl md:text-2xl text-gray-800 mt-3">
          En son paylaşılan yazıları keşfedin
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex gap-8 px-4 pt-12">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 gap-4 sticky top-40 h-fit bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Filtrele</h2>
          <input
            type="text"
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => setSortType("newest")}
            className={`text-left px-4 py-2 rounded-lg transition-all ${
              sortType === "newest"
                ? "bg-red-500 text-white font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            En Yeni
          </button>
          <button
            onClick={() => setSortType("oldest")}
            className={`text-left px-4 py-2 rounded-lg transition-all ${
              sortType === "oldest"
                ? "bg-red-500 text-white font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            En Eski
          </button>
          <button
            onClick={() => setSortType("alphabetical")}
            className={`text-left px-4 py-2 rounded-lg transition-all ${
              sortType === "alphabetical"
                ? "bg-red-500 text-white font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Alfabetik
          </button>
        </div>

        {/* Blog listesi */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedBlogs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/20">
              <h2 className="text-2xl font-bold mb-2">Henüz Blog Yok</h2>
              <p className="text-gray-600">İlk blog yazısını siz oluşturun!</p>
            </div>
          ) : (
            sortedBlogs.map((blog) => (
              <a
                key={blog.id}
                href={`/blog/${createSlug(blog.baslik)}-${blog.id}`}
                className="block"
              >
                <article className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20 group">
                  {blog.resimUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.resimUrl}
                        alt={blog.baslik}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {blog.baslik}
                    </h2>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span>{formatDate(blog.olusturulmaTarihi)}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {blog.aciklama}
                    </p>
                  </div>
                </article>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogList;

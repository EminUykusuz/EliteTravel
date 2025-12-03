import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Loader2, AlertCircle, Share2, Eye, Twitter, Facebook, Linkedin, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BlogDetay() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      const id = slug.split('-').pop();
      fetchBlog(id);
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchBlog = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:44361/api/Blog/${id}`);
      
      if (!response.ok) {
        throw new Error("Blog bulunamadı");
      }
      
      const data = await response.json();
      setBlog(data);
      setError(null);
    } catch (err) {
      console.error("Blog yükleme hatası:", err);
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estimateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.baslik;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-red-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600 font-medium text-lg">Blog yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pt-32">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center border border-gray-200"
        >
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Blog Bulunamadı</h2>
          <p className="text-gray-600 mb-8">
            Aradığınız blog yazısı bulunamadı veya silinmiş olabilir.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/blog")}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
          >
            Blog Listesine Dön
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 mt-20"
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Blog Listesine Dön</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Kapak Resmi */}
        <AnimatePresence>
          {blog.resimUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={blog.resimUrl}
                alt={blog.baslik}
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blog Başlık ve Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            {blog.baslik}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span className="font-medium">{formatDate(blog.olusturulmaTarihi)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="font-medium">{formatTime(blog.olusturulmaTarihi)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              <span className="font-medium">{estimateReadingTime(blog.aciklama)} dakika okuma</span>
            </div>

            {/* Share Button */}
            <div className="ml-auto relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Paylaş</span>
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 min-w-[200px]"
                  >
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-3 w-full p-4 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="font-medium">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 w-full p-4 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors border-t border-gray-100"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="font-medium">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-3 w-full p-4 hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors border-t border-gray-100"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="font-medium">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 text-gray-700 transition-colors border-t border-gray-100"
                    >
                      <Link2 className="w-5 h-5" />
                      <span className="font-medium">Linki Kopyala</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Blog İçerik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none mb-16"
        >
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:text-red-600 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
            {blog.aciklama}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-10 text-center border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Bu yazıyı beğendiniz mi?
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Diğer blog yazılarımıza da göz atın
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/blog")}
            className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            <span>Tüm Blog Yazıları</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </motion.button>
        </motion.div>
      </article>

      {/* Scroll to Top */}
      <AnimatePresence>
        {readingProgress > 20 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-2xl z-50 hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlogDetay;
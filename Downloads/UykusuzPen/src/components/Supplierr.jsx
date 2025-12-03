import React, { useState, useEffect } from "react";
import { ChevronDown, BookOpen, ArrowRight, Loader2 } from "lucide-react";

const faqs = [
  {
    question: "PVC pencere nedir ve avantajları nelerdir?",
    answer:
      "PVC pencere, polivinil klorür malzemeden üretilen, yüksek ısı ve ses yalıtımı sağlayan modern pencere sistemleridir. Dayanıklı, ekonomik ve bakım gerektirmez.",
  },
  {
    question: "Cam balkon sistemi nasıl çalışır?",
    answer:
      "Cam balkon sistemleri, özel ray mekanizması üzerinde hareket eden temperli cam panellerden oluşur. Balkonunuzu dört mevsim kullanmanızı sağlar ve rüzgar, yağmur, tozdan korur.",
  },
  {
    question: "Ürünlerinizin garantisi var mı?",
    answer:
      "Evet, tüm ürünlerimiz 2-5 yıl arası garanti kapsamındadır. Garanti süresi ürün tipine göre değişiklik gösterebilir.",
  },
  {
    question: "Montaj hizmeti veriyor musunuz?",
    answer:
      "Evet, profesyonel montaj ekibimiz tüm Türkiye genelinde hizmet vermektedir. Montaj işlemi uzman kadromuz tarafından yapılmaktadır.",
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer:
      "Nakit, kredi kartı ve havale/EFT ile ödeme kabul edilmektedir. Ayrıca taksit seçeneklerimiz de mevcuttur.",
  },
];

export default function Supluyer() {
  const [openIndex, setOpenIndex] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await fetch("https://localhost:44361/api/Blog");

      if (response.ok) {
        const data = await response.json();
        setBlogs(data.slice(0, 3));
      }
    } catch (error) {
      console.error("Blog yükleme hatası:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
      ç: "c",
      Ç: "c",
      ğ: "g",
      Ğ: "g",
      ı: "i",
      İ: "i",
      ö: "o",
      Ö: "o",
      ş: "s",
      Ş: "s",
      ü: "u",
      Ü: "u",
    };

    return text
      .split("")
      .map((char) => trMap[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Sıkça Sorulan Sorular
              </h2>
              <p className="text-gray-600">
                Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-red-600 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-4 pt-0 text-gray-600 bg-gray-50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
              <p className="text-gray-700 text-sm text-center">
                Sorunuzun cevabını bulamadınız mı?{" "}
                <a
                  href="/iletisim"
                  className="text-red-600 font-semibold hover:text-red-700 underline"
                >
                  Bizimle iletişime geçin
                </a>
              </p>
            </div>
          </div>

          {/* Blog Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Blog</h2>
                  <p className="text-gray-600">En son yazılarımız</p>
                </div>
              </div>

              {loadingBlogs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : blogs.length > 0 ? (
                <>
                  <div className="space-y-6 mb-8">
                    {blogs.map((blog) => (
                      <a
                        key={blog.id}
                        href={`/blog/${createSlug(blog.baslik)}-${blog.id}`}
                        className="group cursor-pointer block"
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex-shrink-0 overflow-hidden">
                            {blog.resimUrl ? (
                              <img
                                src={blog.resimUrl}
                                alt={blog.baslik}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-red-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                              {blog.baslik}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {formatDate(blog.olusturulmaTarihi)}
                            </p>
                            <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                              Devamını Oku <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <a
                    href="/blog"
                    className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Tüm Blog Yazılarını Gör
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz blog yazısı yok</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

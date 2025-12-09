// src/components/sections/FAQSection.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react'; // İkonları değiştirdik

const faqs = [
  {
    question: "Ücrete neler dahil?",
    answer: "Fiyatlarımıza gidiş-dönüş uçak biletleri, 5 yıldızlı otellerde konaklama, lüks araçlarla transferler, müze ve ören yeri giriş ücretleri ve profesyonel rehberlik hizmetleri dahildir. Kişisel harcamalar ve öğle/akşam yemekleri hariçtir."
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer: "Ödemelerinizi banka havalesi veya kredi kartı ile güvenli bir şekilde gerçekleştirebilirsiniz. Erken rezervasyonlarda taksit imkanlarımız bulunmaktadır."
  },
  {
    question: "Vize işlemleri nasıl yapılıyor?",
    answer: "Avrupa vatandaşları için vize gerekmemektedir. T.C. vatandaşları veya diğer pasaport sahipleri için vize danışmanlık hizmetimiz mevcuttur, ekibimiz tüm süreci sizin adınıza yönetir."
  },
  {
    question: "Tur iptal ve iade koşulları nelerdir?",
    answer: "Tura 30 gün kala yapılan iptallerde ücretin tamamı iade edilir. 15-30 gün arası iptallerde %50 kesinti uygulanır. Son 15 gün içinde yapılan iptallerde maalesef iade yapılamamaktadır."
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0); // İlkini açık getirelim, kullanıcı dolu görsün

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#f8fafc]"> {/* Hafif gri zemin */}
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* BAŞLIK ALANI */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163a58]/10 text-[#163a58] text-sm font-bold mb-4">
            <HelpCircle size={16} />
            <span>Merak Ettikleriniz</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#163a58] mb-4">Sıkça Sorulan Sorular</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Tur programlarımız, ödemeler ve süreçler hakkında en çok merak edilen soruları sizin için derledik.
          </p>
        </div>

        {/* AKORDİYON ALANI */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={false}
              animate={{ backgroundColor: activeIndex === index ? "#ffffff" : "#ffffff" }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                activeIndex === index 
                  ? 'border-[#dca725] shadow-lg shadow-[#dca725]/10' // Aktifse Altın Çerçeve
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button 
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-[#163a58]' : 'text-gray-700'}`}>
                  {faq.question}
                </span>
                
                {/* İkon Animasyonu */}
                <span className={`p-2 rounded-full transition-colors ${activeIndex === index ? 'bg-[#dca725] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-8 text-gray-600 leading-relaxed border-t border-dashed border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
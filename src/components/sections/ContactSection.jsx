import Swal from 'sweetalert2'; // Toast yerine bunu import ettik
import { MapPin, Phone, Mail, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- SWEETALERT AYARLARI ---
    Swal.fire({
      title: '<span style="color:#163a58">Talebiniz Alındı!</span>',
      html: `
        <p style="color:#555; font-size:1.1rem; margin-bottom: 10px;">
          Formunuz bize başarıyla ulaştı.
        </p>
        <p style="color:#555;">
          Seyahat danışmanlarımız <strong>24 saat içinde</strong> verdiğiniz numaradan size dönüş yapacaktır.
        </p>
      `,
      icon: 'success', // Yeşil tik işareti çıkar
      iconColor: '#dca725', // İkonu senin altın sarısı rengin yaptık
      background: '#fff',
      confirmButtonText: 'Harika, Bekliyorum',
      confirmButtonColor: '#163a58', // Buton rengi senin lacivertin
      showClass: {
        popup: 'animate__animated animate__fadeInDown' // Yumuşak giriş animasyonu
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      customClass: {
        popup: 'rounded-2xl border-2 border-[#dca725]/20 shadow-2xl' // Köşeleri yuvarladık
      }
    });

    e.target.reset();
  };

  return (
    <section className="py-20 relative overflow-hidden">
      
      {/* Arkaplan Süsü (Opsiyonel) */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[600px]">
          
          {/* SOL TARA: İLETİŞİM BİLGİLERİ (DARK SIDE) */}
          <div className="bg-[#163a58] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
            
            {/* Dekoratif Desen */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">İletişime Geçin</h2>
              <p className="text-gray-300 mb-10 text-lg">
                Size özel tur planlamaları ve sorularınız için ekibimiz bir mesaj uzağınızda.
              </p>

              <div className="space-y-8">
                {/* Adres */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#dca725] transition-colors duration-300">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Merkez Ofis</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      Fuar Alanı: Salon 3, Stant B-12<br />
                      İstanbul / Türkiye
                    </p>
                  </div>
                </div>

                {/* Telefon */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#dca725] transition-colors duration-300">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Telefon</h3>
                    <p className="text-gray-300 text-sm">+31 6 21525757</p>
                    <p className="text-gray-400 text-xs mt-1">Hafta içi: 09:00 - 18:00</p>
                  </div>
                </div>

                {/* Email (Opsiyonel) */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#dca725] transition-colors duration-300">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">E-Posta</h3>
                    <p className="text-gray-300 text-sm">info@elitetravel.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Kısım: Sosyal Medya veya Ekstra Bilgi */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <a 
                href="https://wa.me/31621525757" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#dca725] font-bold hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp'tan Hızlı Destek
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* SAĞ TARAF: FORM ALANI (WHITE SIDE) */}
          <div className="p-10 md:p-14 bg-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-[#163a58] mb-6">
              Bize Yazın
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Adınız Soyadınız</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Örn: Ahmet Yılmaz" 
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#dca725] focus:ring-4 focus:ring-[#dca725]/10 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Telefon Numaranız</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="Örn: +90 555..." 
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#dca725] focus:ring-4 focus:ring-[#dca725]/10 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">E-Posta Adresiniz</label>
                <input 
                  required 
                  type="email" 
                  placeholder="iletisim@mail.com" 
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#dca725] focus:ring-4 focus:ring-[#dca725]/10 transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Mesajınız</label>
                <textarea 
                  required 
                  rows="4" 
                  placeholder="Tur hakkında bilgi almak istiyorum..." 
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#dca725] focus:ring-4 focus:ring-[#dca725]/10 transition-all resize-none"
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#163a58] text-white font-bold py-4 rounded-xl hover:bg-[#1f4d75] transition-all shadow-lg shadow-[#163a58]/20 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Mesajı Gönder
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
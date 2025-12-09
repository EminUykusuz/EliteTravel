import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
  // Yıl bilgisini dinamik alalım
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#163a58] text-white pt-16 pb-8 border-t-4 border-[#dca725]">
      <div className="container mx-auto px-6">
        
        {/* ÜST KISIM (GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. KOLON: MARKA & HAKKINDA */}
          <div className="space-y-6">
            <a href="/" className="inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Elite <span className="text-[#dca725]">Travel</span>
              </h2>
            </a>
            <p className="text-gray-300 text-sm leading-relaxed">
              Dr. Ahmet Anapalı rehberliğinde, tarih ve maneviyat dolu özel rotalarla bir turdan fazlasını sunuyoruz. 
            </p>
            <div className="flex gap-4">
              {/* Sosyal Medya İkonları */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#dca725] hover:text-[#163a58] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#dca725] hover:text-[#163a58] transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#dca725] hover:text-[#163a58] transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 2. KOLON: HIZLI LİNKLER */}
          <div>
            <h3 className="text-lg font-bold text-[#dca725] mb-6">Hızlı Erişim</h3>
            <ul className="space-y-4">
              <li><a href="/" className="text-gray-300 hover:text-[#dca725] transition-colors flex items-center gap-2"><ArrowRight size={14}/> Ana Sayfa</a></li>
              <li><a href="/turlar" className="text-gray-300 hover:text-[#dca725] transition-colors flex items-center gap-2"><ArrowRight size={14}/> Turlarımız</a></li>
              <li><a href="/hakkimizda" className="text-gray-300 hover:text-[#dca725] transition-colors flex items-center gap-2"><ArrowRight size={14}/> Kurumsal</a></li>
              <li><a href="/iletisim" className="text-gray-300 hover:text-[#dca725] transition-colors flex items-center gap-2"><ArrowRight size={14}/> İletişim</a></li>
            </ul>
          </div>

          {/* 3. KOLON: İLETİŞİM BİLGİLERİ */}
          <div>
            <h3 className="text-lg font-bold text-[#dca725] mb-6">Bize Ulaşın</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="text-[#dca725] shrink-0" size={20} />
                <span className="text-sm">Fuar Alanı: Salon 3, Stant B-12<br/>İstanbul / Türkiye</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="text-[#dca725] shrink-0" size={20} />
                <a href="tel:+31621525757" className="text-sm hover:text-white transition-colors">+31 6 21525757</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="text-[#dca725] shrink-0" size={20} />
                <a href="mailto:info@elitetravel.com" className="text-sm hover:text-white transition-colors">info@elitetravel.com</a>
              </li>
            </ul>
          </div>

          {/* 4. KOLON: E-BÜLTEN (Görsel Doluluk İçin) */}
          <div>
            <h3 className="text-lg font-bold text-[#dca725] mb-6">Haberdar Olun</h3>
            <p className="text-gray-300 text-sm mb-4">
              Yeni turlarımızdan ve özel fırsatlardan ilk siz haberdar olun.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#dca725] focus:bg-white/10 transition-all"
              />
              <button className="w-full py-3 bg-[#dca725] text-[#163a58] font-bold rounded-lg hover:bg-white transition-colors">
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        {/* ALT KISIM (COPYRIGHT) */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Elite Travel. Tüm hakları saklıdır.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#dca725] font-bold uppercase tracking-widest bg-[#dca725]/10 px-3 py-1 rounded-full border border-[#dca725]/20">
              Fuara Özel Osmanlı Turları
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
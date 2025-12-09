import logoImg from '../../assets/elitelogo.svg'; 
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Hangi sayfadayız anlamak için
import { Menu, X, ChevronDown, Phone } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // URL'yi takip ediyoruz ki aktif menü rengi değişsin (Sarı yansın)
  const location = useLocation(); 

  // Scroll efekti
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MENU LİNKLERİ (App.js ile Eşleşmeli) ---
  const navLinks = [
    { name: 'Ana Sayfa', href: '/', hasDropdown: false },
    
    // TURLAR -> /turlar sayfasına gider
    { 
      name: 'Turlar', 
      href: '/turlar', 
      hasDropdown: true, 
      subItems: [
        { name: 'Tüm Turlar', href: '/turlar' },
        // Kategori filtrelerini ileride yaparsak diye query parametresi ekledim
        { name: 'Osmanlı Başkentleri', href: '/turlar?cat=osmanli' },
        { name: 'Kudüs & Maneviyat', href: '/turlar?cat=kudus' }
      ]
    },
    
    // KURUMSAL -> /hakkimizda sayfasına gider
    { name: 'Kurumsal', href: '/hakkimizda', hasDropdown: false },
    
    // İLETİŞİM -> /iletisim sayfasına gider
    { name: 'İletişim', href: '/iletisim', hasDropdown: false },
  ];

  // Link aktif mi kontrolü (örn: /iletisim sayfasındaysak true döner)
  const isActive = (path) => {
    // Ana sayfa için tam eşleşme, diğerleri için 'ile başlıyor mu' kontrolü
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 py-5 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="/" className="flex-shrink-0">
          <img 
            src={logoImg} 
            alt="Elite Travel" 
            className={`transition-all duration-300 object-contain ${scrolled ? 'h-10' : 'h-12'}`} 
          />
        </a>

        {/* --- DESKTOP MENÜ --- */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={index} className="relative group h-full flex items-center">
                
                {/* Link Yapısı (Sayfa Yenilenerek Geçer) */}
                <a 
                  href={link.href} 
                  className={`flex items-center gap-1 text-[15px] font-semibold transition-colors py-2 ${
                    isActive(link.href.split('?')[0]) ? 'text-elite-gold' : 'text-elite-dark hover:text-elite-gold'
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform" />}
                </a>

                {/* Dropdown */}
                {link.hasDropdown && (
                  <div className="absolute top-full -left-4 w-56 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white shadow-xl rounded-lg border-t-4 border-elite-gold overflow-hidden py-2">
                      {link.subItems.map((sub, subIndex) => (
                        <a 
                          key={subIndex}
                          href={sub.href} 
                          className="block px-6 py-3 text-sm text-elite-dark hover:bg-gray-50 hover:text-elite-gold transition-colors border-b border-gray-50 last:border-0"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* İletişim Butonu (Masaüstü) */}
          <a 
            href="/iletisim" 
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-[#163a58] text-white text-sm font-bold rounded hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-[#163a58]/20"
          >
            <Phone size={16} className="text-[#dca725]" />
            <span>Bize Ulaşın</span>
          </a>
        </div>

        {/* --- MOBİL MENÜ BUTONU --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-elite-dark hover:text-elite-gold transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBİL MENÜ İÇERİK --- */}
      <div className={`md:hidden bg-white border-t border-gray-100 absolute w-full left-0 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[400px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a 
                href={link.href} 
                className={`flex justify-between items-center font-medium text-lg ${
                  isActive(link.href.split('?')[0]) ? 'text-elite-gold' : 'text-elite-dark'
                }`}
              >
                {link.name}
              </a>
              {/* Mobil Alt Menüler */}
              {link.hasDropdown && (
                <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100">
                  {link.subItems.map((sub, subIndex) => (
                     <a 
                        key={subIndex} 
                        href={sub.href}
                        className="block text-sm text-gray-500 hover:text-elite-gold"
                     >
                       {sub.name}
                     </a>
                  ))}
                </div>
              )}
            </li>
          ))}
          <a 
            href="/turlar" 
            className="mt-2 w-full py-3 bg-elite-gold text-elite-dark font-bold rounded text-center block"
          >
            Plan Yap
          </a>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
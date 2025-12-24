import logoImg from '../../assets/elitelogo.svg'; // Logonun yeri doğru mu kontrol et
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, CalendarCheck } from 'lucide-react';
import { menuService } from '../../serivces/genericService';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const getTranslatedTitle = (item) => {
    const lang = (i18n.language || 'tr').split('-')[0].toLowerCase();
    const translations = item?.translations || [];
    const match = translations.find(tr => (tr?.languageCode || '').toLowerCase() === lang);
    return (match?.title || item?.title || item?.name || '').trim();
  };

  // Menü öğelerini API'den yükle
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const response = await menuService.getAll();
        const items = response.data || response;

        // Menu items'ları navbar yapısına çevir
        const menuStructure = items.map(item => ({
          id: item.id,
          name: getTranslatedTitle(item), // Backend: title + translations
          href: item.url || '#',
          hasDropdown: item.children && item.children.length > 0, // Backend "Children" gönderiyor
          subItems: item.children ? item.children.map(child => ({
            id: child.id,
            name: getTranslatedTitle(child),
            href: child.url || '#'
          })) : []
        }));

        setNavLinks(menuStructure);
      } catch (error) {
        // Fallback hardcoded menu
        setNavLinks([
          { name: t('nav.home'), href: '/', hasDropdown: false },
          { 
            name: t('nav.tours'), 
            href: '/tours', 
            hasDropdown: true, 
            subItems: [
              { name: t('tours.allTours'), href: '/tours' },
              { name: 'Ottoman Capitals', href: '/tours' },
              { name: 'Ottoman Architecture', href: '/tours' },
              { name: 'Spiritual Tours', href: '/tours' }
            ]
          },
          { name: t('nav.about'), href: '/hakkimizda', hasDropdown: false },
          { name: t('nav.contact'), href: '/iletisim', hasDropdown: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [i18n.language]);

  // Scroll takibi: Sayfa aşağı kayınca navbar beyazlaşır ve gölge alır
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Aktif link kontrolü (Sarı yakmak için)
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${
        scrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 py-5 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* --- LOGO --- */}
        <a href="/" className="flex-shrink-0 group">
          <img 
            src={logoImg} 
            alt="Elite Travel" 
            className={`transition-all duration-300 object-contain group-hover:scale-105 ${scrolled ? 'h-10' : 'h-12'}`} 
          />
        </a>

        {/* --- DESKTOP MENÜ --- */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link, index) => (
              <li key={index} className="relative group h-full flex items-center">
                
                {/* Ana Linkler */}
                <a 
                  href={link.href} 
                  className={`flex items-center gap-1 text-[15px] font-semibold transition-colors py-2 ${
                    isActive(link.href) 
                      ? 'text-[#dca725]' // Aktifse Altın Sarısı
                      : 'text-[#163a58] hover:text-[#dca725]' // Değilse Lacivert -> Altın (Hover)
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </a>

                {/* Dropdown Menü (Açılır Kutu) */}
                {link.hasDropdown && (
                  <div className="absolute top-full -left-4 w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white shadow-2xl rounded-xl border-t-4 border-[#dca725] overflow-hidden py-2">
                      {link.subItems.map((sub, subIndex) => (
                        <a 
                          key={subIndex}
                          href={sub.href} 
                          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#163a58] hover:bg-[#163a58]/5 hover:text-[#dca725] transition-colors border-b border-gray-50 last:border-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dca725] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Aksiyon Butonu (Bize Ulaşın) */}
          <a 
            href="/contact" 
            // bg-[#163a58] ve text-white ile renkleri sabitledik.
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-[#163a58] text-white text-sm font-bold rounded-lg hover:bg-[#dca725] hover:text-[#163a58] transition-all duration-300 shadow-lg shadow-[#163a58]/20 group"
          >
            <Phone size={16} className="text-[#dca725] group-hover:text-[#163a58] transition-colors" />
            <span>{t('nav.contact')}</span>
          </a>

          {/* Dil Seçici */}
          <LanguageSwitcher />
        </div>

        {/* --- MOBİL MENÜ BUTONU --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-[#163a58] hover:text-[#dca725] transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBİL MENÜ İÇERİK --- */}
      <div 
        className={`md:hidden bg-white border-t border-gray-100 absolute w-full left-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col py-6 px-6 gap-5">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a 
                href={link.href} 
                className={`flex justify-between items-center font-bold text-lg ${
                  isActive(link.href) ? 'text-[#dca725]' : 'text-[#163a58]'
                }`}
              >
                {link.name}
              </a>
              
              {/* Mobil Dropdown Linkleri */}
              {link.hasDropdown && (
                <div className="pl-4 mt-3 space-y-3 border-l-2 border-[#dca725]/30">
                  {link.subItems.map((sub, subIndex) => (
                     <a 
                        key={subIndex} 
                        href={sub.href}
                        className="block text-sm font-medium text-gray-500 hover:text-[#dca725] transition-colors"
                     >
                       {sub.name}
                     </a>
                  ))}
                </div>
              )}
            </li>
          ))}
          
          {/* Mobilde "Plan Yap" Butonu */}
          <a 
            href="/turlar" 
            className="mt-4 w-full py-3 bg-[#dca725] text-[#163a58] font-bold rounded-xl text-center shadow-md flex items-center justify-center gap-2 hover:bg-[#c59620] transition-colors"
          >
            <CalendarCheck size={18} />
            {t('tours.bookNow')}
          </a>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
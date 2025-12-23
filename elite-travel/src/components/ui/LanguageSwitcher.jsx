import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dil Seçici Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#163a58] text-[#163a58] rounded-lg hover:bg-[#163a58] hover:text-white hover:border-[#dca725] transition-all duration-300 font-medium shadow-md group"
      >
        <Globe size={18} className="text-[#dca725] group-hover:text-[#dca725]" />
        <span className="text-sm font-semibold">{currentLanguage.flag}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-[#163a58]/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                lang.code === i18n.language
                  ? 'bg-[#163a58] text-white'
                  : 'text-[#163a58] hover:bg-[#dca725]/10'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {lang.code === i18n.language && (
                <Check size={18} className="text-[#dca725]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

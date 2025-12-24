import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { menuService, settingsService } from '../../serivces/genericService';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [footerMenus, setFooterMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socialMedia, setSocialMedia] = useState({
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    youtubeUrl: ''
  });
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    email: ''
  });

  // Menü öğesinin çevirisini al
  const getTranslatedTitle = (item) => {
    if (!item) return '';
    
    // Aktif dil kodunu al (örn: "tr", "en")
    const lang = (i18n.language || 'tr').split('-')[0].toLowerCase();
    
    // Translations array'i varsa ve içinde çeviri varsa
    const translations = item?.translations || [];
    const match = translations.find(tr => (tr?.languageCode || '').toLowerCase() === lang);
    
    // Çeviri varsa döndür, yoksa varsayılan title
    return (match?.title || item?.title || item?.name || '').trim();
  };

  // Menü öğelerini ve sosyal medya ayarlarını yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        // Menü öğelerini yükle
        const response = await menuService.getAll();
        const items = response.data || response;
        console.log('Footer Menu Items:', items); // Debug için
        const visibleItems = items.filter(item => !item.parentId && !item.isDeleted);
        setFooterMenus(visibleItems);

        // Sosyal medya ayarlarını yükle
        const settingsResponse = await settingsService.getAll();
        const settings = settingsResponse.data ? settingsResponse.data[0] : settingsResponse[0];
        if (settings) {
          setSocialMedia({
            instagramUrl: settings.instagramUrl || '',
            facebookUrl: settings.facebookUrl || '',
            twitterUrl: settings.twitterUrl || '',
            youtubeUrl: settings.youtubeUrl || ''
          });
          setContactInfo({
            address: settings.address || '',
            phone: settings.sitePhone || '',
            email: settings.siteEmail || ''
          });
        }
      } catch (error) {
        console.error('Veri yüklenilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [i18n.language]); // Dil değiştiğinde yeniden yükle

  return (
    // ZEMİN: #163a58 (Lacivert), ÇİZGİ: #dca725 (Altın)
    <footer className="bg-[#163a58] text-white pt-16 pb-8 border-t-4 border-[#dca725] mt-auto">
      <div className="container mx-auto px-6">
        
        {/* ÜST KISIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* 1. KOLON: MARKA */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex flex-col">
                {/* Logo Hover: Beyazdan Altına Dönüş */}
                <h2 className="text-4xl font-bold tracking-tight text-white group-hover:text-[#dca725] transition-colors duration-300">
                  Elite <span className="text-[#dca725] group-hover:text-white transition-colors duration-300">Travel</span>
                </h2>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1 ml-1">
                  {t('footer.tagline')}
                </span>
              </div>
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            
            {/* SOSYAL MEDYA İKONLARI */}
            <div className="flex gap-4">
              {socialMedia.instagramUrl && (
                <a href={socialMedia.instagramUrl} target='_blank' rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#dca725] hover:text-[#163a58]">
                  <Instagram size={20} />
                </a>
              )}
              {socialMedia.facebookUrl && (
                <a href={socialMedia.facebookUrl} target='_blank' rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#dca725] hover:text-[#163a58]">
                  <Facebook size={20} />
                </a>
              )}
              {socialMedia.twitterUrl && (
                <a href={socialMedia.twitterUrl} target='_blank' rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#dca725] hover:text-[#163a58]">
                  <Twitter size={20} />
                </a>
              )}
              {socialMedia.youtubeUrl && (
                <a href={socialMedia.youtubeUrl} target='_blank' rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#dca725] hover:text-[#163a58]">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* 2. KOLON: HIZLI LİNKLER */}
          <div>
            <h3 className="text-lg font-bold text-[#dca725] mb-6 border-b border-white/10 inline-block pb-2">{t('footer.quickAccess')}</h3>
            <ul className="space-y-3">
              {/* Link Hover: Gri'den Altına Dönüş */}
              {loading ? (
                <li className="text-gray-400 text-sm">{t('common.loading')}</li>
              ) : footerMenus && footerMenus.length > 0 ? (
                footerMenus.filter(item => !item.parentId).map(item => (
                  <li key={item.id}>
                    <Link to={item.url || '#'} className="text-gray-300 hover:text-[#dca725] transition-colors duration-300 flex items-center gap-2">
                      <ArrowRight size={14} className="text-[#dca725]"/> {getTranslatedTitle(item)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/" className="text-gray-300 hover:text-[#dca725] transition-colors duration-300 flex items-center gap-2"><ArrowRight size={14} className="text-[#dca725]"/> {t('nav.home')}</Link></li>
                  <li><Link to="/turlar" className="text-gray-300 hover:text-[#dca725] transition-colors duration-300 flex items-center gap-2"><ArrowRight size={14} className="text-[#dca725]"/> {t('nav.tours')}</Link></li>
                  <li><Link to="/hakkimizda" className="text-gray-300 hover:text-[#dca725] transition-colors duration-300 flex items-center gap-2"><ArrowRight size={14} className="text-[#dca725]"/> {t('nav.about')}</Link></li>
                  <li><Link to="/iletisim" className="text-gray-300 hover:text-[#dca725] transition-colors duration-300 flex items-center gap-2"><ArrowRight size={14} className="text-[#dca725]"/> {t('nav.contact')}</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* 3. KOLON: İLETİŞİM */}
          <div>
            <h3 className="text-lg font-bold text-[#dca725] mb-6 border-b border-white/10 inline-block pb-2">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              {contactInfo.address && (
                <li className="flex items-start gap-3 text-gray-300">
                  <div className="shrink-0 mt-1"><MapPin size={18} className="text-[#dca725]" /></div>
                  <span className="text-sm">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="shrink-0"><Phone size={18} className="text-[#dca725]" /></div>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sm hover:text-white transition-colors duration-300">{contactInfo.phone}</a>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="shrink-0"><Mail size={18} className="text-[#dca725]" /></div>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-white transition-colors duration-300">{contactInfo.email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ALT KISIM */}
        <div className="border-t border-white/10 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Elite Travel. {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-[#dca725] animate-pulse"></span>
             <span className="text-xs text-gray-400 uppercase tracking-widest">{t('footer.premiumTourism')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * TRANSLATE KULLANIMI REHBERI
 * 
 * 1. Component'in en üstüne ekle:
 *    import { useTranslation } from 'react-i18next';
 * 
 * 2. Component içinde şu satırı ekle:
 *    const { t } = useTranslation();
 * 
 * 3. Metinleri çevir:
 *    {t('nav.home')} yerine {t('nav.home')}
 * 
 * Örnek:
 */

export default function TranslateExample() {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('hero.title')}</h1>
      <p className="text-lg text-gray-600 mb-4">{t('hero.subtitle')}</p>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="font-bold mb-2">Mevcut Dil: {i18n.language}</h2>
        <p className="text-sm text-gray-600">
          Şu an dil: {i18n.language === 'tr' ? 'Türkçe' : 'English'}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="text-2xl font-bold">{t('aboutUs.title')}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-1">{t('aboutUs.feature1')}</h3>
            <p className="text-xs text-gray-600">{t('aboutUs.feature1Desc')}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-1">{t('aboutUs.feature2')}</h3>
            <p className="text-xs text-gray-600">{t('aboutUs.feature2Desc')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold mb-2">Çeviri Dosya Konumları:</h3>
        <ul className="text-sm space-y-1">
          <li>📁 public/locales/tr/common.json (Türkçe)</li>
          <li>📁 public/locales/en/common.json (İngilizce)</li>
        </ul>
        
        <h3 className="font-bold mt-4 mb-2">Yeni Çeviri Ekleme:</h3>
        <code className="block bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto">
{`"yeniBolum": {
  "key1": "Türkçe metin",
  "key2": "Başka metin"
}`}
        </code>

        <p className="text-sm text-gray-600 mt-2">
          Sonra component'te şu şekilde kullan:
        </p>
        <code className="block bg-gray-800 text-white p-2 rounded text-xs mt-1">
          {`{t('yeniBoum.key1')}`}
        </code>
      </div>
    </div>
  );
}

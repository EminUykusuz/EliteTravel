// src/utils/seoHelper.js
// Basit SEO sistemi - sabit meta tags

export const SEO = {
  setPageMeta: (title, description, image) => {
    // Title
    document.title = `${title} | Elite Travel`;

    // Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = description || 'Elite Travel - Profesyonel Turizm Rehberleri ve Turlar';

    // OG Tags
    SEO.setOgTag('og:title', title || 'Elite Travel');
    SEO.setOgTag('og:description', description || 'Elite Travel - Profesyonel Turizm Rehberleri ve Turlar');
    SEO.setOgTag('og:image', image || '/og-image.jpg');
    SEO.setOgTag('og:url', window.location.href);

    // Twitter Tags
    SEO.setTwitterTag('twitter:title', title || 'Elite Travel');
    SEO.setTwitterTag('twitter:description', description || 'Elite Travel - Profesyonel Turizm Rehberleri ve Turlar');
    SEO.setTwitterTag('twitter:image', image || '/og-image.jpg');
  },

  setOgTag: (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  },

  setTwitterTag: (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = content;
  },

  // Sabit SEO tanımları
  pages: {
    home: {
      title: 'Anasayfa',
      description: 'Elite Travel ile unutulmaz turizm deneyimleri yaşayın. Profesyonel rehberler, eksklusif turlar ve harika fırsatlar.',
      image: '/images/hero.jpg'
    },
    tours: {
      title: 'Turlar',
      description: 'Tüm turlarımızı keşfedin. Farklı temalarda, fiyatlarda ve sürelerde özel tasarlanmış tur paketleri.',
      image: '/images/tours-banner.jpg'
    },
    about: {
      title: 'Hakkında',
      description: 'Elite Travel hakkında bilgi edinin. Yılların deneyimi, binlerce mutlu müşteri ve en iyi rehbeler.',
      image: '/images/about.jpg'
    },
    contact: {
      title: 'İletişim',
      description: 'Bizimle iletişime geçin. Sorularınız, önerileriniz ve rezervasyonlarınız için hemen bize yazın.',
      image: '/images/contact.jpg'
    }
  }
};

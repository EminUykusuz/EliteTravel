import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

// --- DÜZELTME: 'process is not defined' Hatasını Düzelt ---
// API_URL'i component dışına, sabit bir değişken olarak al
// (Eğer .env kullanmıyorsan, doğrudan 'https://localhost:44361' yaz)
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:44361';
// --- DÜZELTME SONU ---

/**
 * Bu component, C# API'sinden dinamik olarak SEO verilerini çeker.
 * 'sayfaTipi' (örn: "hakkimizda", "blog") prop'unu alır.
 * Eğer dinamik bir rota ise (örn: /blog/:slug), URL'den 'slug' veya 'id'yi
 * otomatik olarak yakalar ve API'ye 'sayfaId' olarak gönderir.
 */
function SeoWrapper({ children, sayfaTipi }) {
  // URL'den 'slug' veya 'id' parametresini yakala.
  // App.js'teki Route'un path'i ile eşleşmeli (örn: /blog/:slug veya /urun/:id)
  const params = useParams();
  const slugOrId = params.slug || params.id || null;

  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSeoData = useCallback(async () => {
    setLoading(true);
    try {
      // Dinamik sayfaId (slugOrId) varsa 'sayfaId' olarak, yoksa 'null' (sayfaTipi) olarak yolla
      const url = slugOrId
        ? `${API_URL}/api/Seo?sayfaTipi=${sayfaTipi}&sayfaId=${slugOrId}` // Detay sayfası (örn: blog/1)
        : `${API_URL}/api/Seo?sayfaTipi=${sayfaTipi}`; // Genel sayfa (örn: hakkimizda)
        
      const seoResponse = await fetch(url);
      
      if (!seoResponse.ok) {
        throw new Error(`API Hatası: ${seoResponse.status}`);
      }
      
      const seoResult = await seoResponse.json();
      
      if (seoResult.success) {
        setSeoData(seoResult.data);
      } else {
        // API 'success: false' dönerse
        console.warn(`SEO verisi bulunamadı: ${sayfaTipi} (${slugOrId})`);
        setSeoData(null); // Veri yoksa null'a çek
      }
    } catch (error) {
      console.error('SEO verisi yüklenemedi:', error);
      setSeoData(null); // Hata durumunda null'a çek
    } finally {
      setLoading(false);
    }
  }, [sayfaTipi, slugOrId]); // API_URL bağımlılıktan kaldırıldı

  // 'sayfaTipi' veya 'slugOrId' değiştiğinde SEO verisini yeniden çek
  useEffect(() => {
    fetchSeoData();
  }, [fetchSeoData]); // fetchSeoData artık useCallback'e bağlı

  // Veri yüklenirken (veya hata olduysa) varsayılan başlığı göster
  const getTitle = () => {
    if (loading) return 'Sayfa Yükleniyor...';
    if (!seoData || !seoData.title) {
      // API'den veri gelmezse, 'sayfaTipi'ne göre bir varsayılan başlık üret
      const defaultTitle = sayfaTipi.charAt(0).toUpperCase() + sayfaTipi.slice(1);
      return `${defaultTitle} | Uykusuz Pen`;
    }
    return seoData.title; // API'den gelen başlık
  };

  const getDescription = () => {
    if (loading || !seoData || !seoData.metaDescription) {
      return 'Kaliteli PVC pencere, kapı ve cam balkon sistemleri.';
    }
    return seoData.metaDescription;
  };

  const getKeywords = () => {
    if (loading || !seoData || !seoData.metaKeywords) {
      return 'pvc pencere, pvc kapı, cam balkon, uykusuz pen';
    }
    return seoData.metaKeywords;
  };

  return (
    <>
      <Helmet>
        <title>{getTitle()}</title>
        <meta name="description" content={getDescription()} />
        <meta name="keywords" content={getKeywords()} />
        
        {/* Open Graph (Facebook, LinkedIn vb.) etiketleri */}
        <meta property="og:title" content={getTitle()} />
        <meta property="og:description" content={getDescription()} />
        {/* <meta property="og:image" content=".../logo.png" /> */}
      </Helmet>
      
      {/* Helmet etiketlerini bastıktan sonra,
        ona 'children' (çocuk) olarak gelen asıl component'i
        (örn: <AboutUs /> veya <BlogDetay />) render et.
      */}
      {children}
    </>
  );
}

export default SeoWrapper;


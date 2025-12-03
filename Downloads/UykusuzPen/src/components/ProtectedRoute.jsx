import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Bu bileşen, içine aldığı 'children'ı (yani AdminPanel'i)
 * sadece backend'deki /api/AdminAuth/check endpoint'i onay verirse gösterir.
 * Onay alamazsa (401 hatası vb.) kullanıcıyı login sayfasına atar.
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // 1. Backend'e "Giriş yapmış mıyım?" diye sor
        //    'withCredentials: true' cookie'yi göndermesi için ŞART
        const response = await axios.get(
          "https://localhost:44361/api/AdminAuth/check",
          { withCredentials: true }
        );

        // 2. Başarılı (200 OK) cevabı gelirse, giriş yapmışsın
        if (response.status === 200 && response.data.success) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // 3. Hata (401 Yetkisiz) gelirse, giriş yapmamışsın
        console.error("Yetkilendirme hatası. Login sayfasına yönlendiriliyor.");
        setIsAuthenticated(false);
        // Navigate bileşeni renderda halledeceği için burada navigate() demeye gerek yok
      } finally {
        // 4. Kontrol bitti, "Yükleniyor..." ekranını kaldır
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []); // Bu useEffect sadece sayfa ilk yüklendiğinde 1 kez çalışır

  // API'den cevap gelene kadar "Yükleniyor..." göster
  if (isLoading) {
    // Burayı dilediğin gibi güzelleştirebilirsin (Spinner vb.)
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#222', 
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        Admin paneli yükleniyor, yetki kontrol ediliyor...
      </div>
    );
  }

  // API cevabı geldi:
  // - Eğer yetkili (true) ise, 'children'ı (yani AdminPanel'i) göster.
  // - Eğer yetkili değil (false) ise, login sayfasına yönlendir.
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;

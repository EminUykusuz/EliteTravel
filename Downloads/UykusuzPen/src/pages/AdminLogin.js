import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      UserName: username,
      Password: password,
    };

    try {
     
      const response = await axios.post(
        "https://localhost:44361/api/AdminAuth/login", // <-- DOĞRUSU BU (Auth)
        payload,
        { withCredentials: true }
      );

      
      if (response.status === 200 && response.data.success) {
        
 
     
        
        window.location.href = "/admin/dashboard"; 
      
      } else {
      
        setError(response.data.message || "Giriş başarısız oldu.");
      }

    } catch (err) {
      // 401 Unauthorized (Yetkisiz) gibi bir http hatası gelirse
      console.error(err);
      setError(err.response?.data?.message || "Kullanıcı adı veya şifre yanlış.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#302e2e]">
      <div className="w-[400px] rounded-xl p-8 flex flex-col gap-6 text-white shadow-[0_15px_25px_rgba(0,0,0,0.6)] bg-black/70 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center tracking-wide">
          Admin Giriş
        </h2>

        {error && (
          <p className="text-red-500 text-sm font-semibold text-center">
            {error}
          </p>
        )}
        
        {/* --- ÇÖZÜM 2: DOĞRU ŞİFREYİ DENEDİĞİNDEN EMİN OL --- */}
        <p className="text-xs text-center text-gray-400">
          (Varsayılan şifren: <strong className="text-yellow-400">GüçlüAdminŞifre123!</strong>)
        </p>
        {/* ------------------------------------------------------ */}


        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              required
              className="w-full px-4 py-3 rounded-lg bg-transparent border-b border-white text-white placeholder:text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full px-4 py-3 rounded-lg bg-transparent border-b border-white text-white placeholder:text-white focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          <button
            type="submit"
            className="relative px-6 py-3 mt-6 mx-auto text-white font-bold uppercase overflow-hidden rounded-md hover:bg-red-600 transition-colors duration-300"
          >
            Giriş Yap
            <span className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent to-red-500 animate-btn-anim1"></span>
            <span className="absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent to-red-500 animate-btn-anim2"></span>
            <span className="absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-l from-transparent to-red-500 animate-btn-anim3"></span>
            <span className="absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent to-red-500 animate-btn-anim4"></span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
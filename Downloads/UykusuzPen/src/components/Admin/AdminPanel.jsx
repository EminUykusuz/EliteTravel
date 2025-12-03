import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import Logo from "../../logo.png";

const AdminPanel = () => {
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = 'https://localhost:44361/api';

  // Logout Fonksiyonu
  const handleLogout = async () => {
    console.log("Çıkış yapılıyor...");
    
    try {
      // Backend'deki 'logout' endpoint'ine istek at (cookie'yi silmesi için)
      await fetch(
        `${API_BASE_URL}/Auth/logout`,
        { 
          method: 'POST',
          credentials: 'include' // Cookie'yi göndermesi için ŞART
        }
      );
      
      // Başarılı olunca login sayfasına yönlendir
      navigate("/admin/login", { replace: true });

    } catch (error) {
      console.error("Çıkış yaparken hata:", error);
      // Hata alsa bile kullanıcıyı login'e atmak güvenlidir
      navigate("/admin/login", { replace: true });
    }
  };

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/urunler", label: "Ürün Yönetimi", icon: <Package size={20} /> },
    { to: "/admin/mesajlar", label: "Mesajlar", icon: <MessageSquare size={20} /> },
    { to: "/admin/addgaleri", label: "Projeler", icon: <ImageIcon size={20} /> },
    { to: "/admin/Blog", label: "Blog", icon: <ImageIcon size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md shadow-red-200/50 rounded-r-md flex flex-col justify-between">
        <div>
          {/* Logo Alanı */}
          <div className="flex items-center justify-center py-6 border-b border-gray-200">
            <img src={Logo} alt="Logo" className="h-16 w-auto" />
          </div>

          {/* Menü */}
          <ul className="w-full flex flex-col gap-2 p-4">
            {menuItems.map((item, i) => (
              <li key={i} className="flex-center cursor-pointer w-full">
                <Link
                  to={item.to}
                  className="flex items-center gap-4 w-full p-4 font-semibold rounded-full transition-all ease-linear text-gray-700 
                             hover:bg-red-100 hover:shadow-inner focus:bg-gradient-to-r focus:from-red-500 focus:to-red-700 
                             focus:text-white group"
                >
                  <span className="group-focus:stroke-white group-focus:fill-white">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 font-semibold rounded-full transition-all ease-linear text-gray-700 
                       hover:bg-red-100 hover:shadow-inner focus:bg-gradient-to-r focus:from-red-500 focus:to-red-700 
                       focus:text-white group"
          >
            <LogOut className="group-focus:stroke-white group-focus:fill-white" size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* İçerik */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
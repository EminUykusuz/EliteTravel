import { Outlet, NavLink, Link } from 'react-router-dom';

const AdminLayout = () => {
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? "text-yellow-400 font-bold flex items-center gap-2 bg-slate-800 p-2 rounded" 
      : "text-gray-300 hover:text-white hover:bg-slate-700 p-2 rounded transition flex items-center gap-2";

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold tracking-wide text-white">Elite Admin</h2>
            <span className="text-xs text-slate-400">Yönetim Paneli</span>
        </div>

       <nav className="flex flex-col gap-2 p-4 flex-1">
  <NavLink to="/admin" end className={getLinkClass}>
    <span>📊</span> Dashboard
  </NavLink>

  {/* ESKİ - Bunları kaldır */}
  {/* <NavLink to="/admin/tours" end className={getLinkClass}>
    <span>📦</span> Tüm Turlar
  </NavLink>
  <NavLink to="/admin/tours/new" className={getLinkClass}>
    <span>➕</span> Yeni Tur Ekle
  </NavLink> */}

  {/* YENİ - Tek link */}
  <NavLink to="/admin/tours" className={getLinkClass}>
    <span>🎯</span> Tur Yönetimi
  </NavLink>

  <NavLink to="/admin/seo" className={getLinkClass}>
    <span>🔍</span> SEO Ayarları
  </NavLink>
</nav>

        {/* Alt Kısım */}
        <div className="p-4 border-t border-slate-700">
            <Link to="/" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm">
                <span>⬅️</span> Siteye Dön
            </Link>
        </div>
      </aside>

      {/* İÇERİK ALANI */}
      <main className="flex-1 overflow-y-auto h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Üstte header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-gray-600 font-semibold">Hoşgeldin, Admin 👋</h1>
            <button className="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition">
              Çıkış Yap
            </button>
        </header>

        {/* Sayfa İçeriği - padding'i kaldırdım çünkü dashboard kendi padding'ini kullanıyor */}
        <div className="pb-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
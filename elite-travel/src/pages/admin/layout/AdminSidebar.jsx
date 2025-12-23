import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  Tag, 
  Users, 
  Calendar, 
  UserCircle,
  Settings,
  LogOut,
  ChevronRight,
  Menu, // 👈 YENİ: Menu icon'u eklendi
  Mail, // 👈 YENİ: Mail icon'u eklendi
  Shield // 👈 YENİ: Shield icon'u eklendi
} from 'lucide-react';
import eliteLogo from '../../../assets/elitelogo.svg';

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/tours', label: 'Turlar', icon: Map },
    { path: '/admin/categories', label: 'Kategoriler', icon: Tag },
    { path: '/admin/guides', label: 'Rehberler', icon: UserCircle },
    { path: '/admin/bookings', label: 'Rezervasyonlar', icon: Calendar },
    { path: '/admin/users', label: 'Kullanıcılar', icon: Users },
    { path: '/admin/messages', label: 'İletişim Mesajları', icon: Mail },
    { path: '/admin/menu-items', label: 'Menü Yönetimi', icon: Menu },
    { path: '/admin/security', label: 'Güvenlik (2FA)', icon: Shield },
    { path: '/admin/settings', label: 'Ayarlar', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-0'
      } overflow-hidden shadow-2xl z-50`}
    >
      <div className="p-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 pb-6 border-b border-gray-700"
        >
          <img 
            src={eliteLogo} 
            alt="Elite Travel Logo" 
            className="h-16 w-auto mb-2"
          />
          <p className="text-xs text-gray-400 ml-1">Admin Panel</p>
        </motion.div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#133d59] to-slate-900 text-white shadow-lg ring-1 ring-[#f3b41b]/40'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-[#f3b41b]' : 'text-gray-400 group-hover:text-[#f3b41b]'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="w-4 h-4 text-[#f3b41b]" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 mt-8 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-all border border-red-500/20"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Çıkış Yap</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

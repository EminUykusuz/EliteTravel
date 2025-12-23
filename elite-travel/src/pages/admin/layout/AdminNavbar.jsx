import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, ChevronDown, LogOut, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = authService.getUser();

  // Gelen mesajları yükle
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/contacts?isRead=false&pageSize=5');
        if (response.data?.data?.items) {
          setNotifications(response.data.data.items);
          setUnreadCount(response.data.data.items.length);
        }
      } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Her 30 saniyede güncelle
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    navigate('/admin/messages');
    setShowNotifications(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-lg"
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </motion.button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f3b41b] focus:border-transparent w-80 transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#f3b41b]/20 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#133d59]" />
                    <h3 className="font-bold text-gray-800">Yeni Mesajlar</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>

                {/* Messages List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={handleNotificationClick}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#133d59] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ring-1 ring-[#f3b41b]">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {msg.firstName} {msg.lastName}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">{msg.email}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{msg.message}</p>
                          </div>
                          {!msg.isRead && (
                            <div className="w-2.5 h-2.5 bg-[#f3b41b] rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Yeni mesaj yok</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <motion.button
                    whileHover={{ opacity: 0.9 }}
                    onClick={handleNotificationClick}
                    className="w-full px-6 py-3 bg-[#133d59] text-white text-sm font-semibold hover:bg-[#f3b41b] hover:text-[#133d59] transition-colors border-t border-[#f3b41b]/20"
                  >
                    Tümünü Gör ({unreadCount})
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="relative">
                <div className="w-11 h-11 bg-[#133d59] rounded-xl flex items-center justify-center shadow-lg ring-1 ring-[#f3b41b]">
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"></span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
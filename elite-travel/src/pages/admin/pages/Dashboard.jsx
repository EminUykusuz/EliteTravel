import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign, Eye, ArrowUpRight, ArrowDownRight, BarChart3, LineChart, AlertCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookingService, userService, tourService, settingsService } from '../../../serivces/genericService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasAnalytics, setHasAnalytics] = useState(false);
  const [analyticsId, setAnalyticsId] = useState('');
  const [stats, setStats] = useState([
    { 
      icon: Eye, 
      label: 'Site Ziyaretçileri', 
      value: '-', 
      change: '',
      trend: 'neutral',
      color: 'from-amber-400 to-amber-600',
      lightColor: 'from-amber-50 to-orange-50'
    },
    { 
      icon: Users, 
      label: 'Kullanıcılar', 
      value: '0', 
      change: '',
      trend: 'neutral',
      color: 'from-blue-400 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50'
    },
    { 
      icon: Calendar, 
      label: 'Rezervasyonlar', 
      value: '0', 
      change: '',
      trend: 'neutral',
      color: 'from-teal-400 to-emerald-500',
      lightColor: 'from-teal-50 to-emerald-50'
    },
    { 
      icon: DollarSign, 
      label: 'Gelir', 
      value: '€0', 
      change: '',
      trend: 'neutral',
      color: 'from-yellow-400 to-orange-500',
      lightColor: 'from-yellow-50 to-orange-50'
    },
  ]);

  const [chartData, setChartData] = useState({
    monthly: [],
    weekly: []
  });

  // API'den istatistik yükle
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Google Analytics kontrolü
        const settingsResponse = await settingsService.getAll();
        const settingsData = settingsResponse.data ? settingsResponse.data[0] : settingsResponse[0];
        if (settingsData?.googleAnalytics) {
          setHasAnalytics(true);
          setAnalyticsId(settingsData.googleAnalytics);
        }

        const [bookings, users, tours] = await Promise.all([
          bookingService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          tourService.getAll().catch(() => [])
        ]);

        // Tarih hesaplamaları için yardımcı fonksiyonlar
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Bu ay ve geçen ay verilerini filtrele
        const thisMonthBookings = bookings.filter(b => {
          if (!b.bookingDate && !b.createdAt && !b.createdDate) return false;
          const date = new Date(b.bookingDate || b.createdAt || b.createdDate);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const lastMonthBookings = bookings.filter(b => {
          if (!b.bookingDate && !b.createdAt && !b.createdDate) return false;
          const date = new Date(b.bookingDate || b.createdAt || b.createdDate);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });

        const thisMonthUsers = users.filter(u => {
          if (!u.createdAt && !u.createdDate) return false;
          const date = new Date(u.createdAt || u.createdDate);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const lastMonthUsers = users.filter(u => {
          if (!u.createdAt && !u.createdDate) return false;
          const date = new Date(u.createdAt || u.createdDate);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });

        // Gelir hesaplamaları
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const thisMonthRevenue = thisMonthBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

        // Değişim yüzdelerini hesapla
        const calculateChange = (current, previous) => {
          if (previous === 0) return current > 0 ? '+100%' : '0%';
          const change = ((current - previous) / previous * 100).toFixed(1);
          return change >= 0 ? `+${change}%` : `${change}%`;
        };

        const calculateTrend = (current, previous) => {
          if (current > previous) return 'up';
          if (current < previous) return 'down';
          return 'neutral';
        };

        // Kullanıcı değişimi
        const userChange = calculateChange(thisMonthUsers.length, lastMonthUsers.length);
        const userTrend = calculateTrend(thisMonthUsers.length, lastMonthUsers.length);

        // Rezervasyon değişimi
        const bookingChange = calculateChange(thisMonthBookings.length, lastMonthBookings.length);
        const bookingTrend = calculateTrend(thisMonthBookings.length, lastMonthBookings.length);

        // Gelir değişimi
        const revenueChange = calculateChange(thisMonthRevenue, lastMonthRevenue);
        const revenueTrend = calculateTrend(thisMonthRevenue, lastMonthRevenue);

        // Istatistikleri güncelle
        const updatedStats = [
          { 
            icon: Eye, 
            label: 'Site Ziyaretçileri', 
            value: '-', 
            change: '',
            trend: 'neutral',
            color: 'from-amber-400 to-amber-600',
            lightColor: 'from-amber-50 to-orange-50'
          },
          { 
            icon: Users, 
            label: 'Kullanıcılar', 
            value: users.length.toString(), 
            change: userChange,
            trend: userTrend,
            color: 'from-blue-400 to-cyan-500',
            lightColor: 'from-blue-50 to-cyan-50'
          },
          { 
            icon: Calendar, 
            label: 'Rezervasyonlar', 
            value: bookings.length.toString(), 
            change: bookingChange,
            trend: bookingTrend,
            color: 'from-teal-400 to-emerald-500',
            lightColor: 'from-teal-50 to-emerald-50'
          },
          { 
            icon: DollarSign, 
            label: 'Gelir', 
            value: `€${totalRevenue.toFixed(2)}`, 
            change: revenueChange,
            trend: revenueTrend,
            color: 'from-yellow-400 to-orange-500',
            lightColor: 'from-yellow-50 to-orange-50'
          },
        ];
        setStats(updatedStats);

        // Grafik verilerini hazırla (son 6 ay)
        const monthlyData = [];
        const weeklyData = [];
        
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date(currentYear, currentMonth - i, 1);
          const month = monthDate.getMonth();
          const year = monthDate.getFullYear();
          
          const monthBookings = bookings.filter(b => {
            if (!b.bookingDate && !b.createdAt && !b.createdDate) return false;
            const date = new Date(b.bookingDate || b.createdAt || b.createdDate);
            return date.getMonth() === month && date.getFullYear() === year;
          });
          
          monthlyData.push({
            month: monthDate.toLocaleDateString('tr-TR', { month: 'short' }),
            value: monthBookings.length
          });
        }

        // Son 7 günlük veri
        for (let i = 6; i >= 0; i--) {
          const dayDate = new Date();
          dayDate.setDate(dayDate.getDate() - i);
          const dayStart = new Date(dayDate.setHours(0, 0, 0, 0));
          const dayEnd = new Date(dayDate.setHours(23, 59, 59, 999));
          
          const dayBookings = bookings.filter(b => {
            if (!b.bookingDate && !b.createdAt && !b.createdDate) return false;
            const date = new Date(b.bookingDate || b.createdAt || b.createdDate);
            return date >= dayStart && date <= dayEnd;
          });
          
          weeklyData.push({
            day: dayDate.toLocaleDateString('tr-TR', { weekday: 'short' }),
            value: dayBookings.length
          });
        }

        setChartData({ monthly: monthlyData, weekly: weeklyData });
      } catch (error) { /* ignored */ }
    };

    loadStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const maxValue = Math.max(...chartData.monthly.map(d => d.value));
  const maxWeekly = Math.max(...chartData.weekly.map(d => d.value));

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz! İşte güncel istatistikleriniz.</p>
      </motion.div>

      {/* Google Analytics Uyarısı */}
      {!hasAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Google Analytics Kurulumu Gerekli
              </h3>
              <p className="text-amber-800 mb-4">
                Site ziyaretçi istatistiklerini görebilmek için Google Analytics kodunu girmelisiniz.
                Analytics kodu girdikten sonra bu dashboard detaylı ziyaretçi verilerini gösterecektir.
              </p>
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Ayarlara Git ve Analytics Kodunu Gir
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Google Analytics Embed (Kod varsa) */}
      {hasAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Google Analytics</h2>
                <p className="text-sm text-gray-600">ID: {analyticsId}</p>
              </div>
            </div>
            <a
              href={`https://analytics.google.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Analytics Panelini Aç
            </a>
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p className="font-medium mb-2">✅ Google Analytics aktif ve veri topluyor</p>
            <p>Detaylı raporları görmek için yukarıdaki butona tıklayarak Google Analytics paneline gidin.</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 hover:border-amber-300 hover:shadow-2xl p-6 cursor-pointer group transition-all duration-300"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative">
              {/* Icon & Change */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>

              {/* Value & Label */}
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Aylık Gelir</h2>
              <p className="text-sm text-gray-500">Son 6 ayın performansı</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-6">
            {chartData.monthly.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.05) }}
              >
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                  <span className="text-lg font-bold text-amber-600">₺{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + (i * 0.05), duration: 0.6 }}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Haftalık Ziyaretçiler</h2>
              <p className="text-sm text-gray-500">Bu hafta sitesi ziyaret eden kullanıcı sayısı</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-md">
              <LineChart className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2">
            {chartData.weekly.map((item, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxWeekly) * 100}%` }}
                transition={{ delay: 0.4 + (i * 0.05), duration: 0.6 }}
                className="flex-1 bg-gradient-to-t from-blue-400 to-cyan-500 rounded-t-lg rounded-b cursor-pointer hover:shadow-lg transition-all group relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: -10 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap"
                >
                  {item.value}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6 text-xs text-gray-500">
            {chartData.weekly.map((item, i) => (
              <span key={i} className="font-medium text-gray-600">{item.day}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
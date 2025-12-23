import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign, Eye, ArrowUpRight, ArrowDownRight, BarChart3, LineChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookingService, userService, tourService } from '../../../serivces/genericService';

export default function Dashboard() {
  const [stats, setStats] = useState([
    { 
      icon: Eye, 
      label: 'Site Ziyaretçileri', 
      value: '1,234', 
      change: '+12%',
      trend: 'up',
      color: 'from-amber-400 to-amber-600',
      lightColor: 'from-amber-50 to-orange-50'
    },
    { 
      icon: Users, 
      label: 'Kullanıcılar', 
      value: '0', 
      change: '0%',
      trend: 'neutral',
      color: 'from-blue-400 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50'
    },
    { 
      icon: Calendar, 
      label: 'Rezervasyonlar', 
      value: '0', 
      change: '0%',
      trend: 'neutral',
      color: 'from-teal-400 to-emerald-500',
      lightColor: 'from-teal-50 to-emerald-50'
    },
    { 
      icon: DollarSign, 
      label: 'Gelir', 
      value: '₺0', 
      change: '0%',
      trend: 'neutral',
      color: 'from-yellow-400 to-orange-500',
      lightColor: 'from-yellow-50 to-orange-50'
    },
  ]);

  const [chartData, setChartData] = useState({
    monthly: [
      { month: 'Ocak', value: 400 },
      { month: 'Şubat', value: 600 },
      { month: 'Mart', value: 800 },
      { month: 'Nisan', value: 550 },
      { month: 'Mayıs', value: 900 },
      { month: 'Haziran', value: 1100 },
    ],
    weekly: [
      { day: 'Pz', value: 120 },
      { day: 'Tş', value: 150 },
      { day: 'Ço', value: 180 },
      { day: 'Pe', value: 200 },
      { day: 'Cu', value: 250 },
      { day: 'Ct', value: 300 },
      { day: 'Pz', value: 280 },
    ]
  });

  // API'den istatistik yükle
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [bookings, users, tours] = await Promise.all([
          bookingService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
          tourService.getAll().catch(() => [])
        ]);

        // Toplam gelir hesapla
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

        // Istatistikleri güncelle
        const updatedStats = [
          { 
            icon: Eye, 
            label: 'Site Ziyaretçileri', 
            value: '1,234', 
            change: '+12%',
            trend: 'up',
            color: 'from-amber-400 to-amber-600',
            lightColor: 'from-amber-50 to-orange-50'
          },
          { 
            icon: Users, 
            label: 'Kullanıcılar', 
            value: users.length.toString(), 
            change: '0%',
            trend: 'neutral',
            color: 'from-blue-400 to-cyan-500',
            lightColor: 'from-blue-50 to-cyan-50'
          },
          { 
            icon: Calendar, 
            label: 'Rezervasyonlar', 
            value: bookings.length.toString(), 
            change: '0%',
            trend: 'neutral',
            color: 'from-teal-400 to-emerald-500',
            lightColor: 'from-teal-50 to-emerald-50'
          },
          { 
            icon: DollarSign, 
            label: 'Gelir', 
            value: `€${totalRevenue.toFixed(2)}`, 
            change: '0%',
            trend: 'neutral',
            color: 'from-yellow-400 to-orange-500',
            lightColor: 'from-yellow-50 to-orange-50'
          },
        ];
        setStats(updatedStats);
      } catch (error) {
        console.error('İstatistikler yüklenemedi:', error);
      }
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
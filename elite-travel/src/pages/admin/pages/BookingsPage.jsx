import { motion } from 'framer-motion';
import { Wrench, AlertCircle } from 'lucide-react';

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Rezervasyonlar</h1>
        <p className="text-gray-600">Tüm tur rezervasyonlarını yönetme alanı</p>
      </motion.div>

      {/* Under Development Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center py-24 px-6"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl">
              <Wrench className="w-12 h-12 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Çalışma Altında</h2>
            <p className="text-gray-600 text-lg mb-4">
              Rezervasyonlar modülü şu anda geliştirilmektedir. 
              Yakında tüm rezervasyonlarınızı buradan yönetebileceksiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Yakında Gelecek Özellikler:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Tüm rezervasyonları görüntüle</li>
                  <li>✓ Rezervasyonları filtrele ve ara</li>
                  <li>✓ Rezervasyon detaylarını incele</li>
                  <li>✓ Rezervasyonları onayla veya reddet</li>
                  <li>✓ İstatistikler ve raporlar</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
              Haberin Olun
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
              Geri Dön
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <h3 className="text-center text-gray-700 font-semibold mb-6 text-lg">Şu sırada yapabilecekleriniz:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Turları Yönet', icon: '🗺️', desc: 'Tur bilgilerini düzenle ve yayınla' },
            { title: 'Müşterileri Görüntüle', icon: '👥', desc: 'Tüm kullanıcıları ve profillerini incele' },
            { title: 'İletişim Mesajları', icon: '💬', desc: 'Müşteri mesajlarına yanıt ver' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingService } from '../../services/bookingService';
import { showSuccess, showError, showLoading, closeLoading } from '../../utils/alerts';

export default function BookingSection({ tour, tourPrice }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    guestCount: 1,
    departureDate: '',
    specialRequests: '',
  });

  const [totalPrice, setTotalPrice] = useState(tourPrice);
  const userId = localStorage.getItem('userId'); // Kullanıcı giriş yapmış mı kontrol et
  const currencySymbol = tour?.currency === 'EUR' ? '€' : tour?.currency === 'TRY' ? '₺' : '$';

  // Fiyat hesapla
  useEffect(() => {
    const calculatedPrice = (tourPrice * formData.guestCount).toFixed(2);
    setTotalPrice(calculatedPrice);
  }, [formData.guestCount, tourPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'guestCount' ? parseInt(value) : value
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validasyon
    if (!formData.guestCount || formData.guestCount < 1) {
      showError(t('booking.validation.guestCountRequired'));
      return;
    }

    if (!formData.departureDate) {
      showError(t('booking.validation.departureDateRequired'));
      return;
    }

    if (!userId) {
      showError(t('booking.validation.loginRequired'));
      return;
    }

    showLoading();

    try {
      const bookingData = {
        userId: parseInt(userId),
        tourId: tour.id,
        guestCount: formData.guestCount,
        totalPrice: parseFloat(totalPrice),
        status: 'Pending',
        note: formData.specialRequests,
        isActive: true
      };

      const response = await bookingService.create(bookingData);
      closeLoading();
      
      if (response.success || response.statusCode === 201) {
        showSuccess(t('booking.success'));
        
        // Formu sıfırla
        setFormData({
          guestCount: 1,
          departureDate: '',
          specialRequests: '',
        });

        // Admin'e bildirim gönder (opsiyonel)
        console.log('Yeni rezervasyon:', bookingData);
      } else {
        showError(response.message || t('booking.errors.createFailed'));
      }
    } catch (error) {
      closeLoading();
      console.error('Booking error:', error);
      showError(error.response?.data?.message || t('booking.errors.createError'));
    }
  };

  const whatsappText = encodeURIComponent(
    t('booking.whatsapp.prefilledMessage', { tourTitle: tour?.title || '' })
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-elite-dark mb-6 flex items-center gap-3">
        <CheckCircle className="text-elite-gold" size={28} />
        {t('booking.title')}
      </h2>

      <form onSubmit={handleBooking} className="space-y-6">
        {/* Misafir Sayısı */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users size={18} className="text-elite-gold" />
            {t('booking.fields.guestCount')}
          </label>
          <select
            name="guestCount"
            value={formData.guestCount}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {t('booking.guest', { count: num })}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {t('booking.capacity', { capacity: tour?.capacity ?? '' })}
          </p>
        </div>

        {/* Başlangıç Tarihi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-elite-gold" />
            {t('booking.fields.departureDate')}
          </label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('booking.hints.departureDateMinDays', { days: 7 })}
          </p>
        </div>

        {/* Özel Talep */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare size={18} className="text-elite-gold" />
            {t('booking.fields.specialRequests')}
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            placeholder={t('booking.placeholders.specialRequests')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows="3"
          />
        </div>

        {/* Fiyat Özeti */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>{t('booking.summary.perPerson')}:</span>
              <span className="font-semibold">{currencySymbol}{tourPrice}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t('booking.summary.guestCount')}:</span>
              <span className="font-semibold">{formData.guestCount}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-elite-dark">
              <span>{t('booking.summary.total')}:</span>
              <span className="text-elite-gold">{currencySymbol}{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Giriş Uyarısı */}
        {!userId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            <p className="font-semibold mb-1">⚠️ {t('booking.loginRequired.title')}</p>
            <p>{t('booking.loginRequired.desc')}</p>
          </div>
        )}

        {/* Submit Buton */}
        <button
          type="submit"
          disabled={!userId}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            userId
              ? 'bg-gradient-to-r from-elite-gold to-yellow-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <CheckCircle size={20} />
          {userId ? t('booking.actions.confirm') : t('booking.actions.loginToBook')}
        </button>

        {/* WhatsApp Alternatifi */}
        <div className="text-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-3">
            {t('booking.whatsapp.trouble')}
          </p>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
          >
            {t('booking.whatsapp.button')}
          </a>
        </div>
      </form>
    </motion.div>
  );
}

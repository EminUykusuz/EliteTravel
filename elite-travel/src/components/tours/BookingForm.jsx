import { useState } from 'react';
import { Calendar, Users, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function BookingForm({ tour }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    tourId: tour.id,
    fullName: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    tourDate: '',
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // API'ye gönderilecek data
      const bookingData = {
        tourId: tour.id,
        userId: null, // Login sistemi varsa buradan alınır
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        numberOfPeople: parseInt(formData.numberOfPeople),
        bookingDate: new Date(formData.tourDate).toISOString(),
        totalPrice: tour.price * parseInt(formData.numberOfPeople),
        status: 'Pending',
        specialRequests: formData.specialRequests
      };

      await bookingService.create(bookingData);
      
      setSuccess(true);
      
      // Formu temizle
      setFormData({
        tourId: tour.id,
        fullName: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        tourDate: '',
        specialRequests: ''
      });

      // 5 saniye sonra success mesajını kaldır
      setTimeout(() => setSuccess(false), 5000);

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || t('common.error') || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = tour.price * parseInt(formData.numberOfPeople || 1);
  const symbol = tour.currency === 'EUR' ? '€' : '₺';

  // Bugünün tarihi (min date için)
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100"
    >
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <Calendar className="text-[#dca725]" size={28} />
        {t('tourDetail.bookNow') || 'Rezervasyon Yap'}
      </h3>

      {/* Success Message */}
      {success && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium"
        >
          ✅ {t('booking.success') || 'Rezervasyonunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.'}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium"
        >
          ❌ {error}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <User size={16} className="inline mr-2" />
            {t('booking.fullName') || 'Ad Soyad'} *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none"
            placeholder={t('booking.fullNamePlaceholder') || 'Ahmet Yılmaz'}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Mail size={16} className="inline mr-2" />
            {t('booking.email') || 'E-posta'} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none"
            placeholder="ahmet@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Phone size={16} className="inline mr-2" />
            {t('booking.phone') || 'Telefon'} *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none"
            placeholder="+90 555 123 45 67"
          />
        </div>

        {/* Number of People */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Users size={16} className="inline mr-2" />
            {t('booking.numberOfPeople') || 'Kişi Sayısı'} *
          </label>
          <input
            type="number"
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min="1"
            max={tour.capacity || 50}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none"
          />
        </div>

        {/* Tour Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            {t('booking.tourDate') || 'Tur Tarihi'} *
          </label>
          <input
            type="date"
            name="tourDate"
            value={formData.tourDate}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <MessageSquare size={16} className="inline mr-2" />
            {t('booking.specialRequests') || 'Özel İstekler'} 
            <span className="text-slate-400 text-xs ml-1">({t('common.optional') || 'Opsiyonel'})</span>
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#163a58] focus:ring-2 focus:ring-[#163a58]/20 transition-all outline-none resize-none"
            placeholder={t('booking.specialRequestsPlaceholder') || 'Özel yemek tercihleri, erişim ihtiyaçları vb.'}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gradient-to-r from-[#163a58] to-[#1e4a6a] text-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-90">{t('booking.pricePerPerson') || 'Kişi Başı'}</span>
            <span className="font-bold">{symbol}{tour.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-90">{t('booking.numberOfPeople') || 'Kişi Sayısı'}</span>
            <span className="font-bold">×{formData.numberOfPeople}</span>
          </div>
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('booking.totalPrice') || 'Toplam Tutar'}</span>
              <span className="text-2xl font-black text-[#dca725]">{symbol}{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#dca725] to-[#c59620] text-[#163a58] hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              {t('common.processing') || 'İşleniyor...'}
            </span>
          ) : (
            t('booking.confirmBooking') || 'Rezervasyonu Tamamla'
          )}
        </motion.button>

        <p className="text-xs text-center text-slate-500 leading-relaxed">
          {t('booking.disclaimer') || 'Rezervasyonunuz onaylandıktan sonra e-posta ve telefon ile bilgilendirileceksiniz.'}
        </p>
      </div>
    </motion.form>
  );
}

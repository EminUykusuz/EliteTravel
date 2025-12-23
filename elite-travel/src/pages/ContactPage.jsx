import React, { useState } from 'react';
import { MapPin, Phone, Send, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Lütfen zorunlu alanları doldurunuz');
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);
      
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      const response = await api.post('/contacts', {
        firstName: firstName,
        lastName: lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
        recaptchaToken: 'dummy-token'
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-[#d4a017] uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-[#d4a017]"></span>
            {t('contact.badge')}
            <span className="w-8 h-[2px] bg-[#d4a017]"></span>
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {t('contact.mainTitle')}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('contact.mainSubtitle')}
          </p>
        </div>

        {/* Main Content Grid - Form and Contact Info Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-10">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.formTitle')}</h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {t('contact.formSubtitle')}
            </p>

            {submitStatus === 'success' && (
              <div className="mb-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3 text-green-800 shadow-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{t('contact.successTitle')}</p>
                  <p className="text-xs mt-1">{t('contact.successMessage')}</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-5 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 text-red-800 shadow-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{t('contact.errorTitle')}</p>
                  <p className="text-xs mt-1">{t('contact.errorMessage')}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  {t('contact.nameLabel')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f3b41b] focus:border-[#f3b41b] transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>

              {/* Phone & Email in one row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    {t('contact.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contact.phonePlaceholder')}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f3b41b] focus:border-[#f3b41b] transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f3b41b] focus:border-[#f3b41b] transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                  rows="5"
                  className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f3b41b] focus:border-[#f3b41b] transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 hover:border-gray-300"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d4a017] to-[#f3b41b] hover:from-[#b8860b] hover:to-[#d4a017] text-white font-bold py-3 px-6 text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('contact.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('contact.sendButton')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Form Footer Note */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500 leading-relaxed">
                {t('contact.formFooter') || 'Vul het formulier in en we nemen zo snel mogelijk contact met u op. U kunt ook contact met ons opnemen via WhatsApp.'}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Info Only */}
          <div className="space-y-5">
            {/* Phone & WhatsApp Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-0.5">{t('contact.phoneTitle')}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <a
                  href="tel:+31621525757"
                  className="flex items-center gap-3 text-gray-900 font-bold text-base hover:text-[#f3b41b] transition-all duration-200 hover:translate-x-1"
                >
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  +31 6 21525757
                </a>
                
                <a
                  href="https://wa.me/31621525757"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] font-bold text-sm transition-all duration-300 rounded-lg p-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('contact.whatsappButton')}
                </a>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3">
                  <p className="text-xs text-blue-900 leading-relaxed">
                    <span className="font-semibold">💡 {t('contact.tipLabel')}:</span> {t('contact.tipMessage')}
                  </p>
                </div>
              </div>
            </div>

            {/* Office Info Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f3b41b] to-[#d4a017] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-0.5">{t('contact.officeTitle')}</h3>
                  <p className="text-xs font-medium text-gray-500">Elite Travel</p>
                </div>
              </div>
              
              <div className="space-y-1.5 text-gray-700 leading-relaxed">
                <p className="font-semibold text-base">Leemansweg 27G</p>
                <p className="text-sm">6827 BX Arnhem</p>
                <p className="text-sm font-medium">Nederland</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps - Full Width Below */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="relative w-full h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2450.9891234567!2d5.8978!3d51.9805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7a4c5a5a5a5a5%3A0xa5a5a5a5a5a5a5a5!2sLeemansweg%2027%2C%206827%20BX%20Arnhem%2C%20Netherlands!5e0!3m2!1sen!2str!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              {t('contact.officeStatus')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
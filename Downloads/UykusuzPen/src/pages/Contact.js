import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    experience: 0,
    projects: 0,
    satisfaction: 0
  });
  const statsRef = useRef(null);

  const projectTypes = [
    'Kapı ve Pencere',
    'Pergola ve Tente',
    'Cam Balkon',
    'Wintergarten',
    'Ticari Projeler',
    'Konut Projeleri',
    'Diğer'
  ];

  // Stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);

          const duration = 2000;
          const frames = 60;
          const increment = duration / frames;

          let frame = 0;
          const animate = () => {
            frame++;
            const progress = frame / frames;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setAnimatedStats({
              experience: Math.round(15 * easeOut),
              projects: Math.round(500 * easeOut),
              satisfaction: Math.round(98 * easeOut)
            });

            if (frame < frames) setTimeout(animate, increment);
          };

          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, [isStatsVisible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ad Soyad gerekli';
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon numarası gerekli';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (!/^05\d{9}$/.test(digitsOnly)) {
        newErrors.phone = 'Geçerli bir telefon numarası girin (örn: 05521234567)';
      }
    }

    if (!formData.message.trim()) newErrors.message = 'Mesaj gerekli';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://localhost:44361/api/iletisim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adSoyad: formData.name,
          email: formData.email,
          telefon: formData.phone.replace(/\D/g, ''),
          firmaAdi: formData.company || 'Kişisel',
          isTuru: formData.projectType,
          mesaj: formData.message
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            projectType: '',
            message: ''
          });
          setSubmitted(false);
        }, 3000);
      } else {
        setErrors({ submit: data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      }
    } catch (error) {
      console.error('API Hatası:', error);
      setErrors({ submit: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      let digits = value.replace(/\D/g, '');
      if (digits.length > 11) digits = digits.slice(0, 11);
      if (digits.length > 0 && digits.startsWith('5')) digits = '0' + digits;

      let formatted = digits;
      if (digits.length > 1) formatted = `(${digits.slice(0, 4)}) ${digits.slice(4)}`;
      if (digits.length > 7) formatted = `(${digits.slice(0, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
      if (digits.length > 9) formatted = `(${digits.slice(0, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;

      value = formatted;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Mesajınız Alındı!</h3>
          <p className="text-gray-600 mb-6">En kısa sürede size dönüş yapacağız. PVC projeleriniz için profesyonel çözümler sunmaya hazırız.</p>
          <div className="text-sm text-gray-500">Bu sayfa otomatik olarak yenilenecek...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gray-400 rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-gray-300 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black text-red-600 mb-6 tracking-tight">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PVC kapı, pencere ve özel projeleriniz için profesyonel danışmanlık ve ücretsiz keşif hizmeti
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Bar */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-24">
          <div className={`bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm transform transition-all duration-700 ${
            isStatsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-3xl font-bold text-red-600 mb-1">{animatedStats.experience}+</div>
            <div className="text-sm text-gray-600">Yıl Deneyim</div>
          </div>
          <div className={`bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm transform transition-all duration-700 delay-150 ${
            isStatsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-3xl font-bold text-red-600 mb-1">{animatedStats.projects}+</div>
            <div className="text-sm text-gray-600">Tamamlanan Proje</div>
          </div>
          <div className={`bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm transform transition-all duration-700 delay-300 ${
            isStatsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-3xl font-bold text-red-600 mb-1">{animatedStats.satisfaction}%</div>
            <div className="text-sm text-gray-600">Müşteri Memnuniyeti</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Side - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Contact */}
            <div className="bg-red-600 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Hızlı İletişim</h3>
              
              <div className="space-y-4">
                <a href="tel:05524731481" className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">0552 473 14 81</div>
                    <div className="text-gray-100 text-sm">Direkt Arama</div>
                  </div>
                </a>
                
                <a href="mailto:uykusuzpen@hotmail.com" className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">uykusuzpen@hotmail.com</div>
                    <div className="text-gray-100 text-sm">E-posta Gönder</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Çalışma Saatleri</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Pazartesi - Cumartesi</span>
                  <span className="text-gray-800 font-bold">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Pazar</span>
                  <span className="text-red-600 font-bold">Kapalı</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 shadow-lg">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ücretsiz Keşif Talep Edin</h2>
                <p className="text-gray-600">Projeleriniz için profesyonel danışmanlık ve detaylı fiyat teklifi alın</p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full p-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 focus:bg-white ${
                        errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-red-600'
                      }`}
                      placeholder="Adınız ve soyadınız"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full p-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 focus:bg-white ${
                        errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-red-600'
                      }`}
                      placeholder="0555 555 55 55"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 focus:bg-white ${
                        errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-red-600'
                      }`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Firma Adı
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-red-600 transition-all duration-300 focus:bg-white"
                      placeholder="Firma adınız (opsiyonel)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Proje Türü
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-red-600 transition-all duration-300 focus:bg-white"
                  >
                    <option value="">Proje türünüz seçin</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows="5"
                    className={`w-full p-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none focus:bg-white ${
                      errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-red-600'
                    }`}
                    placeholder="Projeniz hakkında detayları paylaşın. Boyutlar, malzeme tercihleri, özel istekler..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Gönderiliyor...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Ücretsiz Keşif Talep Et</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </span>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  * En kısa sürede size dönüş yapacağız. Kişisel verileriniz güvende.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-28">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Bizi Ziyaret Edin</h2>
            <p className="text-gray-600 text-lg">
              Ofisimize gelerek yüz yüze görüşebilirsiniz
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-hidden shadow-lg">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <iframe
                  title="Google Map - PVC Showroom"
                  src="https://www.google.com/maps?q=40.7930793762207,31.23606300354&output=embed"
                  width="100%"
                  height="400"
                  allowFullScreen
                  loading="lazy"
                  className="rounded-xl w-full"
                ></iframe>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Adres</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Darıyeri Mengencik Köyü
                    No: 140<br/>
                    Kaynaşlı / DÜZCE
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Ulaşım</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Şehir merkezine 10 dk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
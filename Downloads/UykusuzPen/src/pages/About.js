import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      title: "Kaliteli Malzeme",
      description: "En kaliteli PVC ve demir-çelik malzemeler"
    },
    {
      title: "Uzman Montaj",
      description: "Deneyimli ekibimizle profesyonel kurulum"
    },
    {
      title: "Uygun Fiyat",
      description: "Kaliteli hizmet, makul fiyatlarla"
    },
    {
      title: "Garanti",
      description: "Tüm işlerimizde uzun dönemli garanti"
    }
  ];

  const services = [
    "PVC Pencere Sistemleri",
    "Demir & Çelik Yapılar", 
    "Balkon Kapatma",
    "Cam Balkon Sistemleri",
    "Güvenlik Sistemleri",
    "Tadilat & Onarım"
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Sayaç animasyonu için custom hook
  const Counter = ({ end, suffix = "" }) => {
    const [count, setCount] = React.useState(0);
    const [hasAnimated, setHasAnimated] = React.useState(false);

    React.useEffect(() => {
      if (!hasAnimated) return;
      
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      const stepDuration = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [end, hasAnimated]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onViewportEnter={() => setHasAnimated(true)}
        className="text-2xl font-bold text-red-800"
      >
        {count}{suffix}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with PVC Window Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f9fafb'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3Crect x='50' y='50' width='300' height='200' fill='%23ffffff' stroke='%236b7280' stroke-width='3' rx='5'/%3E%3Crect x='65' y='65' width='130' height='170' fill='%23e0f2fe' stroke='%236b7280' stroke-width='2'/%3E%3Crect x='205' y='65' width='130' height='170' fill='%23e0f2fe' stroke='%236b7280' stroke-width='2'/%3E%3Cline x1='200' y1='50' x2='200' y2='250' stroke='%236b7280' stroke-width='3'/%3E%3Cline x1='50' y1='150' x2='350' y2='150' stroke='%236b7280' stroke-width='2'/%3E%3Ccircle cx='180' cy='150' r='4' fill='%236b7280'/%3E%3C/svg%3E")`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Hakkımızda
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl"
            >
              Dayanıklı PVC pencere sistemleri ve güçlü demir-çelik yapılar ile
              <br />uzun ömürlü çözümler sunuyoruz
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Uykusuz Pen</h2>
          <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-4">
            <p className="text-lg">
              PVC pencere ve kapı sistemleri alanında uzun yıllardır hizmet veren firmamız, 
              kalite ve güvenilirlik prensibiyle çalışmaktadır.
            </p>
            <p>
              Modern yapı teknolojilerini kullanan deneyimli ekibimiz ile müşterilerimizin 
              ihtiyaçlarına uygun çözümler üretiyoruz. Her projede dayanıklılık, 
              estetik ve enerji verimliliği önceliğimizdir.
            </p>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center text-gray-900 mb-8"
          >
            Hizmetlerimiz
          </motion.h3>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-gray-800">{service}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center text-gray-900 mb-8"
          >
            Neden Bizi Tercih Ediyorlar?
          </motion.h3>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <Award className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section with Animated Counters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-8 mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Counter end={500} suffix="+" />
              <div className="text-gray-700">Tamamlanan Proje</div>
            </div>
            <div>
              <Counter end={15} suffix="+" />
              <div className="text-gray-700">Yıllık Deneyim</div>
            </div>
            <div>
              <Counter end={98} suffix="%" />
              <div className="text-gray-700">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gray-50 p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">İletişim</h3>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.div variants={item} className="flex flex-col items-center">
              <Phone className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-gray-700">+90 552 473 14 81</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <Mail className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-gray-700">uykusuzpen@hotmail.com</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <MapPin className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-gray-700">Düzce, Türkiye</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
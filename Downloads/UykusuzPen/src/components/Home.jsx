import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const PVCWindowShowcase = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const windowData = [
    {
      id: 0,
      title: "PVC pencere, dayanıklı ve ısı yalıtımlı bir pencere çeşididir.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 1,
      title: "Modern tasarım ve yüksek performans bir arada.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Enerji tasarrufu sağlayan akıllı pencere sistemleri.",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Uzun ömürlü ve bakım gerektirmeyen kalite.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div 
      className="min-h-screen py-12 px-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(249,250,251,0.85), rgba(249,250,251,0.85)), url('https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            PVC PENCERE SİSTEMLERİ
          </motion.h2>
          <motion.div 
            className="w-24 h-px bg-gray-300 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          
          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left - Text Area */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-gray-50/50 h-96 lg:h-[500px]">
              <div className="space-y-6">
                <motion.div 
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wide"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Profesyonel Çözüm
                </motion.div>
                
                <div className="min-h-[80px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.h1 
                      key={selectedImage}
                      className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {windowData[selectedImage].title}
                    </motion.h1>
                  </AnimatePresence>
                </div>
                
                <motion.div 
                  className="w-16 h-1 bg-gray-900"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                />
                
                <motion.p 
                  className="text-gray-600 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  Yüksek kaliteli malzeme ve işçilikle üretilen PVC pencere sistemlerimiz.
                </motion.p>

                <Link to="/iletisim" reloadDocument>
                  <motion.button 
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    İletişime Geç
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Right - Main Image */}
            <div className="relative bg-gray-100">
              <div className="h-96 lg:h-[500px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={windowData[selectedImage].image}
                    alt="PVC Pencere"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <motion.div 
            className="p-6 bg-gray-50 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex gap-4 justify-center">
              {windowData.map((window, index) => (
                <motion.button
                  key={window.id}
                  className={`relative transition-all duration-300 rounded-lg ${
                    index === selectedImage
                      ? "shadow-lg"
                      : "opacity-70 hover:opacity-100 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedImage(index)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden bg-white shadow-sm border-2 transition-colors duration-300 ${
                    index === selectedImage ? "border-red-500" : "border-transparent"
                  }`}>
                    <img
                      src={window.image}
                      alt={`Pencere örneği ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Simple indicators */}
            <motion.div 
              className="flex justify-center gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {windowData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === selectedImage 
                      ? "bg-red-500 w-12" 
                      : "bg-gray-300 hover:bg-gray-400 w-8"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <p className="text-gray-500 text-sm">
            Profesyonel montaj hizmeti • Kaliteli malzeme • Uzman ekip
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PVCWindowShowcase;
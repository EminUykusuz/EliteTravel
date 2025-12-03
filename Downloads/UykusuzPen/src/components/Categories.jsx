import React from "react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Ahşap Desenli Profil",
    desc: "Ahşap görünümü ile estetik tasarım ve PVC'nin dayanıklılığını bir araya getirir. Yüksek ısı ve ses yalıtımı sunar, bakım gerektirmez ve uzun ömürlüdür.",
    img: "/images/window/window1.png",
  },
  {
    title: "Beyaz Profil",
    desc: "En çok tercih edilen klasik modeldir. Hafif yapısı, uygun maliyeti ve yüksek yalıtım performansı sayesinde ev ve iş yerlerinde güvenle kullanılır.",
    img: "/images/window/window2.png",
  },
  {
    title: "Çok Odacıklı Profil",
    desc: "İç yapısındaki çoklu hava odacıkları sayesinde üst düzey ısı ve ses yalıtımı sağlar. Enerji tasarrufu ve maksimum dayanıklılık isteyenler için idealdir.",
    img: "/images/window/window3.png",
  },
  {
    title: "Renkli (Antrasit) Profil",
    desc: "Modern ve şık görünümüyle öne çıkar. UV dayanımlı yüzeyi sayesinde renk solması yapmaz. Özellikle mimari projelerde tercih edilen prestijli bir seçenektir.",
    img: "/images/window/window4.png",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Categories() {
  return (
    <section className="py-10 px-4 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-8"
      >
        Kategoriler
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="border border-dashed rounded-2xl p-6 hover:shadow-lg transition bg-white"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={cat.img}
              alt={cat.title}
              className="mx-auto mb-4 h-40 object-contain"
            />
            <h3 className="font-bold text-lg">{cat.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{cat.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Alt kutucuklar */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
      >
        {[
          "Bakım Kolaylığı: Ahşap gibi boya veya vernik gerektirmez, uzun ömürlüdür.",
          "Çevre Dostu: Geri dönüştürülebilir malzemeden üretilir, çevreye zarar vermez.",
          "Yalıtım Avantajı: PVC profiller çok odacıklı yapıları sayesinde enerji tasarrufu sağlar.",
        ].map((text, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="border rounded-xl p-4 text-sm text-gray-600"
          >
            {text}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
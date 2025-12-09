// src/components/sections/ScheduleSection.jsx
import { motion } from 'framer-motion';

export default function ScheduleSection({ itinerary }) {
  if (!itinerary) return null;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-elite-dark mb-8 flex items-center gap-3">
        <span className="w-2 h-8 bg-elite-gold rounded-full inline-block"></span>
        Tur Programı
      </h2>
      
      <div className="space-y-8 relative">
        {/* Sol taraftaki dikey çizgi */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

        {itinerary.map((day, index) => (
          <motion.div 
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            {/* Nokta İşareti */}
            <span className="absolute left-0 top-1 w-6 h-6 bg-white border-4 border-elite-gold rounded-full z-10 shadow-sm"></span>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                {day.day}. GÜN
              </span>
              <h3 className="text-lg font-bold text-elite-dark">
                {day.title}
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {day.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
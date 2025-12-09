import { useParams } from 'react-router-dom';
import { tours } from '../data/tours';
import ScheduleSection from '../components/sections/ScheduleSection'; // YENİ
import Badge from '../components/ui/Badge'; // YENİ
import { Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TourDetailPage() {
  const { slug } = useParams();
  const tour = tours.find(t => t.slug === slug);

  if (!tour) return <div className="text-center py-20">Tur bulunamadı.</div>;

  return (
    <div className="pb-20">
      {/* Hero Kısmı */}
      <div className="relative h-[60vh]">
        <img src={tour.heroImage} className="w-full h-full object-cover" alt={tour.title} />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center p-4">
          <div className="max-w-4xl">
            <Badge variant="accent" className="mb-4">{tour.type}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{tour.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-medium text-lg">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"><Clock size={20}/> {tour.duration}</span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"><MapPin size={20}/> {tour.departureCity} Çıkışlı</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16 relative z-10 grid lg:grid-cols-3 gap-8">
        {/* SOL KOLON */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Highlights */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-elite-dark mb-6">Turun Öne Çıkanları</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-gray-700 items-start">
                  <CheckCircle className="text-elite-gold flex-shrink-0 mt-0.5" size={20}/> 
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* YENİ ScheduleSection Bileşeni Buraya Geliyor */}
          <ScheduleSection itinerary={tour.itinerary} />

        </div>

        {/* SAĞ KOLON (Sticky Fiyat Kartı) */}
        <div className="relative">
          <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="mb-6 border-b border-gray-100 pb-6">
              <p className="text-gray-500 text-sm font-medium mb-1">Kişi Başı Başlangıç</p>
              <div className="text-4xl font-extrabold text-elite-dark tracking-tight">
                {tour.currency === 'EUR' ? '€' : '₺'}{tour.price}
              </div>
              <div className="mt-4 bg-elite-base p-3 rounded-xl flex items-center gap-3 text-elite-dark font-semibold">
                <Calendar size={20} className="text-elite-gold" /> 
                {tour.datesText}
              </div>
            </div>
            <a 
              href={`https://wa.me/${tour.whatsappNumber}`} 
              target="_blank" 
              className="block w-full text-center py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              WhatsApp'tan Bilgi Al
            </a>
            <p className="text-xs text-center text-gray-400 mt-4 px-4">
              Gruplara özel indirimlerimiz için lütfen iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
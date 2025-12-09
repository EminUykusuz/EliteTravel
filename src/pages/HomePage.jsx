import Hero from '../components/sections/Hero';
import TourGrid from '../components/tours/TourGrid';
import ContactSection from '../components/sections/ContactSection';
import FAQSection from '../components/sections/FAQSection'; // YENİ
import { tours } from '../data/tours';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  // Ana sayfada sadece ilk 3 turu göstermek isteyebiliriz
  const featuredTours = tours.slice(0, 3);

  return (
    <>
      <Hero featuredTours={tours} />
      
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-elite-dark mb-4">Öne Çıkan Turlar</h2>
          <p className="text-gray-600">
            Osmanlı'nın izlerini sürdüğümüz, maneviyat ve konforun buluştuğu özel rotalarımızı keşfedin.
          </p>
        </div>
        
        <TourGrid tours={featuredTours} />
        
        <div className="text-center mt-12">
          <Link to="/turlar" className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-elite-dark text-elite-dark font-bold rounded-xl hover:bg-elite-dark hover:text-yellow-300 transition-all">
            Tüm Turları İncele <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* YENİ FAQ BÖLÜMÜ */}
      <FAQSection />

      <div className="container mx-auto px-4 pb-20">
        <ContactSection />
      </div>
    </>
  );
}
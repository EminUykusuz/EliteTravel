import TourGrid from '../components/tours/TourGrid';
import { tours } from '../data/tours';

export default function ToursPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-elite-dark mb-4">Tüm Turlarımız</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Tarihin izinde, konforun zirvesinde unutulmaz yolculuklar.</p>
      </div>
      {/* Yeni TourGrid Bileşeni */}
      <TourGrid tours={tours} />
    </div>
  );
}
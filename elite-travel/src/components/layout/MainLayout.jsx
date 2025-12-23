import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-elite-base text-gray-900">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-center" />
    </div>
  );
}
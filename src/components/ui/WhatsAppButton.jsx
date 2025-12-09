import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a href="https://wa.me/31621525757" target="_blank" className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
      <MessageCircle size={28} />
    </a>
  );
}
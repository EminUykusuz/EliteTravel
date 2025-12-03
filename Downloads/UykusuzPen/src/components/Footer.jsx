import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6">
      {/* Üst bölüm */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Uykusuz Pen Logo" className="h-12 w-auto mb-2" />
          <span className="text-sm text-gray-400">Kalite ve Güvenin Adresi</span>
        </div>

        {/* Menü */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {[
            { name: "Anasayfa", href: "/" },
            { name: "Hakkımızda", href: "/hakkimizda" },
            { name: "Ürünler", href: "/urunler" },
            { name: "İletişim", href: "/iletisim" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-gray-200 hover:text-yellow-400 transition"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* İletişim */}
        <div className="flex flex-col items-center md:items-end gap-2 text-sm">
          <a
            href="https://wa.me/905524731481"
            className="flex items-center gap-1 text-green-400 hover:text-yellow-400 transition"
          >
            <FaWhatsapp /> 0552 473 14 81
          </a>

          <a
            href="mailto:uykusuzpen@hotmail.com"
            className="flex items-center gap-1 text-gray-200 hover:text-yellow-400 transition"
          >
            <FaEnvelope /> uykusuzpen@hotmail.com
          </a>

          <span className="flex items-center gap-1 text-gray-200">
            <FaMapMarkerAlt /> Düzce, Türkiye
          </span>
        </div>
      </div>

      {/* Alt bölüm */}
      <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-center items-center text-sm text-gray-500 gap-2">
        <span>&copy; {new Date().getFullYear()} Uykusuz Pen. Tüm hakları saklıdır.</span>
        
        
       
      </div>
    </footer>
  );
}

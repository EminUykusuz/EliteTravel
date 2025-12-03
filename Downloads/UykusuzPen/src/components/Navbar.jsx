import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from "../logo.png";

export default function Navbar() {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      // Navbar kaybolma kontrolü
      if (currentScroll > lastScrollY && currentScroll > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[9999] px-6 py-4 transition-all duration-500
        ${scrollY === 0 ? "bg-transparent backdrop-blur-0" : "bg-black/40 backdrop-blur-md"}
        ${hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
      `}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            <Link to="/" reloadDocument>
              <img
                src={logo}
                alt="Uykusuz Pen Logo"
                className="h-16 w-48 inline mr-2"
              />
            </Link>
          </div>

          {/* Desktop Menü */}
          <ul className="hidden md:flex space-x-6 text-white font-medium mx-auto">
            <li>
              <Link to="/Anasayfa" reloadDocument className="hover:text-red-500 transition-colors duration-300">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link to="/urunler" reloadDocument className="hover:text-red-500 transition-colors duration-300">
                Ürünler
              </Link>
            </li>
            <li>
              <Link to="/galeri" reloadDocument className="hover:text-red-500 transition-colors duration-300">
                Galeri
              </Link>
            </li>

            {/* Hizmetlerimiz Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button className="hover:text-red-500 transition-colors duration-300 flex items-center">
                Hizmetlerimiz
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${isServicesDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg shadow-lg border border-white/10 transition-all duration-300 ${
                  isServicesDropdownOpen
                    ? "opacity-100 visible transform translate-y-0"
                    : "opacity-0 invisible transform -translate-y-2"
                }`}
              >
                <ul className="py-2">
                  <li>
                    <Link
                      to="/hakkimizda"
                      reloadDocument
                      className="block px-4 py-3 text-white hover:bg-white/10 hover:text-red-500 transition-all duration-300"
                    >
                      Hakkımızda
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      reloadDocument
                      className="block px-4 py-3 text-white hover:bg-white/10 hover:text-red-500 transition-all duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <Link to="/iletisim" reloadDocument className="hover:text-red-500 transition-colors duration-300">
                İletişim
              </Link>
            </li>
          </ul>

          {/* Mobile Menü Butonu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menü */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <ul className="space-y-3 text-white font-medium">
              <li>
                <Link
                  to="/"
                  reloadDocument
                  className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/urunler"
                  reloadDocument
                  className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/galeri"
                  reloadDocument
                  className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Galeri
                </Link>
              </li>

              {/* Mobile Hizmetlerimiz */}
              <li>
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/10 hover:text-red-400 transition-all duration-300 flex items-center justify-between"
                >
                  Hizmetlerimiz
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isServicesDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isServicesDropdownOpen ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 space-y-2">
                    <Link
                      to="/hakkimizda"
                      reloadDocument
                      className="block py-2 px-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Hakkımızda
                    </Link>
                    <Link
                      to="/blog"
                      reloadDocument
                      className="block py-2 px-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  to="/iletisim"
                  reloadDocument
                  className="block py-2 px-3 rounded-lg hover:bg-white/10 hover:text-red-400 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

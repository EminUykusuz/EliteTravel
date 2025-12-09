/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elite: {
          base: "#f6f7f9",      // Ana zemin
          card: "#ffffff",      // Kart zemini
          dark: "#0b3954",      // Logo Lacivert (Metin/Vurgu)
          gold: "#f4b41a",      // Logo Altın (Accent)
          text: "#111827",      // Koyu Metin
          muted: "#4b5563",     // Gri Metin
          'elite-dark': '#163a58',  // Koyu Lacivert (Logodaki)
        'elite-gold': '#dca725',  // Altın Sarısı (Logodaki)
        'elite-base': '#f8fafc',  // Zemin için çok açık gri
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Google Fonts'tan index.html'e eklemeyi unutma
      }
      
    },
  },
  plugins: [],
}
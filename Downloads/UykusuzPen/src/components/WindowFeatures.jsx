import React, { useState } from 'react';



 const WindowFeatures = () => {
 const [active, setActive] = useState(null);


  const features = [
    { id: 1, text: "Dayanıklı Alüminyum Çerçeve" },
    { id: 2, text: "Isı Yalıtımlı Cam" },
    { id: 3, text: "Modern Tasarım" },
    { id: 4, text: "Kolay Açılır Mekanizma" },
    { id: 5, text: "Ses Yalıtımı" },
    { id: 6, text: "Sızdırmazlık Contaları" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">ÖZELLİKLER</h1>
      <div className="relative">
        <img
          src="../public/images/windowBg.png"  
          alt="Pencere"
          className={`w-[400px] transition-all duration-700 ${
            active ? "scale-105" : "scale-100"
          }`}
        />

        {features.map((f) => (
          <button
            key={f.id}
            onMouseEnter={() => setActive(f.id)}
            onMouseLeave={() => setActive(null)}
            className="absolute w-8 h-8 rounded-full bg-gray-200 hover:bg-yellow-400 transition-colors flex items-center justify-center font-bold"
            style={{
              // numaraların pozisyonlarını senin görseline göre ayarlayabilirsin
              top: f.id === 2 ? "-30px" : f.id === 1 ? "30%" : f.id === 3 ? "30%" : f.id === 4 ? "70%" : f.id === 5 ? "90%" : "80%",
              left: f.id === 1 ? "-40px" : f.id === 2 ? "45%" : f.id === 3 ? "90%" : f.id === 4 ? "95%" : f.id === 5 ? "50%" : "-40px",
            }}
          >
            {f.id}
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-6 p-4 rounded-xl bg-white shadow-lg transition-all duration-500 animate-fadeIn">
          <p className="text-lg font-semibold">{features.find((f) => f.id === active).text}</p>
        </div>
      )}
    </div>
  );
 }

export default WindowFeatures;
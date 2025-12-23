// src/main.jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { Toaster } from "react-hot-toast";
import './i18n/config';

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Yükleniyor...</div>}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);

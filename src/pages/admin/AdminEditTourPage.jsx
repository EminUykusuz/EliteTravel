import React, { useEffect, useState } from 'react';
import { tourService } from '../../serivces/genericService';
import { useNavigate, useParams } from 'react-router-dom';
import AdminTourForm from './AdminTourForm';

const AdminEditTourPage = () => {
  const { id } = useParams(); // URL'den ID'yi al
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);

  // Mevcut veriyi çek
  useEffect(() => {
    const fetchTour = async () => {
        try {
            const data = await tourService.getById(id);
            setTour(data);
        } catch (error) {
            alert("Tur verisi bulunamadı");
            navigate('/admin/tours');
        }
    };
    fetchTour();
  }, [id, navigate]);

  const handleUpdate = async (data) => {
    try {
      await tourService.update(id, data);
      alert('Tur güncellendi!');
      navigate('/admin/tours');
    } catch (error) {
      console.error(error);
      alert('Güncelleme hatası.');
    }
  };

  if (!tour) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Turu Düzenle</h2>
      <div className="bg-white p-6 rounded shadow">
        {/* Formu mevcut veriyle dolduruyoruz */}
        <AdminTourForm initialData={tour} onSubmit={handleUpdate} isEditing={true} />
      </div>
    </div>
  );
};

export default AdminEditTourPage;
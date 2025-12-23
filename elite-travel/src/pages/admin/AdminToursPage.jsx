import React from 'react';
import { tourService } from '../../../serivces/genericService';
import { useNavigate } from 'react-router-dom';
import AdminTourForm from './pages/AdminTourForm';

const AdminNewTourPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await tourService.create(data);
      alert('Tur başarıyla oluşturuldu!');
      navigate('/admin/tours'); // Listeye geri dön
    } catch (error) {
      console.error(error);
      alert('Tur eklenirken hata oluştu.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Yeni Tur Ekle</h2>
      <div className="bg-white p-6 rounded shadow">
        <AdminTourForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default AdminNewTourPage;
// src/utils/alerts.js
import Swal from 'sweetalert2';

export const showSuccess = (message) => {
  return Swal.fire({
    icon: 'success',
    title: 'Başarılı!',
    text: message,
    confirmButtonColor: '#2563eb',
    timer: 2000,
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: 'error',
    title: 'Hata!',
    text: message,
    confirmButtonColor: '#dc2626',
  });
};

export const showConfirm = async (message) => {
  const result = await Swal.fire({
    title: 'Emin misiniz?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Evet, sil!',
    cancelButtonText: 'İptal',
  });
  
  return result.isConfirmed;
};

export const showLoading = () => {
  Swal.fire({
    title: 'Yükleniyor...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { showConfirm, showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';
import { bookingService } from '../../../services/bookingService';
import { tourService } from '../../../services/tourService';
import { userService } from '../../../services/userService';

const STATUS_COLORS = {
  'Beklemede': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  'Onaylı': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  'İptal': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
  'Tamamlandı': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle }
};

const normalizeStatusForUi = (status) => {
  const value = (status || '').toString().trim().toLowerCase();
  if (!value) return 'Beklemede';
  if (value === 'pending') return 'Beklemede';
  if (value === 'confirmed') return 'Onaylı';
  if (value === 'cancelled' || value === 'canceled') return 'İptal';
  if (value === 'completed') return 'Tamamlandı';
  return status;
};

const mapStatusToApi = (uiStatus) => {
  const value = (uiStatus || '').toString().trim().toLowerCase();
  if (value === 'beklemede') return 'Pending';
  if (value === 'onaylı' || value === 'onayli') return 'Confirmed';
  if (value === 'iptal' || value === 'i̇ptal') return 'Cancelled';
  if (value === 'tamamlandı' || value === 'tamamlandi') return 'Completed';
  return uiStatus;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [newReservation, setNewReservation] = useState({
    userId: '',
    tourId: '',
    guestCount: 1,
    bookingDate: '',
    contactPhone: '',
    note: '',
    newUserData: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    },
    useNewUser: false
  });

  useEffect(() => {
    loadReservations();
    loadTours();
    loadUsers();
  }, []);

  const loadTours = async () => {
    try {
      const data = await tourService.getAll();
      console.log('Tours loaded:', data);
      setTours(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      console.error('Turlar yüklenemedi:', error);
      showError('Turlar yüklenirken hata oluştu');
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      console.log('Users loaded:', data);
      setUsers(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
      showError('Kullanıcılar yüklenirken hata oluştu');
    }
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      const items = data?.items || data || [];
      const normalized = (Array.isArray(items) ? items : []).map((r) => ({
        ...r,
        status: normalizeStatusForUi(r?.status)
        ,
        // Backward/forward compatibility with UI fields
        guestCount: r?.guestCount ?? r?.numberOfPeople ?? r?.NumberOfPeople,
        note: r?.note ?? r?.specialRequests ?? r?.SpecialRequests,
        bookingDate: r?.bookingDate ?? r?.BookingDate,
        fullName: r?.fullName ?? r?.FullName,
        email: r?.email ?? r?.Email,
        phone: r?.phone ?? r?.Phone,
        user: r?.user
          ? { ...r.user, phoneNumber: r?.user?.phoneNumber ?? r?.phone ?? r?.Phone }
          : (r?.phone || r?.Phone ? { phoneNumber: r?.phone ?? r?.Phone } : r?.user)
      }));
      setReservations(normalized);
    } catch (error) {
      showError('Rezervasyonlar yüklenirken hata oluştu!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bu rezervasyonu silmek istediğinizden emin misiniz?');
    
    if (confirmed) {
      try {
        showLoading();
        await bookingService.delete(id);
        closeLoading();
        showSuccess('Rezervasyon silindi!');
        loadReservations();
      } catch (error) {
        closeLoading();
        showError('Rezervasyon silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      showLoading();
      await bookingService.updateStatus(id, mapStatusToApi(newStatus));
      closeLoading();
      showSuccess('Durum güncellendi!');
      loadReservations();
    } catch (error) {
      closeLoading();
      showError('Durum güncellenirken hata oluştu!');
      console.error(error);
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();

    // Validasyon
    if (!newReservation.tourId) {
      showError('Lütfen bir tur seçin');
      return;
    }

    if (!newReservation.guestCount || newReservation.guestCount < 1) {
      showError('Lütfen misafir sayısını girin');
      return;
    }

    if (!newReservation.bookingDate) {
      showError('Lütfen tur tarihini seçin');
      return;
    }

    if (!newReservation.useNewUser) {
      if (!newReservation.contactPhone) {
        showError('Lütfen iletişim telefonu girin');
        return;
      }
    }

    if (!newReservation.useNewUser && !newReservation.userId) {
      showError('Lütfen bir müşteri seçin veya yeni müşteri oluşturun');
      return;
    }

    if (newReservation.useNewUser) {
      if (!newReservation.newUserData.firstName || !newReservation.newUserData.lastName || !newReservation.newUserData.email || !newReservation.newUserData.phoneNumber) {
        showError('Lütfen müşteri bilgilerini doldurun');
        return;
      }
    }

    showLoading();

    try {
      const selectedTour = tours.find(t => t.id == newReservation.tourId);
      const remainingCapacity = selectedTour.capacity - (newReservation.guestCount || 0);

      if (remainingCapacity < 0) {
        closeLoading();
        showError(`Kapasite yeterli değil! Kalan: ${selectedTour.capacity}`);
        return;
      }

      const selectedUser = !newReservation.useNewUser
        ? users.find(u => String(u.id) === String(newReservation.userId))
        : null;

      const fullName = newReservation.useNewUser
        ? `${newReservation.newUserData.firstName} ${newReservation.newUserData.lastName}`.trim()
        : `${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`.trim();

      const email = newReservation.useNewUser
        ? newReservation.newUserData.email
        : (selectedUser?.email || '');

      const bookingData = {
        userId: newReservation.useNewUser
          ? null
          : (newReservation.userId ? parseInt(newReservation.userId) : null),
        tourId: parseInt(newReservation.tourId),
        fullName,
        email,
        phone: newReservation.useNewUser ? newReservation.newUserData.phoneNumber : newReservation.contactPhone,
        numberOfPeople: parseInt(newReservation.guestCount),
        bookingDate: new Date(newReservation.bookingDate).toISOString(),
        totalPrice: selectedTour.price * Number(newReservation.guestCount),
        status: mapStatusToApi('Onaylı'),
        specialRequests: newReservation.note,
        isActive: true
      };

      await bookingService.create(bookingData);
      closeLoading();
      showSuccess('Rezervasyon başarıyla oluşturuldu!');
      
      // Formu sıfırla
      setNewReservation({
        userId: '',
        tourId: '',
        guestCount: 1,
        bookingDate: '',
        contactPhone: '',
        note: '',
        newUserData: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: ''
        },
        useNewUser: false
      });
      setShowCreateModal(false);
      loadReservations();
    } catch (error) {
      closeLoading();
      showError('Rezervasyon oluşturulurken hata oluştu!');
      console.error(error);
    }
  };

  const filteredReservations = filterStatus === 'Tümü' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Rezervasyonlar</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Yeni Rezervasyon
          </button>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['Tümü', 'Beklemede', 'Onaylı', 'Tamamlandı', 'İptal'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Toplam</p>
          <p className="text-2xl font-bold">{reservations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Beklemede</p>
          <p className="text-2xl font-bold text-yellow-600">{reservations.filter(r => r.status === 'Beklemede').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Onaylı</p>
          <p className="text-2xl font-bold text-green-600">{reservations.filter(r => r.status === 'Onaylı').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">İptal</p>
          <p className="text-2xl font-bold text-red-600">{reservations.filter(r => r.status === 'İptal').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tur</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Müşteri</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Misafir</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Toplam</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Durum</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tarih</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredReservations.map((reservation) => {
              const statusConfig = STATUS_COLORS[reservation.status] || STATUS_COLORS['Pending'];
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.tr
                  key={reservation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-sm">#{reservation.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium">{reservation.tour?.title || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium">{reservation.user?.firstName} {reservation.user?.lastName}</p>
                      <p className="text-gray-600">{reservation.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold">{reservation.guestCount}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${reservation.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={reservation.status || 'Pending'}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      className={`px-3 py-1 rounded text-sm font-medium cursor-pointer border-none ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <option value="Beklemede">Beklemede</option>
                      <option value="Onaylı">Onaylı</option>
                      <option value="Tamamlandı">Tamamlandı</option>
                      <option value="İptal">İptal</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(reservation.createdDate).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowDetailModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Detay Göster"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {filterStatus === 'Tümü' 
              ? 'Henüz rezervasyon bulunmuyor.' 
              : `${filterStatus} durumunda rezervasyon bulunmuyor.`}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Rezervasyon Detayı</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rezervasyon Bilgileri */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Rezervasyon Bilgileri</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">ID:</span> #{selectedReservation.id}</p>
                  <p><span className="text-gray-600">Durum:</span> <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[selectedReservation.status]?.bg || 'bg-gray-100'}`}>
                    {selectedReservation.status}
                  </span></p>
                  <p><span className="text-gray-600">Misafir Sayısı:</span> {selectedReservation.guestCount}</p>
                  <p><span className="text-gray-600">Toplam Fiyat:</span> ${selectedReservation.totalPrice.toFixed(2)}</p>
                  <p><span className="text-gray-600">Oluşturma Tarihi:</span> {new Date(selectedReservation.createdDate).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>

              {/* Tur Bilgileri */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Tur Bilgileri</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Tur Adı:</span> {selectedReservation.tour?.title || 'N/A'}</p>
                  <p><span className="text-gray-600">Açıklama:</span> {selectedReservation.tour?.description || 'Açıklama yok'}</p>
                  <p><span className="text-gray-600">Tur Fiyatı:</span> ${selectedReservation.tour?.price.toFixed(2)}</p>
                  <p><span className="text-gray-600">Kapasite:</span> {selectedReservation.tour?.capacity}</p>
                </div>
              </div>

              {/* Müşteri Bilgileri */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Müşteri Bilgileri</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Ad Soyad:</span> {selectedReservation.user?.firstName} {selectedReservation.user?.lastName}</p>
                  <p><span className="text-gray-600">E-mail:</span> {selectedReservation.user?.email}</p>
                  <p><span className="text-gray-600">Telefon:</span> {selectedReservation.user?.phoneNumber || 'Belirtilmemiş'}</p>
                </div>
              </div>

              {/* Notlar */}
              {selectedReservation.note && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Notlar</h3>
                  <p className="text-sm text-gray-600">{selectedReservation.note}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Yeni Rezervasyon Oluştur</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              {/* Tur Seçimi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tur Seçin *
                </label>
                <select
                  value={newReservation.tourId}
                  onChange={(e) => {
                    setNewReservation({ ...newReservation, tourId: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tur Seçin...</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title} (Kapasite: {tour.capacity}, Fiyat: ${tour.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Müşteri Seçimi */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!newReservation.useNewUser}
                      onChange={() => setNewReservation({ ...newReservation, useNewUser: false })}
                    />
                    <span className="text-sm font-medium">Var Olan Müşteri Seç</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={newReservation.useNewUser}
                      onChange={() => setNewReservation({ ...newReservation, useNewUser: true })}
                    />
                    <span className="text-sm font-medium">Yeni Müşteri Oluştur</span>
                  </label>
                </div>

                {!newReservation.useNewUser ? (
                  <div className="space-y-3">
                    <select
                      value={newReservation.userId}
                      onChange={(e) => setNewReservation({ ...newReservation, userId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Müşteri Seçin...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      placeholder="İletişim Telefonu *"
                      value={newReservation.contactPhone}
                      onChange={(e) => setNewReservation({ ...newReservation, contactPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Ad"
                      value={newReservation.newUserData.firstName}
                      onChange={(e) => setNewReservation({
                        ...newReservation,
                        newUserData: { ...newReservation.newUserData, firstName: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Soyad"
                      value={newReservation.newUserData.lastName}
                      onChange={(e) => setNewReservation({
                        ...newReservation,
                        newUserData: { ...newReservation.newUserData, lastName: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={newReservation.newUserData.email}
                      onChange={(e) => setNewReservation({
                        ...newReservation,
                        newUserData: { ...newReservation.newUserData, email: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2"
                    />
                    <input
                      type="tel"
                      placeholder="Telefon *"
                      value={newReservation.newUserData.phoneNumber}
                      onChange={(e) => setNewReservation({
                        ...newReservation,
                        newUserData: { ...newReservation.newUserData, phoneNumber: e.target.value }
                      })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 col-span-2"
                    />
                  </div>
                )}
              </div>

              {/* Tur Tarihi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tur Tarihi *
                </label>
                <input
                  type="date"
                  value={newReservation.bookingDate}
                  onChange={(e) => setNewReservation({ ...newReservation, bookingDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Misafir Sayısı */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Misafir Sayısı *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newReservation.guestCount}
                    onChange={(e) => setNewReservation({ ...newReservation, guestCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {newReservation.tourId && (
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      Kalan: {tours.find(t => t.id == newReservation.tourId)?.capacity - newReservation.guestCount}
                    </div>
                  )}
                </div>
              </div>

              {/* Notlar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notlar (Opsiyonel)
                </label>
                <textarea
                  value={newReservation.note}
                  onChange={(e) => setNewReservation({ ...newReservation, note: e.target.value })}
                  placeholder="Müşterinin özel talepleri, diyetinize ait bilgiler vb..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              {/* Fiyat Özeti */}
              {newReservation.tourId && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tur Fiyatı:</span>
                      <span>${tours.find(t => t.id == newReservation.tourId)?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Misafir Sayısı:</span>
                      <span>{newReservation.guestCount}</span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 flex justify-between font-bold text-blue-900">
                      <span>Toplam Fiyat:</span>
                      <span>${(tours.find(t => t.id == newReservation.tourId)?.price || 0) * newReservation.guestCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Rezervasyonu Oluştur
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { 
  Trash2, Mail, MailOpen, CheckCircle, Filter, Search, 
  Calendar, X, Send, Check, AlertTriangle // İkonları ekledik
} from "lucide-react";

// === SweetAlert Component (Dashboard'dan alındı ve Geliştirildi) ===
// 'warning' tipi ve 'showCancelButton' desteği eklendi
const SweetAlert = ({
  show,
  type,
  title,
  text,
  onConfirm,
  onCancel,
  showCancelButton = false,
  confirmText = 'Tamam',
  cancelText = 'İptal'
}) => {
  if (!show) return null;

  const icons = {
    success: (
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    ),
    error: (
      <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <X className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    ),
    warning: ( // Yeni: Onay için sarı uyarı
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <AlertTriangle className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    )
  };

  const confirmButtonClass = {
    success: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    error: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    warning: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800', // Silme onayı butonu yine kırmızı
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform animate-[scaleIn_0.3s_ease-out]">
        {icons[type]}
        <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <p className="text-gray-600 text-center mb-8 text-lg">{text}</p>
        <div className="flex flex-col md:flex-row gap-3">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`w-full bg-gradient-to-r text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${confirmButtonClass[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
// === SweetAlert Component Sonu ===


const Mesajlar = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyModal, setReplyModal] = useState({ isOpen: false, message: null });
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // --- YENİ: SweetAlert için state ve helper fonksiyonlar ---
  const [alertState, setAlertState] = useState({
    show: false,
    type: 'success',
    title: '',
    text: '',
    onConfirm: () => {},
    onCancel: () => {},
    showCancelButton: false,
    confirmText: 'Tamam',
    cancelText: 'İptal'
  });

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, show: false }));
  };

  // 'options' objesi ile alert'i tetikleyen ana fonksiyon
  const showAlert = (options) => {
    setAlertState({
      ...alertState, // Önceki varsayılanları koru
      ...options, // Yeni ayarları üzerine yaz
      show: true,
      // Eğer onConfirm veya onCancel gelmezse, varsayılan olarak 'hideAlert'i ata
      onConfirm: options.onConfirm ? () => options.onConfirm() : hideAlert,
      onCancel: options.onCancel ? () => options.onCancel() : hideAlert,
    });
  };
  // --- BİTİŞ ---

  // fetchMessages'ı useCallback içine alıyoruz
  const fetchMessages = useCallback(async () => {
    try {
      // NOT: Bu adresin /api/Iletisim olduğundan emin ol (Dashboard'da düzelttiğimiz gibi)
      const res = await fetch("https://localhost:44361/api/iletisim"); 
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        setError("Mesajlar yüklenemedi."); // Bu da SweetAlert'e çevrilebilir ama Error boundary daha iyi
      }
    } catch (err) {
      setError("Mesajları çekerken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []); // Bağımlılığı yok

  // 'deleteMessage' fonksiyonu artık 'window.confirm' YERİNE onayı gösterir
  const deleteMessage = (id) => {
    showAlert({
      type: 'warning',
      title: 'Emin misin?',
      text: 'Bu mesajı kalıcı olarak silmek istiyorsun. Bu işlem geri alınamaz.',
      showCancelButton: true,
      confirmText: 'Evet, Sil',
      cancelText: 'İptal',
      onConfirm: () => actuallyDelete(id), // Onay verilirse 'actuallyDelete' çağrılır
      onCancel: hideAlert // İptale basılırsa sadece kapanır
    });
  };

  // Asıl silme işlemini bu fonksiyon yapar (Sadece onay verilirse çağrılır)
  const actuallyDelete = async (id) => {
    hideAlert(); // Önce onay penceresini kapat
    try {
      const res = await fetch(`https://localhost:44361/api/iletisim/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setMessages(messages.filter((m) => m.id !== id));
        showAlert({ // Başarı alert'i
          type: 'success',
          title: 'Başarılı!',
          text: 'Mesaj başarıyla silindi.'
        });
      } else {
        showAlert({ // Hata alert'i
          type: 'error',
          title: 'Hata!',
          text: data.message || 'Mesaj silinirken bir sorun oluştu.'
        });
      }
    } catch (err) {
      showAlert({ // Hata alert'i
        type: 'error',
        title: 'Ağ Hatası!',
        text: 'Mesaj silinirken bir sunucu hatası oluştu.'
      });
    }
  };

  // updateStatus, 'alert' YERİNE 'showAlert' kullanır
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`https://localhost:44361/api/iletisim/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durum: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(
          messages.map((m) =>
            m.id === id ? { ...m, durum: newStatus } : m
          )
        );
      } else {
        showAlert({ // Hata alert'i
          type: 'error',
          title: 'Hata!',
          text: data.message || 'Durum güncellenemedi.'
        });
      }
    } catch (err) {
      showAlert({ // Hata alert'i
        type: 'error',
        title: 'Ağ Hatası!',
        text: 'Mesaj durumu güncellenirken bir hata oluştu.'
      });
    }
  };

  const openReplyModal = (message) => {
    setReplyModal({ isOpen: true, message });
    setReplyText("");
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, message: null });
    setReplyText("");
  };

  // sendReply, 'alert' YERİNE 'showAlert' kullanır
  const sendReply = async () => {
    if (!replyText.trim()) {
      showAlert({ // Validasyon alert'i
        type: 'error',
        title: 'Eksik Alan!',
        text: 'Lütfen göndermeden önce bir cevap yazın.'
      });
      return;
    }

    setSending(true);
    try {
      // NOT: Bu adresin (/reply) C#'ta olduğundan emin ol!
      // (Önceki konuşmamızda bu adresin 404 verdiğini konuşmuştuk)
      const res = await fetch(`https://localhost:44361/api/iletisim/${replyModal.message.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cevap: replyText,
          email: replyModal.message.email 
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Durumu güncelle (veya backend zaten güncellediyse state'i set et)
        setMessages(
          messages.map((m) =>
            m.id === replyModal.message.id ? { ...m, durum: "cevaplandi" } : m
          )
        );
        closeReplyModal();
        showAlert({ // Başarı alert'i
          type: 'success',
          title: 'Gönderildi!',
          text: 'Cevap başarıyla gönderildi.'
        });
      } else {
        showAlert({ // Hata alert'i
          type: 'error',
          title: 'Hata!',
          text: data.message || 'Cevap gönderilemedi.'
        });
      }
    } catch (err) {
      showAlert({ // Hata alert'i
        type: 'error',
        title: 'Ağ Hatası!',
        text: 'Cevap gönderilirken bir sunucu hatası oluştu.'
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // fetchMessages'ı useCallback'e sardığımız için bağımlılığa ekledik.

  // --- Aşağıdaki JSX (Tasarım) kodunda hiçbir değişiklik yok ---
  // Sadece SweetAlert'i render etmek için tek bir satır eklendi

  const getStatusBadge = (status) => {
    const badges = {
      yeni: { bg: "bg-red-100", text: "text-red-800", icon: <Mail className="w-3 h-3" /> },
      okundu: { bg: "bg-orange-100", text: "text-orange-800", icon: <MailOpen className="w-3 h-3" /> },
      cevaplandi: { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="w-3 h-3" /> }
    };
    return badges[status] || badges.yeni;
  };
 
  const filteredMessages = messages.filter(msg => {
    const matchesStatus = filterStatus === "all" || msg.durum === filterStatus;
    const matchesSearch = 
      msg.adSoyad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
 
  const stats = {
    total: messages.length,
    yeni: messages.filter(m => m.durum === "yeni").length,
    okundu: messages.filter(m => m.durum === "okundu").length,
    cevaplandi: messages.filter(m => m.durum === "cevaplandi").length
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-red-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 max-w-md shadow-xl animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-800 font-semibold text-center text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      
      {/* --- YENİ: SweetAlert Component'ini buraya render et --- */}
      <SweetAlert 
        {...alertState} 
        onConfirm={alertState.onConfirm} // State'ten gelen fonksiyonları prop olarak geç
        onCancel={alertState.onCancel}
      />
      {/* --- BİTİŞ --- */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
            📬 Mesajlar
          </h1>
          <p className="text-gray-600 text-lg">İletişim formundan gelen tüm mesajları yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-[fadeIn_0.7s_ease-out]">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Toplam</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border-2 border-red-200 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-[fadeIn_0.8s_ease-out]">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700 font-semibold">Yeni</p>
            </div>
            <p className="text-3xl font-bold text-red-800">{stats.yeni}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-2 border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-[fadeIn_0.9s_ease-out]">
            <div className="flex items-center gap-2 mb-2">
              <MailOpen className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-semibold">Okundu</p>
            </div>
            <p className="text-3xl font-bold text-orange-800">{stats.okundu}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-[fadeIn_1s_ease-out]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-semibold">Cevaplandı</p>
            </div>
            <p className="text-3xl font-bold text-green-800">{stats.cevaplandi}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100 animate-[fadeIn_1.1s_ease-out]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ad, email veya firma ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-gray-50"
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Filter className="w-5 h-5 text-red-600" />
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none px-6 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white font-semibold text-gray-700 cursor-pointer transition-all duration-300"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="yeni">🔴 Yeni</option>
                  <option value="okundu">🟠 Okundu</option>
                  <option value="cevaplandi">🟢 Cevaplandı</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden animate-[fadeIn_1.2s_ease-out]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-red-600 to-red-800">
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Kişi</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">İletişim</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Firma & İş</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Mesaj</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Durum</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Tarih</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                          <Mail className="w-10 h-10 text-red-400" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg">Mesaj bulunamadı</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg, index) => {
                    const badge = getStatusBadge(msg.durum);
                    return (
                      <tr 
                        key={msg.id} 
                        className="hover:bg-red-50 transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-5">
                          <div className="font-bold text-gray-900">{msg.adSoyad}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700 font-medium">{msg.email}</div>
                          <div className="text-sm text-gray-500">{msg.telefon}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-gray-900">{msg.firmaAdi}</div>
                          <div className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block">{msg.isTuru}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-600 max-w-xs truncate" title={msg.mesaj}>
                            {msg.mesaj}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="relative">
                            <select
                              value={msg.durum}
                              onChange={(e) => updateStatus(msg.id, e.target.value)}
                              className={`${badge.bg} ${badge.text} px-4 py-2 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer appearance-none pr-8 transition-all duration-300 hover:scale-105`}
                            >
                              <option value="yeni">🔴 Yeni</option>
                              <option value="okundu">🟠 Okundu</option>
                              <option value="cevaplandi">🟢 Cevaplandı</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-sm text-gray-700 font-medium">
                            <Calendar className="w-4 h-4 mr-2 text-red-600" />
                            {new Date(msg.tarih).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-xs text-gray-500 ml-6">
                            {new Date(msg.tarih).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openReplyModal(msg)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <Send className="w-4 h-4" />
                              Cevapla
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)} // Artık 'window.confirm' değil
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-[scaleIn_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Mesaja Cevap Yaz</h2>
              </div>
              <button
                onClick={closeReplyModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition-all duration-300 transform hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
              {/* Original Message Info */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-red-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-red-600 mb-1 font-bold">Gönderen</p>
                    <p className="font-bold text-gray-900">{replyModal.message.adSoyad}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-red-600 mb-1 font-bold">Email</p>
                    <p className="font-bold text-gray-900 text-sm">{replyModal.message.email}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-red-600 mb-1 font-bold">Telefon</p>
                    <p className="font-bold text-gray-900">{replyModal.message.telefon}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-red-600 mb-1 font-bold">Firma</p>
                    <p className="font-bold text-gray-900">{replyModal.message.firmaAdi}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-red-600 mb-2 font-bold">Orijinal Mesaj</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {replyModal.message.mesaj}
                  </p>
                </div>
              </div>

              {/* Reply Textarea */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  ✍️ Cevabınız
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Mesajınızı buraya yazın..."
                  rows="8"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-300 bg-gray-50"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 flex justify-end gap-3 border-t-2 border-gray-200">
              <button
                onClick={closeReplyModal}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold transform hover:scale-105 shadow-sm"
              >
                İptal
              </button>
              <button
                onClick={sendReply}
                disabled={sending}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg transform hover:scale-105"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Cevabı Gönder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind CSS'in animasyonları tanıması için (veya global CSS'e ekle) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Mesajlar;
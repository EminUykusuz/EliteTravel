import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Trash2, Send, X, Eye, EyeOff, Clock, User, Phone as PhoneIcon } from 'lucide-react';
import api from '../../../services/api';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyLanguage, setReplyLanguage] = useState('tr'); // Email dili
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [page, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const isRead = filter === 'all' ? undefined : filter === 'read';
      const params = new URLSearchParams({
        page: page,
        pageSize: pageSize,
        ...(isRead !== undefined && { isRead })
      });
      
      const response = await api.get(`/contacts?${params}`);
            const data = response.data.data;
      if (!data || !data.items) {
                setMessages([]);
        return;
      }
      setMessages(data.items);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (error) {
            alert('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message) => {
    // Mark as read
    if (!message.isRead) {
      try {
        await api.get(`/contacts/${message.id}`);
        message.isRead = true;
      } catch (error) { /* ignored */ }
    }
    setSelectedMessage(message);
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Lütfen bir yanıt mesajı girin');
      return;
    }

    try {
      await api.post(`/contacts/${selectedMessage.id}/reply`, {
        replyMessage: replyText,
        language: replyLanguage // Seçilen dilde email gönder
      });
      
      // Update the message
      selectedMessage.replyMessage = replyText;
      selectedMessage.repliedDate = new Date().toISOString();
      setReplyText('');
      setReplyingId(null);
      alert('✅ Yanıt başarıyla gönderildi!\n📧 Müşteriye email olarak iletilmiştir.');
      fetchMessages(); // Refresh the list
    } catch (error) {
            alert('❌ Yanıt gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      await api.delete(`/contacts/${id}`);
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      alert('Mesaj başarıyla silindi');
    } catch (error) {
            alert('Mesaj silinemedi');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border-l-4 border-[#dca725]">
          <h1 className="text-3xl font-bold text-[#163a58] flex items-center gap-3">
            <div className="p-2 bg-[#dca725]/10 rounded-lg">
              <Mail className="w-8 h-8 text-[#dca725]" />
            </div>
            İletişim Mesajları
          </h1>
          <p className="text-gray-600 mt-2 ml-14">Müşteri mesajlarını görüntüleyin ve yanıtlayın</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'unread', label: 'Okunmamış' },
            { key: 'read', label: 'Okunmuş' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); setPage(1); }}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
                filter === tab.key
                  ? 'bg-[#163a58] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#dca725]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#163a58] to-[#1e4a6a]">
              <h2 className="font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Mesajlar ({messages.length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-[#dca725] border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Yükleniyor...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Mesaj bulunamadı</p>
                </div>
              ) : (
                messages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all flex items-start gap-3 ${
                      selectedMessage?.id === msg.id ? 'bg-gradient-to-r from-[#dca725]/10 to-transparent border-l-4 border-l-[#dca725]' : ''
                    }`}
                  >
                    {!msg.isRead && (
                      <div className="w-2.5 h-2.5 bg-[#dca725] rounded-full mt-2 flex-shrink-0 animate-pulse shadow-lg shadow-[#dca725]/50"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${!msg.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.firstName} {msg.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(msg.createdDate)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-[#163a58] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ← Önceki
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 font-semibold bg-white rounded-lg border border-gray-200">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-[#163a58] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Sonraki →
                </button>
              </div>
            )}
          </div>

          {/* Message Details & Reply */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-5 border border-gray-200">
                {/* Contact Info */}
                <div className="pb-4 border-b-2 border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Ad Soyad
                      </label>
                      <p className="text-[#163a58] font-semibold">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-lg">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        E-posta
                      </label>
                      <a href={`mailto:${selectedMessage.email}`} className="text-[#dca725] hover:underline font-semibold text-sm">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-3 rounded-lg">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <PhoneIcon className="w-3 h-3" />
                        Telefon
                      </label>
                      <p className="text-[#163a58] font-semibold">{selectedMessage.phone || 'Yok'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-3 rounded-lg">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Tarih
                      </label>
                      <p className="text-[#163a58] font-semibold text-sm">{formatDate(selectedMessage.createdDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <label className="block text-sm font-bold text-[#163a58] mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#dca725]" />
                    Gönderilen Mesaj
                  </label>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border-l-4 border-[#dca725] shadow-sm whitespace-pre-wrap text-gray-800">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Section */}
                {selectedMessage.replyMessage && (
                  <div>
                    <label className="text-sm font-bold text-[#163a58] mb-2 flex items-center gap-2">
                      <Send className="w-4 h-4 text-green-600" />
                      Yanıtınız
                    </label>
                    <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                      <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Gönderildi: {formatDate(selectedMessage.repliedDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {!replyingId ? (
                  replyingId !== selectedMessage.id && !selectedMessage.replyMessage && (
                    <button
                      onClick={() => setReplyingId(selectedMessage.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#163a58] to-[#1e4a6a] text-white rounded-lg hover:shadow-xl transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Bu Mesajı Yanıtla
                    </button>
                  )
                ) : replyingId === selectedMessage.id ? (
                  <div className="space-y-3">
                    {/* Dil Seçimi */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        📧 Email Dili
                      </label>
                      <select
                        value={replyLanguage}
                        onChange={(e) => setReplyLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca725] focus:border-transparent transition bg-white"
                      >
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="nl">🇳🇱 Nederlands</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Müşteriye gönderilecek email bu dilde olacaktır
                      </p>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Yanıtınızı yazın..."
                      className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dca725] focus:border-transparent transition"
                      rows="5"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleReply}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-xl transition-all font-bold flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Yanıtı Gönder
                      </button>
                      <button
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-bold"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all font-bold flex items-center justify-center gap-2 border-2 border-red-200"
                >
                  <Trash2 className="w-5 h-5" />
                  Mesajı Sil
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                <div className="bg-gradient-to-br from-gray-50 to-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg">Detayları görüntülemek için bir mesaj seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

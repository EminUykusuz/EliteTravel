import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Trash2, Send, X, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState(null);
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
      console.log('API Response:', response.data);
      const data = response.data.data;
      if (!data || !data.items) {
        console.error('Invalid response structure:', response.data);
        setMessages([]);
        return;
      }
      setMessages(data.items);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
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
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    setSelectedMessage(message);
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      await api.post(`/contacts/${selectedMessage.id}/reply`, {
        replyMessage: replyText
      });
      
      // Update the message
      selectedMessage.replyMessage = replyText;
      selectedMessage.repliedDate = new Date().toISOString();
      setReplyText('');
      setReplyingId(null);
      alert('Reply sent successfully');
      fetchMessages(); // Refresh the list
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contacts/${id}`);
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      alert('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-8 h-8" />
            Contact Messages
          </h1>
          <p className="text-gray-600 mt-2">Manage contact form submissions and customer inquiries</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read'].map(tab => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Messages ({messages.length})</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No messages found</div>
              ) : (
                messages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition flex items-start gap-3 ${
                      selectedMessage?.id === msg.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    {!msg.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
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
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Message Details & Reply */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                {/* Contact Info */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedMessage.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Submitted</label>
                      <p className="text-gray-900">{formatDate(selectedMessage.createdDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-800">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Section */}
                {selectedMessage.replyMessage && (
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Your Reply
                    </label>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Sent: {formatDate(selectedMessage.repliedDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {!replyingId ? (
                  replyingId !== selectedMessage.id && !selectedMessage.replyMessage && (
                    <button
                      onClick={() => setReplyingId(selectedMessage.id)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply to This Message
                    </button>
                  )
                ) : replyingId === selectedMessage.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReply}
                        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="w-full py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view details and reply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

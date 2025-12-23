import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { authService } from '../services/authService';
import { showError, showSuccess, showLoading, closeLoading } from '../utils/alerts';
import QRCode from 'qrcode';

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const generateQR = async () => {
      const auth = authService.getAuth();
      
      if (!auth?.requires2FA) {
        navigate('/login', { replace: true });
        return;
      }

      // Backend'den gelen isFirstTimeSetup'a göre QR göster/gizle
      setShowQR(auth?.isFirstTimeSetup === true);

      if (auth?.secret) {
        setSecret(auth.secret);
        
        try {
          const email = auth.user?.email || 'user@elite.com';
          const otpauthUrl = `otpauth://totp/Elite Travel:${email}?secret=${auth.secret}&issuer=Elite Travel`;
          
          const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
            width: 300,
            margin: 2
          });
          
          setQrCodeUrl(qrDataUrl);
        } catch (err) {
          showError('QR kod oluşturulamadı');
        }
      }
    };

    generateQR();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = authService.getAuth();

    if (!code || code.length !== 6) {
      showError('Lütfen 6 haneli kodu giriniz');
      return;
    }

    try {
      setLoading(true);
      showLoading();
      await authService.verify2FA(code, auth.tempToken);
      closeLoading();
      showSuccess('Giriş başarılı!');
      navigate('/admin', { replace: true });
    } catch (error) {
      closeLoading();
      setLoading(false);
      showError('Hatalı kod. Lütfen tekrar deneyin');
      setCode('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    showSuccess('Kopyalandı!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">2 Faktörlü Doğrulama</h1>
          <p className="text-gray-600 mt-2">Google Authenticator kodunu girin</p>
        </div>

        <div className="space-y-6">
          {/* QR Code - Sadece ilk kurulumda göster */}
          {qrCodeUrl && (
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                type="button"
              >
                <span className="text-sm font-medium text-gray-700">
                  {showQR ? 'QR Kodu Gizle' : 'QR Kodu Göster'}
                </span>
                {showQR ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showQR && (
                <div className="p-6 bg-gray-50 text-center border-t-2 border-gray-200">
                  <p className="text-xs text-gray-600 mb-4">
                    İlk kez kurulum yapıyorsanız QR kodu tarayın:
                  </p>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-full max-w-xs mx-auto rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          )}

          {/* Secret Key */}
          {secret && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-gray-600 mb-2">Manuel kod (QR çalışmazsa):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-3 rounded border border-gray-200 text-xs font-mono break-all">
                  {secret}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                  type="button"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Kod Girişi */}
          <div className="border-4 border-blue-500 rounded-xl p-6 bg-blue-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-base font-bold text-gray-900 mb-3 text-center">
                  📱 Telefonunuzdaki 6 Haneli Kodu Girin
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-4 border-2 border-blue-300 rounded-lg text-center text-3xl tracking-widest font-bold focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-600 text-xs">
            <a 
              href="https://support.google.com/accounts/answer/1066447" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Google Authenticator nasıl kullanılır?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
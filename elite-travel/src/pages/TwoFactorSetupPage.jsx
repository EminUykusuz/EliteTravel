import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Copy } from 'lucide-react';
import { authService } from '../services/authService';
import { showError, showSuccess, showLoading, closeLoading } from '../utils/alerts';
import QRCode from 'qrcode';

export default function TwoFactorSetupPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const generateQR = async () => {
      const auth = authService.getAuth();
      
     
      
      if (!auth?.requires2FA) {
        navigate('/login', { replace: true });
        return;
      }

      if (auth?.isFirstTimeSetup && auth?.secret) {
        setSecret(auth.secret);
        
        try {
          const email = auth.user?.email || 'user@elite.com';
          const otpauthUrl = `otpauth://totp/Elite Travel:${email}?secret=${auth.secret}&issuer=Elite Travel`;
          
          console.log('OTPAuth URL:', otpauthUrl);
          
          const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
      
          
          setQrCodeUrl(qrDataUrl);
        } catch (err) {
         
          showError('QR kod oluşturulamadı');
        }
      } else {
        
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
      showSuccess('2FA başarıyla kuruldu!');
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
          <h1 className="text-3xl font-bold text-gray-800">2FA Kurulumu</h1>
          <p className="text-gray-600 mt-2">Google Authenticator'ı kur</p>
        </div>

        <div className="space-y-6">
          {/* DEBUG INFO */}
          <div className="bg-yellow-50 p-3 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>QR URL Length: {qrCodeUrl.length}</p>
            <p>Secret: {secret ? 'Var ✓' : 'Yok ✗'}</p>
          </div>

          {/* QR Code */}
          {qrCodeUrl ? (
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-4">
                Google Authenticator uygulamasında QR kodu tarayın:
              </p>
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-full max-w-xs mx-auto rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  console.error('Image load error:', e);
                  showError('QR kod yüklenemedi');
                }}
                onLoad={() => console.log('QR image loaded successfully!')}
              />
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-xl text-center">
              <p className="text-gray-500">QR kod yükleniyor...</p>
            </div>
          )}

          {/* Secret Key */}
          {secret && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-gray-600 mb-2">Manuel giriş için:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-3 rounded border border-gray-200 text-sm font-mono break-all">
                  {secret}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  type="button"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6 Haneli Kodu Giriniz
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl tracking-widest font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Doğrulanıyor...' : 'Kurulumu Tamamla'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs">
            Google Authenticator uygulaması henüz yüklü değil mi?{' '}
            <a 
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
              className="text-blue-600 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              İndir
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

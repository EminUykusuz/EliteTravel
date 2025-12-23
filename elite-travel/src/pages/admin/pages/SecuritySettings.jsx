import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../../services/authService';
import { showError, showSuccess, showLoading, closeLoading } from '../../../utils/alerts';
import QRCode from 'qrcode';
import api from '../../../services/api';

export default function SecuritySettings() {
  const [has2FA, setHas2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      setLoading(true);
      const user = authService.getUser();
      
      // Backend'den kullanıcının 2FA durumunu kontrol et
      const response = await api.get(`/users/${user.id}`);
      setHas2FA(response.data.data.twoFactorEnabled || false);
      setLoading(false);
    } catch (error) {
      console.error('2FA durumu kontrol edilemedi:', error);
      setLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    try {
      showLoading();
      const user = authService.getUser();
      
      // Backend'den yeni 2FA secret al
      const response = await api.post('/auth/enable-2fa', { userId: user.id });
      const { secret: newSecret, qrCodeUrl: newQrUrl } = response.data.data;
      
      setSecret(newSecret);
      
      // QR code'u oluştur
      const email = user?.email || 'user@elite.com';
      const otpauthUrl = `otpauth://totp/Elite Travel:${email}?secret=${newSecret}&issuer=Elite Travel`;
      
      const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
      setIsEnabling(true);
      closeLoading();
      showSuccess('QR kod oluşturuldu. Lütfen Google Authenticator ile tarayın.');
    } catch (error) {
      closeLoading();
      showError('2FA etkinleştirilemedi');
    }
  };

  const verifyAndComplete = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError('Lütfen 6 haneli kodu giriniz');
      return;
    }

    try {
      showLoading();
      const user = authService.getUser();
      
      // Backend'e doğrulama kodunu gönder
      await api.post('/auth/verify-enable-2fa', {
        userId: user.id,
        code: verificationCode,
        secret
      });
      
      closeLoading();
      showSuccess('2FA başarıyla etkinleştirildi!');
      setHas2FA(true);
      setIsEnabling(false);
      setQrCodeUrl('');
      setSecret('');
      setVerificationCode('');
    } catch (error) {
      closeLoading();
      showError('Doğrulama kodu hatalı. Lütfen tekrar deneyin.');
      setVerificationCode('');
    }
  };

  const disableTwoFactor = async () => {
    if (!window.confirm('2FA\'yı devre dışı bırakmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      showLoading();
      const user = authService.getUser();
      
      await api.post('/auth/disable-2fa', { userId: user.id });
      
      closeLoading();
      showSuccess('2FA devre dışı bırakıldı');
      setHas2FA(false);
    } catch (error) {
      closeLoading();
      showError('2FA devre dışı bırakılamadı');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
    showSuccess('Secret key kopyalandı!');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Güvenlik Ayarları</h1>
        </div>

        {/* 2FA Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${has2FA ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {has2FA ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  İki Faktörlü Kimlik Doğrulama (2FA)
                </h3>
                <p className="text-gray-600 mb-2">
                  {has2FA 
                    ? '✓ 2FA aktif. Hesabınız ekstra güvenlik katmanı ile korunuyor.'
                    : '⚠ 2FA aktif değil. Hesabınızı daha güvenli hale getirmek için etkinleştirin.'}
                </p>
                <p className="text-sm text-gray-500">
                  2FA, hesabınıza erişim sağlamak için parolanızın yanı sıra telefonunuzdan bir doğrulama kodu girmenizi gerektirir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enable 2FA Section */}
        {!has2FA && !isEnabling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  2FA'yı Etkinleştir
                </h3>
                <p className="text-gray-600 mb-4">
                  Google Authenticator veya benzeri bir uygulama kullanarak 2FA'yı etkinleştirin.
                </p>
                <button
                  onClick={enableTwoFactor}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
                >
                  2FA'yı Etkinleştir
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QR Code Setup Section */}
        {isEnabling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">QR Kodu Tarayın</h3>
              <p className="text-gray-600">Google Authenticator uygulamasıyla aşağıdaki QR kodu tarayın</p>
            </div>

            {qrCodeUrl && (
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto mb-4" />
                
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 mb-2 text-center">Manuel giriş için secret key:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                      {secret}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Kopyala"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6 haneli kod"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={verifyAndComplete}
                disabled={verificationCode.length !== 6}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Doğrula ve Etkinleştir
              </button>
              <button
                onClick={() => {
                  setIsEnabling(false);
                  setQrCodeUrl('');
                  setSecret('');
                  setVerificationCode('');
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                İptal
              </button>
            </div>
          </motion.div>
        )}

        {/* Disable 2FA Section */}
        {has2FA && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  2FA'yı Devre Dışı Bırak
                </h3>
                <p className="text-gray-600 mb-4">
                  İki faktörlü kimlik doğrulamayı devre dışı bırakmak hesabınızı daha az güvenli hale getirir.
                </p>
                <button
                  onClick={disableTwoFactor}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
                >
                  2FA'yı Kapat
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Güvenlik İpuçları:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>2FA'yı etkinleştirdikten sonra secret key'inizi güvenli bir yerde saklayın</li>
                <li>Telefonunuzu kaybederseniz backup kodlarınızla giriş yapabilirsiniz</li>
                <li>2FA kodlarınızı asla kimseyle paylaşmayın</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

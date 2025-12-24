import React, { useState } from 'react';
import { BookOpen, Mail, Globe, Settings, MessageCircle, Map, Tag, UserCircle, Calendar, Users, Menu as MenuIcon, CheckCircle, AlertCircle, Plus, Edit, Trash2, Search, Send, Save, Eye, Image, FileText, Languages, DollarSign } from 'lucide-react';

export default function HowToUsePage() {
  const [activeSection, setActiveSection] = useState('tours');

  const sections = [
    { id: 'tours', title: '🗺️ Tur Ekleme', icon: Map },
    { id: 'translations', title: '🌍 Çeviriler', icon: Globe },
    { id: 'categories', title: '🏷️ Kategoriler', icon: Tag },
    { id: 'guides', title: '👤 Rehberler', icon: UserCircle },
    { id: 'bookings', title: '📅 Rezervasyonlar', icon: Calendar },
    { id: 'messages', title: '💬 Mesajlar', icon: MessageCircle },
    { id: 'users', title: '👥 Kullanıcılar', icon: Users },
    { id: 'menu', title: '📋 Menü', icon: MenuIcon },
    { id: 'settings', title: '⚙️ Ayarlar', icon: Settings },
    { id: 'email', title: '📧 Email Kurulum', icon: Mail },
  ];

  const StepBox = ({ number, title, children, color = "blue" }) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-emerald-600",
      purple: "from-purple-500 to-violet-600",
      orange: "from-orange-500 to-amber-600",
      red: "from-red-500 to-rose-600",
      teal: "from-teal-500 to-cyan-600",
    };

    return (
      <div className="flex gap-4 bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg`}>
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-lg mb-2">{title}</h4>
          <div className="text-gray-700 space-y-2">{children}</div>
        </div>
      </div>
    );
  };

  const InfoBox = ({ type = "info", children }) => {
    const types = {
      info: { bg: "bg-blue-50", border: "border-blue-500", icon: "ℹ️", text: "text-blue-900" },
      warning: { bg: "bg-yellow-50", border: "border-yellow-500", icon: "⚠️", text: "text-yellow-900" },
      success: { bg: "bg-green-50", border: "border-green-500", icon: "✅", text: "text-green-900" },
      tip: { bg: "bg-purple-50", border: "border-purple-500", icon: "💡", text: "text-purple-900" },
    };
    const style = types[type];

    return (
      <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded-lg ${style.text}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{style.icon}</span>
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border-l-4 border-[#dca725]">
          <h1 className="text-3xl font-bold text-[#163a58] flex items-center gap-3">
            <div className="p-2 bg-[#dca725]/10 rounded-lg">
              <BookOpen className="w-8 h-8 text-[#dca725]" />
            </div>
            Kullanım Kılavuzu
          </h1>
          <p className="text-gray-600 mt-2 ml-14">
            Elite Travel admin panelini nasıl kullanacağınızı öğrenin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Konular
              </h3>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-[#163a58] to-[#1e4a6a] text-white shadow-lg scale-105'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              
              {/* TOURS */}
              {activeSection === 'tours' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Map className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Tur Nasıl Eklenir?</h2>
                      <p className="text-gray-600 mt-1">Yeni bir tur eklemek için adım adım rehber</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Turlar Sayfasına Git" color="blue">
                      <p>Sol menüden <strong>"Turlar"</strong> sekmesine tıklayın.</p>
                      <p className="text-sm text-gray-500">📍 Yan menüde <Map className="w-4 h-4 inline" /> ikonu ile gösterilir.</p>
                    </StepBox>

                    <StepBox number="2" title="Yeni Tur Ekle Butonuna Bas" color="green">
                      <p>Sağ üstteki <strong className="text-green-600">+ Yeni Tur Ekle</strong> butonuna tıklayın.</p>
                      <p className="text-sm text-gray-500">Bu buton yeşil renkli ve Plus ikonu ile işaretlidir.</p>
                    </StepBox>

                    <StepBox number="3" title="Genel Bilgileri Doldur" color="purple">
                      <div className="space-y-2">
                        <p><strong>Başlık (Türkçe):</strong> Turun adını yazın (örn: "İstanbul Şehir Turu")</p>
                        <p><strong>Slug:</strong> URL için kısa isim (otomatik oluşur, düzenleyebilirsiniz)</p>
                        <p><strong>Kategori:</strong> Tur kategorisini seçin (Kültür Turları, Macera vb.)</p>
                        <p><strong>Süre:</strong> Kaç gün sürdüğünü yazın (örn: "3 Gün 2 Gece")</p>
                        <p><strong>Fiyat:</strong> Euro cinsinden fiyat yazın (örn: "299")</p>
                        <p><strong>Kontenjan:</strong> Maksimum kişi sayısı (örn: "15")</p>
                      </div>
                    </StepBox>

                    <StepBox number="4" title="Açıklama ve Resimler Ekle" color="orange">
                      <p><strong>Açıklama:</strong> Tur hakkında detaylı bilgi yazın (Türkçe)</p>
                      <p><strong>Kapak Resmi:</strong> Ana görsel yükleyin (önerilen: 1920x1080px)</p>
                      <p><strong>Galeri Resimleri:</strong> Birden fazla resim yükleyebilirsiniz</p>
                      <InfoBox type="tip">
                        <strong>İpucu:</strong> Yüksek kaliteli, yatay resimler kullanın. Dosya boyutu 5MB'dan küçük olmalı.
                      </InfoBox>
                    </StepBox>

                    <StepBox number="5" title="Kaydet" color="green">
                      <p>En alttaki <strong className="text-green-600">Kaydet</strong> butonuna basın.</p>
                      <p className="text-sm text-gray-500">Tur kaydedilecek ve tur listesinde görünecektir.</p>
                      <InfoBox type="warning">
                        <strong>Önemli:</strong> Tur kaydettikten sonra mutlaka <strong>çevirilerini</strong> eklemeyi unutmayın!
                      </InfoBox>
                    </StepBox>

                    <InfoBox type="success">
                      <strong>✅ Tebrikler!</strong> İlk turunuzu başarıyla eklediniz. Şimdi çevirilerini ekleyebilirsiniz.
                    </InfoBox>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-[#163a58] mb-4">Tur Nasıl Düzenlenir?</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                        <Edit className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-blue-900">Düzenle</p>
                          <p className="text-sm text-blue-800">Tur listesinde turun yanındaki <strong>mavi kalem</strong> ikonuna tıklayın.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 bg-red-50 rounded-lg">
                        <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-red-900">Sil</p>
                          <p className="text-sm text-red-800">Turun yanındaki <strong>kırmızı çöp kutusu</strong> ikonuna tıklayın. Onay vermeniz gerekir.</p>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSLATIONS */}
              {activeSection === 'translations' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Globe className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Çeviriler Nasıl Eklenir?</h2>
                      <p className="text-gray-600 mt-1">Turlarınızı 4 dilde yayınlayın: TR, EN, DE, NL</p>
                    </div>
                  </div>

                  <InfoBox type="warning">
                    <strong>Önemli!</strong> Her tur için tüm dillerde çeviri eklemek gerekir. Aksi takdirde o dili seçen kullanıcılar içeriği göremez.
                  </InfoBox>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Tur Düzenleme Sayfasını Aç" color="blue">
                      <p>Turlar listesinden çeviri yapmak istediğiniz turun <strong>Düzenle</strong> butonuna tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Translations Sekmesine Git" color="green">
                      <p>Tur düzenleme sayfasında üstteki sekmelerde <strong>"Translations"</strong> yazısına tıklayın.</p>
                      <p className="text-sm text-gray-500">🌍 Dil bayrağı ikonu ile işaretlidir.</p>
                    </StepBox>

                    <StepBox number="3" title="Dil Seç" color="purple">
                      <p>4 dil görünür: 🇬🇧 English, 🇩🇪 Deutsch, 🇳🇱 Nederlands</p>
                      <p>Hangi dile çeviri ekleyeceğinizi seçin.</p>
                      <InfoBox type="info">
                        Türkçe içerik ana formda zaten var, sadece diğer dilleri eklemeniz yeterli.
                      </InfoBox>
                    </StepBox>

                    <StepBox number="4" title="Çeviriyi Gir" color="orange">
                      <div className="space-y-2">
                        <p><strong>Title:</strong> Turun başlığını o dilde yazın</p>
                        <p><strong>Description:</strong> Açıklamayı o dilde yazın</p>
                        <p><strong>Included/Excluded:</strong> Dahil/hariç servisleri çevirin</p>
                        <p className="text-sm text-gray-500 mt-3">
                          💡 <strong>İpucu:</strong> Google Translate kullanabilirsiniz ama mutlaka kontrol edin!
                        </p>
                      </div>
                    </StepBox>

                    <StepBox number="5" title="Kaydet" color="green">
                      <p>Her dil için <strong>Kaydet</strong> butonuna basın.</p>
                      <InfoBox type="success">
                        Çeviri kaydedildikten sonra o dili seçen kullanıcılar içeriği görebilir!
                      </InfoBox>
                    </StepBox>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Languages className="w-5 h-5" />
                        Hangi Dillere Çeviri Yapmalıyım?
                      </h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p>• <strong>🇬🇧 İngilizce:</strong> Uluslararası müşteriler için zorunlu</p>
                        <p>• <strong>🇩🇪 Almanca:</strong> Alman turistler için önemli</p>
                        <p>• <strong>🇳🇱 Hollandaca:</strong> Hollandalı müşteriler için</p>
                        <p className="mt-3 font-semibold">Tüm dillerde çeviri eklemek müşteri memnuniyetini artırır!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORIES */}
              {activeSection === 'categories' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Tag className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Kategori Nasıl Eklenir?</h2>
                      <p className="text-gray-600 mt-1">Turlarınızı kategorilere ayırın</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Kategoriler Sayfasına Git" color="blue">
                      <p>Sol menüden <strong>"Kategoriler"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Yeni Kategori Ekle" color="green">
                      <p><strong className="text-green-600">+ Yeni Kategori</strong> butonuna tıklayın.</p>
                    </StepBox>

                    <StepBox number="3" title="Bilgileri Doldur" color="purple">
                      <p><strong>Kategori Adı:</strong> Örnek: "Kültür Turları", "Macera Turları", "Deniz Turları"</p>
                      <p><strong>Slug:</strong> URL için (otomatik oluşur)</p>
                      <p><strong>Açıklama:</strong> Kategori hakkında kısa bilgi</p>
                    </StepBox>

                    <StepBox number="4" title="Kaydet" color="green">
                      <p>Kaydet butonuna basın. Kategori oluşturuldu!</p>
                      <InfoBox type="info">
                        Artık tur eklerken bu kategoriyi seçebilirsiniz.
                      </InfoBox>
                    </StepBox>

                    <div className="bg-yellow-50 border-2 border-yellow-300 p-5 rounded-xl">
                      <h4 className="font-bold text-yellow-900 mb-2">Örnek Kategoriler:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-yellow-800">
                        <p>• Kültür Turları</p>
                        <p>• Macera Turları</p>
                        <p>• Deniz Turları</p>
                        <p>• Şehir Turları</p>
                        <p>• Doğa Turları</p>
                        <p>• Yemek Turları</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GUIDES */}
              {activeSection === 'guides' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <UserCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Rehber Nasıl Eklenir?</h2>
                      <p className="text-gray-600 mt-1">Tur rehberlerinizi sisteme ekleyin</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Rehberler Sayfasına Git" color="blue">
                      <p>Sol menüden <strong>"Rehberler"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Yeni Rehber Ekle" color="green">
                      <p><strong>+ Yeni Rehber</strong> butonuna tıklayın.</p>
                    </StepBox>

                    <StepBox number="3" title="Rehber Bilgilerini Gir" color="purple">
                      <div className="space-y-2">
                        <p><strong>Ad Soyad:</strong> Rehberin tam adı</p>
                        <p><strong>Email:</strong> İletişim email adresi</p>
                        <p><strong>Telefon:</strong> İletişim telefonu</p>
                        <p><strong>Diller:</strong> Hangi dilleri konuşuyor (örn: "TR, EN, DE")</p>
                        <p><strong>Uzmanlık Alanları:</strong> Hangi turlarda uzman</p>
                        <p><strong>Bio:</strong> Kısa tanıtım yazısı</p>
                        <p><strong>Fotoğraf:</strong> Rehberin profil fotoğrafı</p>
                      </div>
                    </StepBox>

                    <StepBox number="4" title="Kaydet" color="green">
                      <p>Kaydet butonuna basın. Rehber sisteme eklenecek.</p>
                      <InfoBox type="success">
                        Artık turlara bu rehberi atayabilirsiniz!
                      </InfoBox>
                    </StepBox>
                  </div>
                </div>
              )}

              {/* BOOKINGS */}
              {activeSection === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <Calendar className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Rezervasyonlar Nasıl Yönetilir?</h2>
                      <p className="text-gray-600 mt-1">Gelen rezervasyonları görüntüleyin ve yönetin</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Rezervasyonlar Sayfasını Aç" color="blue">
                      <p>Sol menüden <strong>"Rezervasyonlar"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Rezervasyon Listesini İncele" color="green">
                      <p>Tüm rezervasyonlar listelenir. Her rezervasyonda şunlar görünür:</p>
                      <div className="ml-4 mt-2 space-y-1 text-sm">
                        <p>• Müşteri adı</p>
                        <p>• Tur adı</p>
                        <p>• Tarih</p>
                        <p>• Kişi sayısı</p>
                        <p>• Toplam fiyat</p>
                        <p>• Durum (Beklemede/Onaylandı/İptal)</p>
                      </div>
                    </StepBox>

                    <StepBox number="3" title="Rezervasyon Durumunu Değiştir" color="purple">
                      <p>Her rezervasyonun yanında <strong>durum değiştirme</strong> dropdown'ı vardır.</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                          <span className="text-sm"><strong>Pending:</strong> Beklemede (yeni rezervasyon)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          <span className="text-sm"><strong>Confirmed:</strong> Onaylandı (müşteriye bilgi verin)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <span className="text-sm"><strong>Cancelled:</strong> İptal edildi</span>
                        </div>
                      </div>
                    </StepBox>

                    <StepBox number="4" title="Detayları Görüntüle" color="orange">
                      <p>Rezervasyona tıklayarak detayları görebilirsiniz:</p>
                      <div className="ml-4 mt-2 space-y-1 text-sm">
                        <p>• Müşteri iletişim bilgileri</p>
                        <p>• Özel istekler/notlar</p>
                        <p>• Ödeme bilgileri</p>
                        <p>• Rezervasyon tarihi</p>
                      </div>
                    </StepBox>

                    <InfoBox type="tip">
                      <strong>İpucu:</strong> Yeni rezervasyon geldiğinde müşteriyle iletişime geçip onaylayın. 
                      Email veya telefon ile bilgilendirme yapabilirsiniz.
                    </InfoBox>
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              {activeSection === 'messages' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <MessageCircle className="w-8 h-8 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Mesajlara Nasıl Yanıt Verilir?</h2>
                      <p className="text-gray-600 mt-1">Müşteri mesajlarını yanıtlayın ve email gönderin</p>
                    </div>
                  </div>

                  <InfoBox type="info">
                    <strong>Otomatik Email!</strong> Yeni mesaj geldiğinde size otomatik email bildirim gider. 
                    Yanıt verdiğinizde de müşteriye otomatik email gönderilir.
                  </InfoBox>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="İletişim Mesajları Sayfasını Aç" color="blue">
                      <p>Sol menüden <strong>"İletişim Mesajları"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Mesajları Filtrele" color="green">
                      <p>Üstteki butonlarla mesajları filtreleyebilirsiniz:</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-[#163a58] text-white rounded text-sm">Tümü</span>
                        <span className="px-3 py-1 bg-white border text-gray-700 rounded text-sm">Okunmamış</span>
                        <span className="px-3 py-1 bg-white border text-gray-700 rounded text-sm">Okunmuş</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Okunmamış mesajların yanında 🟡 nokta vardır.</p>
                    </StepBox>

                    <StepBox number="3" title="Email Dilini Seç" color="teal">
                      <p>Dropdown'dan müşteriye gönderilecek email'in dilini seçin:</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="px-3 py-1 bg-white border rounded text-sm">🇹🇷 Türkçe</span>
                        <span className="px-3 py-1 bg-white border rounded text-sm">🇬🇧 English</span>
                        <span className="px-3 py-1 bg-white border rounded text-sm">🇩🇪 Deutsch</span>
                        <span className="px-3 py-1 bg-white border rounded text-sm">🇳🇱 Nederlands</span>
                      </div>
                      <InfoBox type="tip">
                        Müşterinin mesajını hangi dilde gönderdiyse o dilde yanıt verin!
                      </InfoBox>
                    </StepBox>

                    <StepBox number="4" title="Yanıtınızı Yazın ve Gönderin" color="purple">
                      <p>Metin kutusuna yanıtınızı yazın ve <strong className="text-green-600">Yanıtı Gönder</strong> butonuna basın.</p>
                      <InfoBox type="success">
                        ✅ Yanıt kaydedildi ve müşteriye <strong>otomatik email gönderildi</strong>!
                      </InfoBox>
                    </StepBox>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Nasıl Gönderilir?
                      </h4>
                      <p className="text-sm text-blue-800">
                        Yanıt gönderdiğinizde sistem <strong>otomatik olarak</strong> müşteriye profesyonel bir email gönderir. 
                        Email'de Elite Travel logosu ve sizin yanıtınız yer alır. Müşteri direkt email'den size cevap verebilir!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS */}
              {activeSection === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Nasıl Eklenir?</h2>
                      <p className="text-gray-600 mt-1">Sisteme admin veya çalışan ekleyin</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Kullanıcılar Sayfasını Aç" color="blue">
                      <p>Sol menüden <strong>"Kullanıcılar"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Yeni Kullanıcı Ekle" color="green">
                      <p><strong>+ Yeni Kullanıcı</strong> butonuna tıklayın.</p>
                    </StepBox>

                    <StepBox number="3" title="Bilgileri Doldur" color="purple">
                      <div className="space-y-2">
                        <p><strong>Ad Soyad:</strong> Kullanıcının tam adı</p>
                        <p><strong>Email:</strong> Giriş için kullanılacak email</p>
                        <p><strong>Şifre:</strong> İlk giriş şifresi (kullanıcı değiştirebilir)</p>
                        <p><strong>Rol:</strong> Admin veya User seçin</p>
                      </div>
                      <InfoBox type="info">
                        <strong>Admin:</strong> Tüm yetkilere sahip<br/>
                        <strong>User:</strong> Kısıtlı yetki (sadece görüntüleme)
                      </InfoBox>
                    </StepBox>

                    <StepBox number="4" title="Kaydet" color="green">
                      <p>Kaydet butonuna basın. Kullanıcı oluşturuldu!</p>
                      <InfoBox type="success">
                        Kullanıcıya email ve şifresini iletin. Sisteme giriş yapabilir.
                      </InfoBox>
                    </StepBox>
                  </div>
                </div>
              )}

              {/* MENU */}
              {activeSection === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-cyan-100 rounded-lg">
                      <MenuIcon className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Menü Nasıl Düzenlenir?</h2>
                      <p className="text-gray-600 mt-1">Website üst menüsünü özelleştirin</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Menü Yönetimi Sayfasını Aç" color="blue">
                      <p>Sol menüden <strong>"Menü Yönetimi"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="Menü Öğesi Ekle" color="green">
                      <p><strong>+ Yeni Menü Öğesi</strong> butonuna tıklayın.</p>
                      <div className="mt-3 space-y-2">
                        <p><strong>Başlık (TR):</strong> Menüde görünecek isim</p>
                        <p><strong>URL:</strong> Tıklandığında gidilecek sayfa</p>
                        <p><strong>Sıra:</strong> Menüde kaçıncı sırada olacak (1, 2, 3...)</p>
                      </div>
                    </StepBox>

                    <StepBox number="3" title="Çeviri Ekle" color="purple">
                      <p>Her menü öğesi için 4 dilde çeviri ekleyin:</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <p>🇹🇷 Türkçe: "Ana Sayfa"</p>
                        <p>🇬🇧 English: "Home"</p>
                        <p>🇩🇪 Deutsch: "Startseite"</p>
                        <p>🇳🇱 Nederlands: "Home"</p>
                      </div>
                    </StepBox>

                    <InfoBox type="warning">
                      Menü değişiklikleri <strong>anında</strong> web sitesinde görünür. Dikkatli olun!
                    </InfoBox>
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Settings className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Ayarlar Nasıl Değiştirilir?</h2>
                      <p className="text-gray-600 mt-1">Site geneli iletişim bilgilerini güncelleyin</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <StepBox number="1" title="Ayarlar Sayfasını Aç" color="blue">
                      <p>Sol menüden <strong>"Ayarlar"</strong> sekmesine tıklayın.</p>
                    </StepBox>

                    <StepBox number="2" title="İletişim Bilgilerini Güncelle" color="green">
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-bold text-blue-900">📍 Adres</p>
                          <p className="text-sm text-blue-800">Şirket adresinizi yazın. Footer'da ve iletişim sayfasında görünür.</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="font-bold text-green-900">📞 Telefon</p>
                          <p className="text-sm text-green-800">İletişim numaranız. Tüm sayfalarda erişilebilir.</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="font-bold text-purple-900">📧 Email</p>
                          <p className="text-sm text-purple-800">İletişim email adresi. İletişim formundan gelen mesajlar buraya gelir.</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="font-bold text-orange-900">💬 WhatsApp</p>
                          <p className="text-sm text-orange-800">WhatsApp numaranız (ülke koduyla: +31 6 12345678)</p>
                        </div>
                      </div>
                    </StepBox>

                    <StepBox number="3" title="Kaydet" color="green">
                      <p><strong>Kaydet</strong> butonuna basın. Değişiklikler anında aktif olur!</p>
                      <InfoBox type="success">
                        Yeni bilgiler web sitesinin tüm sayfalarında güncellenecek.
                      </InfoBox>
                    </StepBox>
                  </div>
                </div>
              )}

              {/* EMAIL SETUP */}
              {activeSection === 'email' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Mail className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Email Sistemi Nasıl Kurulur?</h2>
                      <p className="text-gray-600 mt-1">Otomatik email bildirimleri için SMTP kurulumu</p>
                    </div>
                  </div>

                  <InfoBox type="warning">
                    <strong>Önemli!</strong> Email sistemi IT/teknik ekip tarafından kurulmalıdır. 
                    Bu işlem backend sunucuda yapılandırma gerektirir.
                  </InfoBox>

                  <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                      <h3 className="font-bold text-blue-900 mb-3">Email Sistemi Ne İşe Yarar?</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p>✉️ <strong>Yeni Mesaj Geldiğinde:</strong> Size otomatik bildirim email'i gelir</p>
                        <p>✉️ <strong>Yanıt Verdiğinizde:</strong> Müşteriye otomatik yanıt email'i gönderilir</p>
                        <p>✉️ <strong>4 Dil Desteği:</strong> Email'ler Türkçe, İngilizce, Almanca, Hollandaca olarak gönderilir</p>
                        <p>✉️ <strong>Profesyonel Tasarım:</strong> Elite Travel branding ile email template'leri</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg">
                      <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Teknik Ekibinize İletin
                      </h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Email sistemi için IT ekibinizin aşağıdaki adımları yapması gerekir:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                        <li>Gmail App Password oluşturma (2FA gerekli)</li>
                        <li>Backend'de <code className="bg-yellow-100 px-1 rounded">appsettings.local.json</code> dosyasını düzenleme</li>
                        <li>SMTP ayarlarını yapılandırma</li>
                        <li>Backend'i yeniden başlatma</li>
                        <li>Test email gönderip kontrol etme</li>
                      </ol>
                      <p className="text-sm text-yellow-800 mt-3 font-semibold">
                        📚 Detaylı teknik dokümantasyon: <code>SMTP_SETUP_GUIDE.md</code> dosyasında
                      </p>
                    </div>

                    <div className="bg-green-50 border-2 border-green-300 p-5 rounded-xl">
                      <h4 className="font-bold text-green-900 mb-3">Email Sistemi Kurulumu Tamamlandı mı?</h4>
                      <p className="text-sm text-green-800 mb-3">Kontrol etmek için:</p>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>1️⃣ İletişim formundan test mesajı gönderin</p>
                        <p>2️⃣ Admin email adresinize bildirim geldi mi kontrol edin</p>
                        <p>3️⃣ Admin panelden mesaja yanıt verin</p>
                        <p>4️⃣ Müşteri email adresine yanıt geldi mi kontrol edin</p>
                      </div>
                      <InfoBox type="success">
                        Tüm adımlar çalışıyorsa email sistemi aktif! 🎉
                      </InfoBox>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

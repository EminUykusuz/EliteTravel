import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, Menu, ChevronRight, X, Link as LinkIcon, Tag } from 'lucide-react';
import { showConfirm, showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';
import { menuService } from '../../../services/menuService';
import { categoryService } from '../../../serivces/genericService';

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [flatMenuItems, setFlatMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    order: 0,
    parentId: null,
    translations: {
      en: '',
      de: '',
      nl: ''
    }
  });

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      console.log('Categories API response:', response);
      // Backend direkt array dönüyor, wrapper yok
      const categoriesData = Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response) 
          ? response 
          : [];
      console.log('Loaded categories:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      
      // Hierarchical menüyü al (görüntüleme için)
      const response = await menuService.getAll();
      const menuData = response.data || [];
      setMenuItems(menuData);
      
      // Flat menüyü al (parent seçimi için)
      const flatResponse = await menuService.getFlat();
      const flatData = flatResponse.data || [];
      setFlatMenuItems(flatData);
    } catch (error) {
      showError('Menü öğeleri yüklenirken hata oluştu!');
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bu menü öğesini silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        showLoading();
        await menuService.delete(id);
        closeLoading();
        showSuccess('Menü öğesi silindi!');
        loadMenuItems();
      } catch (error) {
        closeLoading();
        showError('Menü öğesi silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      showLoading();

      const translations = Object.entries(formData.translations || {})
        .map(([languageCode, title]) => ({ languageCode, title }))
        .filter(t => (t.title || '').trim() !== '');
      
      const dataToSend = {
        title: formData.title,
        url: formData.url || '',
        order: parseInt(formData.order) || 0,
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        translations
      };
      
      if (editingItem) {
        await menuService.update(editingItem.id, dataToSend);
        showSuccess('Menü öğesi güncellendi!');
      } else {
        await menuService.create(dataToSend);
        showSuccess('Menü öğesi eklendi!');
      }
      
      closeLoading();
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        title: '',
        url: '',
        order: 0,
        parentId: null,
        translations: { en: '', de: '', nl: '' }
      });
      loadMenuItems();
    } catch (error) {
      closeLoading();
      console.error('Menü işlemi hatası:', error);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0] ||
                       'İşlem sırasında hata oluştu!';
      showError(errorMsg);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);

    const translationsObj = { en: '', de: '', nl: '' };
    (item.translations || []).forEach(tr => {
      if (tr?.languageCode && Object.prototype.hasOwnProperty.call(translationsObj, tr.languageCode)) {
        translationsObj[tr.languageCode] = tr.title || '';
      }
    });

    setFormData({
      title: item.title || '',
      url: item.url || '',
      order: item.order || 0,
      parentId: item.parentId || null,
      translations: translationsObj
    });
    setShowForm(true);
  };

  const getTotalCount = (items) => {
    let count = items.length;
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        count += getTotalCount(item.children);
      }
    });
    return count;
  };

  // Recursive render for menu tree
  const renderMenuItem = (item, level = 0) => (
    <div key={item.id} className="mb-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all ${
          level > 0 ? 'ml-8' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-2 h-2 rounded-full ${level === 0 ? 'bg-amber-500' : 'bg-orange-500'}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  Sıra: {item.order}
                </span>
                {item.parentId && (
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    Alt Menü
                  </span>
                )}
              </div>
              {item.url && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  {item.url}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              title="Düzenle"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Sil"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {item.children && item.children.length > 0 && (
        <div className="mt-2">
          {item.children.map(child => renderMenuItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Menü Yönetimi</h1>
          <p className="text-gray-600">Navbar ve Footer menü öğelerini yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingItem(null);
            setFormData({
              title: '',
              url: '',
              order: 0,
              parentId: null,
              translations: { en: '', de: '', nl: '' }
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Yeni Menü Öğesi
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Menu className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Toplam Öğe</p>
              <p className="text-2xl font-bold text-gray-800">{getTotalCount(menuItems)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ana Menüler</p>
              <p className="text-2xl font-bold text-gray-800">{menuItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Alt Menüler</p>
              <p className="text-2xl font-bold text-gray-800">
                {getTotalCount(menuItems) - menuItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Kategoriler</p>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {menuItems.length > 0 ? (
          menuItems.map(item => renderMenuItem(item))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            Henüz menü öğesi bulunmuyor. Yeni menü eklemek için yukarıdaki butona tıklayın.
          </div>
        )}
      </div>

      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Menü Öğesini Düzenle' : 'Yeni Menü Öğesi Ekle'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ana Sayfa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Çeviriler (opsiyonel)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={formData.translations?.en || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      translations: { ...formData.translations, en: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="English title"
                  />
                  <input
                    type="text"
                    value={formData.translations?.de || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      translations: { ...formData.translations, de: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Deutsch Titel"
                  />
                  <input
                    type="text"
                    value={formData.translations?.nl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      translations: { ...formData.translations, nl: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Nederlandse titel"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Boş bıraktığınız dillerde "Başlık" alanı kullanılır.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="/about veya https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  İç sayfa için: /about, Dış link için: https://example.com
                </p>
                
                {/* Hızlı Kategori Seçimi */}
                <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                    <Tag className="w-4 h-4" />
                    Hızlı Kategori Seç:
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedCat = categories.find(c => c.id === parseInt(e.target.value));
                        if (selectedCat) {
                          const categoryUrl = `/tours?category=${selectedCat.slug || selectedCat.name.toLowerCase().replace(/\s+/g, '-')}`;
                          setFormData({ 
                            ...formData, 
                            url: categoryUrl,
                            title: formData.title || selectedCat.name
                          });
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-800 font-medium"
                  >
                    <option value="">-- Kategori Seç --</option>
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Kategori yükleniyor...</option>
                    )}
                  </select>
                  <p className="text-xs text-amber-700 mt-2">
                    💡 Kategori seçtiğinizde URL otomatik oluşturulur
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Üst Menü
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      parentId: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">-- Ana Menü --</option>
                    {flatMenuItems
                      .filter(item => !editingItem || item.id !== editingItem.id)
                      .map(item => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>İpucu:</strong> Üst menü seçmezseniz ana menüde görünür. 
                  Üst menü seçerseniz dropdown olarak görünür.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingItem ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

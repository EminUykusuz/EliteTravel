import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, ChevronRight, Tag, X } from 'lucide-react';
import { showConfirm, showSuccess, showError, showLoading, closeLoading } from '../../../utils/alerts';
import { categoryService } from '../../../services/categoryService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: null,
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getFlat(); // Flat endpoint kullan - tüm kategorileri al
      
      console.log('🔍 Backend\'den gelen kategoriler:', data);
      
      // Normalize data - backend PascalCase döndürüyorsa camelCase'e çevir
      const normalizedData = data.map(cat => ({
        id: cat.id || cat.Id,
        name: cat.name || cat.Name,
        slug: cat.slug || cat.Slug,
        description: cat.description || cat.Description,
        parentId: cat.parentId || cat.ParentId,
        createdDate: cat.createdDate || cat.CreatedDate,
        children: cat.children || cat.Children,
        tourCategories: cat.tourCategories || cat.TourCategories
      }));
      
      console.log('✅ Normalize edilmiş kategoriler:', normalizedData);
      console.log('📊 Parent kategoriler:', normalizedData.filter(c => !c.parentId));
      console.log('📊 Alt kategoriler:', normalizedData.filter(c => c.parentId));
      
      setCategories(normalizedData);
    } catch (error) {
      showError('Kategoriler yüklenirken hata oluştu!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    const hasChildren = categories.some(c => c.parentId === id);
    
    if (hasChildren) {
      showError('Bu kategorinin alt kategorileri var. Önce onları silin!');
      return;
    }
    
    const confirmed = await showConfirm('Bu kategoriyi silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        showLoading();
        await categoryService.delete(id);
        closeLoading();
        showSuccess('Kategori silindi!');
        loadCategories();
      } catch (error) {
        closeLoading();
        showError('Kategori silinirken hata oluştu!');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      showLoading();
      
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        showSuccess('Kategori güncellendi!');
      } else {
        await categoryService.create(formData);
        showSuccess('Kategori eklendi!');
      }
      
      closeLoading();
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', parentId: null, description: '' });
      loadCategories();
    } catch (error) {
      closeLoading();
      showError('İşlem sırasında hata oluştu!');
      console.error(error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      parentId: category.parentId,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const parentCategories = categories.filter(c => !c.parentId);
  const getChildCategories = (parentId) => {
    const children = categories.filter(c => c.parentId === parentId);
    console.log(`👶 Parent ${parentId} için alt kategoriler:`, children);
    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tur Kategorileri</h1>
          <p className="text-gray-600">Turlar için kategorileri yönetin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', parentId: null, description: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Yeni Kategori
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Toplam Kategori</p>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ana Kategoriler</p>
              <p className="text-2xl font-bold text-gray-800">{parentCategories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Alt Kategoriler</p>
              <p className="text-2xl font-bold text-gray-800">
                {categories.filter(c => c.parentId !== null).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Kategori Hiyerarşisi</h2>
        
        {parentCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Henüz kategori bulunmuyor.
          </div>
        ) : (
          <div className="space-y-4">
            {parentCategories.map((parent) => {
              const children = getChildCategories(parent.id);
              
              return (
                <motion.div
                  key={parent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{parent.name}</h3>
                        <p className="text-sm text-gray-600">
                          /{parent.slug} • {parent.tourCategories?.length || 0} tur
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(parent)}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(parent.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {children.length > 0 && (
                    <div className="p-4 space-y-2">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-800">{child.name}</p>
                              <p className="text-sm text-gray-600">
                                /{child.slug} • {child.tourCategories?.length || 0} tur
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(child)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(child.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
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
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Örn: Yurt İçi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yurt-ici"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Üst Kategori (Opsiyonel)
                </label>
                <select
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {parentCategories
                    .filter(cat => editingCategory ? cat.id !== editingCategory.id : true) // Kendi kendisini seçmesin
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.parentId 
                    ? '✓ Bu bir alt kategori olacak' 
                    : 'Bu bir ana kategori olacak ve altında alt kategoriler olabilir'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Kategori hakkında kısa açıklama..."
                />
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingCategory ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
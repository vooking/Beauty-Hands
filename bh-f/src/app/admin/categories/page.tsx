'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';

interface Category {
  id: number;
  name: string;
  type: string;
}

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    type: 'both'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Автоматическое скрытие уведомления
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setNotification({ message: 'Ошибка загрузки категорий', type: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setNotification({ message: 'Введите название категории', type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка сохранения категории');
      }

      await fetchCategories();
      setForm({ name: '', type: 'both' });
      setEditingId(null);
      setNotification({ 
        message: editingId ? 'Категория обновлена' : 'Категория добавлена', 
        type: 'success' 
      });
    } catch (error: any) {
      console.error('Error:', error);
      setNotification({ 
        message: error.message || 'Ошибка сохранения категории', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      type: category.type
    });
    setEditingId(category.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту категорию? Это действие нельзя отменить.')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Ошибка авторизации', type: 'error' });
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при удалении');
      }

      await fetchCategories();
      setNotification({ message: 'Категория успешно удалена', type: 'success' });
    } catch (error: any) {
      console.error('Error:', error);
      setNotification({ 
        message: error.message || 'Не удалось удалить категорию. Возможно, она используется в услугах или портфолио.', 
        type: 'error' 
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <AdminNavbar />
      
      {/* Уведомление */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg animate-notification text-sm md:text-base ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`} style={{ 
          maxWidth: isMobile ? 'calc(100% - 2rem)' : 'auto',
          width: isMobile ? 'auto' : 'max-content'
        }}>
          {notification.message}
        </div>
      )}

      <main className="p-4 sm:p-6 md:ml-64 max-w-4xl mx-auto text-[#4b4845]">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Управление категориями</h1>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 bg-gray-50 p-4 rounded">
          <h2 className="text-lg sm:text-xl font-semibold">
            {editingId ? 'Редактирование категории' : 'Добавление категории'}
          </h2>
          
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium">Название категории</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full p-2 border rounded text-sm sm:text-base"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium">Тип</label>
            <select
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
              className="w-full p-2 border rounded text-sm sm:text-base"
              disabled={loading}
            >
              <option value="both">Для услуг и портфолио</option>
              <option value="service">Только для услуг</option>
              <option value="portfolio">Только для портфолио</option>
            </select>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-500 disabled:bg-gray-400 text-sm sm:text-base"
            >
              {loading ? 'Сохранение...' : editingId ? 'Обновить' : 'Добавить'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ name: '', type: 'both' });
                  setEditingId(null);
                }}
                className="bg-gray-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded disabled:bg-gray-400 text-sm sm:text-base"
                disabled={loading}
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          {categories.length === 0 ? (
            <p className="text-center py-4 text-gray-500 text-sm sm:text-base">Категорий пока нет</p>
          ) : (
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 sm:p-3 text-left">Название</th>
                  <th className="p-2 sm:p-3 text-left">Тип</th>
                  <th className="p-2 sm:p-3 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 sm:p-3">{category.name}</td>
                    <td className="p-2 sm:p-3">
                      {category.type === 'both' && 'Для услуг и портфолио'}
                      {category.type === 'service' && 'Только для услуг'}
                      {category.type === 'portfolio' && 'Только для портфолио'}
                    </td>
                    <td className="p-2 sm:p-3 space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                        disabled={deleteLoading !== null}
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:underline text-xs sm:text-sm"
                        disabled={deleteLoading !== null}
                      >
                        {deleteLoading === category.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
};

export default withAuth(CategoriesAdmin);
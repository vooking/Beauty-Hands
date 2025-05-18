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
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      alert('Ошибка загрузки категорий');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

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
        throw new Error(errorData.message || 'Error saving category');
      }

      await fetchCategories();
      setForm({ name: '', type: 'both' });
      setEditingId(null);
      alert(editingId ? 'Категория обновлена' : 'Категория добавлена');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Ошибка сохранения');
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
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту категорию? Это действие нельзя отменить.')) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Ошибка авторизации');
        return;
    }

    try {
        setDeleteLoading(true);
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
        alert('Категория успешно удалена');
    } catch (error: any) {
        console.error('Error:', error);
        alert(error.message || 'Не удалось удалить категорию. Возможно, она используется в услугах или портфолио.');
    } finally {
        setDeleteLoading(false);
    }
};

  return (
    <>
      <AdminNavbar />
      <main className="p-6 max-w-4xl mx-auto text-[#4b4845]">
        <h1 className="text-2xl font-semibold mb-6">Управление категориями</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Название категории</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Тип</label>
            <select
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="both">Для услуг и портфолио</option>
              <option value="service">Только для услуг</option>
              <option value="portfolio">Только для портфолио</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
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
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Название</th>
                <th className="p-3 text-left">Тип</th>
                <th className="p-3 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">
                    {category.type === 'both' && 'Для услуг и портфолио'}
                    {category.type === 'service' && 'Только для услуг'}
                    {category.type === 'portfolio' && 'Только для портфолио'}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:underline"
                      disabled={deleteLoading}
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:underline"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Удаление...' : 'Удалить'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default withAuth(CategoriesAdmin);
"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";

const PortfolioAdmin = () => {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Перенаправить на страницу входа или показать сообщение
    return;
  }

    const fetchData = async () => {
      try {
        // Загружаем категории
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Загружаем портфолио
        const portfolioRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image || !form.category_id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category_id", form.category_id);
    formData.append("image", form.image);

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Ошибка при добавлении");

      const newItem = await res.json();
      setPortfolio([newItem, ...portfolio]);
      setForm({ title: "", category_id: "", image: null });
    } catch (err: any) {
      alert(err.message || "Ошибка при добавлении изображения");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этот элемент?") || !localStorage.getItem("token")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Ошибка при удалении");

      setPortfolio(portfolio.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Ошибка при удалении");
    }
  };

  const filteredPortfolio = filterCategory
    ? portfolio.filter(item => item.category_id === filterCategory)
    : portfolio;

  return (
    <>
      <AdminNavbar />
      <main className="p-6 max-w-4xl mx-auto text-[#4b4845]">
        <h1 className="text-2xl font-semibold mb-6">Портфолио</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Название (необязательно)"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full border rounded p-2"
          />

          <select
            value={form.category_id}
            onChange={(e) => setForm({...form, category_id: e.target.value})}
            className="w-full border rounded p-2"
            required
          >
            <option value="" disabled>Выберите категорию</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({...form, image: e.target.files?.[0] || null})}
            className="w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            {loading ? "Загрузка..." : "Добавить"}
          </button>
        </form>

        {/* Фильтр по категории */}
        <div className="mb-6">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-1/2 border rounded p-2"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPortfolio.map((item) => {
            const category = categories.find(c => c.id === item.category_id);
            return (
              <div key={item.id} className="border p-4 rounded-md relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.image_url}`}
                  alt={item.title || "Изображение"}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <p className="text-sm mb-1">
                  <strong>Категория:</strong> {category?.name || "Неизвестно"}
                </p>
                {item.title && (
                  <p className="text-sm">
                    <strong>Название:</strong> {item.title}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default withAuth(PortfolioAdmin);
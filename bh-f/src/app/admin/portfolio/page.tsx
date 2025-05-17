"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";
import PortfolioCard from "@/app/components/PortfolioCard";

const PortfolioAdmin = () => {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [categoriesRes, portfolioRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [categoriesData, portfolioData] = await Promise.all([
          categoriesRes.json(),
          portfolioRes.json(),
        ]);

        setCategories(categoriesData);
        setPortfolio(portfolioData);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Ошибка при добавлении");

      const newItem = await res.json();
      setPortfolio((prev) => [newItem, ...prev]);
      setForm({ title: "", category_id: "", image: null });
    } catch (err: any) {
      alert(err.message || "Ошибка при добавлении изображения");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Удалить этот элемент?") || !localStorage.getItem("token"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Ошибка при удалении");

      setPortfolio((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Ошибка при удалении");
    }
  }, []);

  const filteredPortfolio = filterCategory
    ? portfolio.filter((item) => item.category_id === filterCategory)
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
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded p-2"
          />

          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border rounded p-2"
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files?.[0] || null })
            }
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

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : filteredPortfolio.length === 0 ? (
          <p className="text-gray-500">Изображений пока нет</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPortfolio.map((item) => {
              const category = categories.find(
                (c) => c.id === item.category_id
              );
              return (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  category={category}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default withAuth(PortfolioAdmin);

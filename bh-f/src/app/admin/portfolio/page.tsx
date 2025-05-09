"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchPortfolio = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Ошибка загрузки портфолио");

      const data = await res.json();
      setPortfolio(data);
    } catch (error) {
      alert("Ошибка загрузки портфолио");
    }
  };

  useEffect(() => {
    if (token) fetchPortfolio();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !token)
      return alert(
        "Выберите изображение и убедитесь, что авторизация выполнена."
      );

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка при добавлении");
      }

      await fetchPortfolio();
      setTitle("");
      setCategory("");
      setImage(null);
    } catch (err: any) {
      alert(err.message || "Ошибка при добавлении изображения");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить этот элемент?") || !token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка при удалении");
      }

      fetchPortfolio();
    } catch (err: any) {
      alert(err.message || "Ошибка при удалении");
    }
  };

  const filteredPortfolio = filterCategory
    ? portfolio.filter((item) => item.category === filterCategory)
    : portfolio;

  return (
    <>
      <AdminNavbar />
      <main className="p-6 max-w-3xl mx-auto text-[#4b4845]">
        <h1 className="text-2xl font-semibold mb-6">Портфолио</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-10 space-y-4 border p-4 rounded-md"
        >
          <input
            type="text"
            placeholder="Название (необязательно)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {[
              "Наращивание ногтей",
              "Маникюр",
              "Педикюр",
              "Брови и ресницы",
              "Лицо",
              "Массаж",
              "Препаратный педикюр KART",
              "Комплексы",
              "Пирсинг",
              "Депиляция",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            {[
              "Наращивание ногтей",
              "Маникюр",
              "Педикюр",
              "Брови и ресницы",
              "Лицо",
              "Массаж",
              "Препаратный педикюр KART",
              "Комплексы",
              "Пирсинг",
              "Депиляция",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPortfolio.map((item) => (
            <div key={item.id} className="border p-4 rounded-md relative">
              <img
                src={
                    `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.image_url}`
                }
                alt={item.title || "Изображение"}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="text-sm mb-1">
                <strong>Категория:</strong> {item.category}
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
          ))}
        </div>
      </main>
    </>
  );
};

export default withAuth(Portfolio);

"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";
import PortfolioCard from "@/app/components/PortfolioCard";

interface PortfolioItem {
  id: number;
  title: string;
  category_id: string;
  image: string;
}

interface FormItem {
  title: string;
  category_id: string;
  images: File[];
}

const PortfolioAdmin = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<FormItem>({
    title: "",
    category_id: "",
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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
    if (form.images.length === 0 || !form.category_id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      // Отправляем каждое изображение отдельно
      const uploadPromises = form.images.map(async (image) => {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category_id", form.category_id);
        formData.append("image", image);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Ошибка при добавлении");
        return res.json();
      });

      const newItems = await Promise.all(uploadPromises);
      setPortfolio((prev) => [...newItems, ...prev]);
      setForm({ title: "", category_id: "", images: [] });
      alert(`Успешно добавлено ${newItems.length} изображений`);
    } catch (err: any) {
      alert(err.message || "Ошибка при добавлении изображений");
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

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0 || !confirm(`Удалить ${selectedItems.length} выбранных элементов?`)) 
      return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const deletePromises = selectedItems.map(async (id) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`Ошибка при удалении элемента ${id}`);
      });

      await Promise.all(deletePromises);
      setPortfolio((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      alert(`Успешно удалено ${selectedItems.length} элементов`);
    } catch (err: any) {
      alert(err.message || "Ошибка при массовом удалении");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setForm({ ...form, images: [...form.images, ...filesArray] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredPortfolio.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPortfolio.map(item => item.id));
    }
  };

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
            placeholder="Название (необязательно, применяется ко всем)"
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

          <div>
            <label className="block mb-2 font-medium">Изображения: ({form.images.length} выбрано)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-2"
              multiple
            />
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="text-xs truncate mt-1">{file.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || form.images.length === 0}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500 disabled:bg-gray-400"
          >
            {loading ? "Загрузка..." : `Добавить ${form.images.length} изображений`}
          </button>
        </form>

        <div className="mb-6 flex justify-between items-center">
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

          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Удалить выбранные ({selectedItems.length})
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Загрузка...</p>
        ) : filteredPortfolio.length === 0 ? (
          <p className="text-gray-500">Изображений пока нет</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-full flex items-center p-2 bg-gray-100 rounded">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredPortfolio.length && filteredPortfolio.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 mr-2"
              />
              <span>Выбрать все</span>
            </div>
            {filteredPortfolio.map((item) => {
              const category = categories.find(
                (c) => c.id === item.category_id
              );
              return (
                <div key={item.id} className="relative group">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="absolute top-2 left-2 z-10 h-4 w-4"
                  />
                  <PortfolioCard
                    item={item}
                    category={category}
                    onDelete={handleDelete}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default withAuth(PortfolioAdmin);
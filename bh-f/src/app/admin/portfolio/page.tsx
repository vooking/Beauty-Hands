"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import withAuth from "@/app/components/withAuth";
import PortfolioCard from "@/app/components/PortfolioCard";

interface PortfolioItem {
  id: number;
  title: string;
  category_id: number;
  image_url: string;
}

interface FormItem {
  title: string;
  category_id: number | "";
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
  const [loading, setLoading] = useState({
    initial: true,
    uploading: false,
    deleting: false,
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const filteredPortfolio = filterCategory
    ? portfolio.filter((item) => item.category_id === Number(filterCategory))
    : portfolio;

  const fetchPortfolio = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPortfolio(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories?type=portfolio`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPortfolio(), fetchCategories()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    loadData();
  }, [fetchPortfolio, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0 || !form.category_id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading((prev) => ({ ...prev, uploading: true }));

    try {
      const uploadPromises = form.images.map(async (image) => {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("category_id", String(form.category_id));
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

      await Promise.all(uploadPromises);
      await fetchPortfolio();
      setForm({ title: "", category_id: "", images: [] });
      alert(`Успешно добавлено ${form.images.length} изображений`);
    } catch (err: any) {
      alert(err.message || "Ошибка при добавлении изображений");
    } finally {
      setLoading((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Удалить этот элемент?")) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading((prev) => ({ ...prev, deleting: true }));
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        await fetchPortfolio();
      } catch (err: any) {
        alert(err.message || "Ошибка при удалении");
      } finally {
        setLoading((prev) => ({ ...prev, deleting: false }));
      }
    },
    [fetchPortfolio]
  );

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0 || !confirm(`Удалить ${selectedItems.length} выбранных элементов?`)) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading((prev) => ({ ...prev, deleting: true }));
      await Promise.all(
        selectedItems.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/portfolio/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      await fetchPortfolio();
      setSelectedItems([]);
      alert(`Успешно удалено ${selectedItems.length} элементов`);
    } catch (err: any) {
      alert(err.message || "Ошибка при массовом удалении");
    } finally {
      setLoading((prev) => ({ ...prev, deleting: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...filesArray] }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const clearForm = () => {
    // Очищаем все выбранные файлы и их превью
    setForm((prev) => ({
      ...prev,
      images: [],
      title: "",
      category_id: ""
    }));
    
    // Сбрасываем значение input file
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === filteredPortfolio.length
        ? []
        : filteredPortfolio.map((item) => item.id)
    );
  };

  return (
    <>
      <AdminNavbar />
      <main className="p-6 max-w-4xl mx-auto text-[#4b4845]">
        <h1 className="text-2xl font-semibold mb-6">Портфолио</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-4 rounded">
          <h2 className="text-xl font-semibold">Добавление изображений</h2>
          
          <div>
            <label className="block mb-1 font-medium">Название (необязательно)</label>
            <input
              type="text"
              placeholder="Применяется ко всем изображениям"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Категория</label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) })
              }
              className="w-full border rounded p-2"
              required
              disabled={loading.uploading}
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
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Изображения ({form.images.length} выбрано)
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-2"
              multiple
              disabled={loading.uploading}
            />
            {form.images.length > 0 && (
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
                      disabled={loading.uploading}
                    >
                      ×
                    </button>
                    <div className="text-xs truncate mt-1">{file.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              disabled={loading.uploading}
            >
              Очистить все
            </button>
            <button
              type="submit"
              disabled={loading.uploading || form.images.length === 0}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
            >
              {loading.uploading
                ? "Загрузка..."
                : `Добавить ${form.images.length} изображений`}
            </button>
          </div>
        </form>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <label className="block mb-1 font-medium">Фильтр по категории</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border p-2 rounded"
              disabled={loading.initial}
            >
              <option value="">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={loading.deleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400"
            >
              {loading.deleting ? "Удаление..." : `Удалить выбранные (${selectedItems.length})`}
            </button>
          )}
        </div>

        {loading.initial ? (
          <div className="text-center py-8">Загрузка данных...</div>
        ) : filteredPortfolio.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filterCategory ? "Нет изображений в выбранной категории" : "Изображений пока нет"}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-2 bg-gray-100 rounded">
              <input
                type="checkbox"
                checked={
                  selectedItems.length === filteredPortfolio.length &&
                  filteredPortfolio.length > 0
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 mr-2"
                disabled={loading.deleting}
              />
              <span>Выбрать все ({filteredPortfolio.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPortfolio.map((item) => {
                const category = categories.find((c) => c.id === item.category_id);
                return (
                  <div key={item.id} className="relative group">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="absolute top-2 left-2 z-10 h-4 w-4"
                      disabled={loading.deleting}
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
          </div>
        )}
      </main>
    </>
  );
};

export default withAuth(PortfolioAdmin);
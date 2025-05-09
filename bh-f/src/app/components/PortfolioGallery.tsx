"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/app/globals.css";
import styles from "@/app/page.module.css";

const categories = [
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
] as const;

type Category = (typeof categories)[number];

type PortfolioImage = {
  id: number;
  url: string;
  category: Category;
};

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<string>(
      categories[0]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/portfolio?category=${encodeURIComponent(activeCategory)}`
        );
        const data: PortfolioImage[] = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Ошибка загрузки портфолио:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeCategory]);

  return (
    <section className="max-w-5xl mx-auto px-4 text-center text-[#4b4845] overflow-x-hidden">
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 md:mb-8 ${styles.titleMain}`}
      >
        Портфолио работ
      </h2>

      {/* Кнопки фильтрации */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        {categories.map((cat) => (
          <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`shrink-0 relative text-sm transition-all duration-300 pb-1 px-2
            ${
              activeCategory === cat
                ? "text-[#FFC5B8] font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]"
                : "text-gray-700 hover:text-[#FFC5B8] hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-[#FFC5B8]"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>

      {/* Галерея */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {loading ? (
          <p className="col-span-full text-gray-400">Загрузка...</p>
        ) : images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              className="aspect-square relative rounded overflow-hidden"
            >
              <Image
                src={image.url}
                alt={`portfolio ${image.id}`}
                fill
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-400">Фотографий пока нет</p>
        )}
      </div>

      {/* Кнопка */}
      <Link
        href="/"
        className="inline-block border border-gray-600 text-gray-800 text-[18px] px-6 py-3 rounded-xl hover:bg-gray-100 transition"
      >
        Смотреть больше
      </Link>
    </section>
  );
}

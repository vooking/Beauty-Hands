'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.css';

const categories = [
  'Наращивание ногтей',
  'Маникюр',
  'Педикюр',
  'Брови и ресницы',
  'Лицо',
  'Массаж',
  'Препаратный педикюр KART',
  'Комплексы',
  'Пирсинг',
  'Депиляция',
] as const;

type Category = (typeof categories)[number];

type PortfolioImage = {
  id: number;
  image_url: string;
  url: string; // Готовый абсолютный URL
  title?: string;
  category: Category;
};

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/portfolio?category=${encodeURIComponent(activeCategory)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: PortfolioImage[] = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Ошибка загрузки портфолио:', error);
        setImages([]); // сброс, если ошибка
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeCategory]);

  return (
    <section className="max-w-5xl mx-auto px-4 text-center text-[#4b4845]">
      <h2 className={`text-3xl md:text-4xl font-semibold mb-8 ${styles.titleMain}`}>
        Портфолио работ
      </h2>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm pb-1 px-3 relative transition-all ${
              activeCategory === cat
                ? 'text-[#FFC5B8] font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]'
                : 'text-gray-700 hover:text-[#FFC5B8] hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:bg-[#FFC5B8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-gray-400">Загрузка...</p>
        ) : images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="relative aspect-square rounded overflow-hidden">
              <Image
                                src={
                    `${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.image_url}`
                }
                alt={image.title || `portfolio ${image.id}`}
                fill
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-400">Фотографий пока нет</p>
        )}
      </div>
    </section>
  );
}

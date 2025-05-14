import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.css';

type PortfolioImage = {
  id: number;
  image_url: string;
  title?: string;
  category_id: {
    id: number;
    name: string;
    slug: string;
  };
};

const CategoryButton = memo(({ 
  cat, 
  activeCategory, 
  onClick 
}: { 
  cat: { id: number; name: string; slug: string }; 
  activeCategory: string; 
  onClick: (slug: string) => void; 
}) => (
  <button
    onClick={() => onClick(cat.slug)}
    className={`text-sm pb-1 px-3 relative transition-all ${
      activeCategory === cat.slug
                  ? "text-[#FFC5B8] font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#FFC5B8]"
                  : "text-gray-700 hover:text-[#FFC5B8] hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-[#FFC5B8]"
              }`}
  >
    {cat.name}
  </button>
));

const PortfolioImageItem = memo(({ image }: { image: PortfolioImage }) => (
  <div className="relative aspect-square rounded overflow-hidden">
    <Image
      src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.image_url}`}
      alt={image.title || `portfolio ${image.id}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
));

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string; slug: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?type=portfolio`);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].slug);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/portfolio?category_id=${activeCategory}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: PortfolioImage[] = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Ошибка загрузки портфолио:', error);
        setImages([]);
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
          <CategoryButton 
            key={cat.id} 
            cat={cat} 
            activeCategory={activeCategory} 
            onClick={setActiveCategory} 
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-gray-400">Загрузка...</p>
        ) : images.length > 0 ? (
          images.map((image) => <PortfolioImageItem key={image.id} image={image} />)
        ) : (
          <p className="col-span-full text-gray-400">Фотографий пока нет</p>
        )}
      </div>
    </section>
  );
}
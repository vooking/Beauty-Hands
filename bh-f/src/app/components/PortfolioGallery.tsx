"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { debounce } from "lodash";
import styles from "@/app/page.module.css";
import "@/app/globals.css";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type PortfolioImage = {
  id: number;
  image_url: string;
  title?: string;
  category: Category;
  url: string;
};

const CategoryButton = ({
  cat,
  activeCategory,
  onClick,
}: {
  cat: Category;
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
);

const PortfolioImageItem = ({
  image,
  onClick,
  priority = false,
}: {
  image: PortfolioImage;
  onClick: () => void;
  priority?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden group cursor-zoom-in"
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100 animate-pulse"
        }`}
      ></div>

      <Image
        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.image_url}`}
        alt={image.title || `portfolio ${image.id}`}
        fill
        quality={80} 
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => {
          toast.error("Ошибка загрузки изображения");
          setLoaded(true);
        }}
      />

      {image.title && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end p-3">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
            {image.title}
          </span>
        </div>
      )}
    </div>
  );
};

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(
    null
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Modal.setAppElement(document.body);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?type=portfolio`
      );
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].slug);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Ошибка загрузки категорий");
    }
  }, []);

  const fetchImages = useCallback(
    debounce(async (categorySlug: string) => {
      if (!categorySlug) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/portfolio?category=${categorySlug}`,
          { signal: controller.signal }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data: PortfolioImage[] = await response.json();
        setImages(data);
      } catch (error) {
        const err = error as Error;

        if (err.name !== "AbortError") {
          console.error("Ошибка загрузки портфолио:", err);
          toast.error("Не удалось загрузить работы");
          setImages([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const openImageModal = useCallback((image: PortfolioImage) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchImages(activeCategory);
    return () => {
      fetchImages.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeCategory, fetchImages]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
  };

  const renderedCategories = useMemo(
    () =>
      categories.map((cat) => (
        <CategoryButton
          key={cat.id}
          cat={cat}
          activeCategory={activeCategory}
          onClick={handleCategoryChange}
        />
      )),
    [categories, activeCategory]
  );

  return (
    <section
      id="portfolio-gallery"
      className="max-w-5xl mx-auto px-4 text-center text-[#4b4845]"
    >
      <h2
        className={`text-3xl md:text-4xl font-semibold mb-8 ${styles.titleMain}`}
      >
        Портфолио работ
      </h2>

      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {renderedCategories}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading && images.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>
          ))
        ) : images.length > 0 ? (
          images.map((image, idx) => (
            <PortfolioImageItem
              key={image.id}
              image={image}
              onClick={() => openImageModal(image)}
              priority={idx < 4}
            />
          ))
        ) : (
          <div className="col-span-full py-10 flex flex-col items-center">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500">Фотографий пока нет</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeImageModal}
        className="modal"
        overlayClassName="modal-overlay"
        contentLabel="Просмотр фотографии"
      >
        {selectedImage && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg z-50 hover:bg-gray-100 transition-colors"
              aria-label="Закрыть"
            >
              <svg
                className="w-8 h-8 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="w-[90vw] h-[85vh] flex items-center justify-center p-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${selectedImage.image_url}`}
                alt={selectedImage.title || ""}
                fill
                quality={100}
                priority
                className="object-contain"
                unoptimized={false} 
              />
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
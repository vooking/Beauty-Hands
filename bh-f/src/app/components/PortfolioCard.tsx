import React from "react";

interface Props {
  item: any;
  category: any;
  onDelete: (id: number) => void;
}

const PortfolioCard: React.FC<Props> = ({ item, category, onDelete }) => {
  return (
    <div className="border p-4 rounded-md relative">
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
        onClick={() => onDelete(item.id)}
        className="text-red-600 text-sm mt-2 hover:underline"
      >
        Удалить
      </button>
    </div>
  );
};

export default React.memo(PortfolioCard);

'use client';

import { Category } from '../types/category';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          selectedCategoryId === null
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
        }`}
      >
        Все
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border backdrop-blur-sm ${
            selectedCategoryId === category.id
              ? 'text-white shadow-lg'
              : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border-gray-600'
          }`}
          style={{
            backgroundColor: selectedCategoryId === category.id ? category.color : undefined,
            borderColor: selectedCategoryId === category.id ? category.color : `${category.color}50`,
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

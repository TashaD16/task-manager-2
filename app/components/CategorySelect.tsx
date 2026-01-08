'use client';

import { Category } from '../types/category';

interface CategorySelectProps {
  categories: Category[];
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

export default function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      <option value="">Без категории</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

'use client';

import { Priority } from '../types/task';
import { Category } from '../types/category';

interface FilterBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedPriority: Priority | null;
  selectedStatus: 'all' | 'active' | 'completed';
  onCategoryChange: (categoryId: string | null) => void;
  onPriorityChange: (priority: Priority | null) => void;
  onStatusChange: (status: 'all' | 'active' | 'completed') => void;
  sortBy: 'created_at' | 'priority';
  onSortChange: (sortBy: 'created_at' | 'priority') => void;
}

export default function FilterBar({
  categories,
  selectedCategoryId,
  selectedPriority,
  selectedStatus,
  onCategoryChange,
  onPriorityChange,
  onStatusChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Категория */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Категория:</label>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[150px]"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Приоритет */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Приоритет:</label>
          <select
            value={selectedPriority || ''}
            onChange={(e) => onPriorityChange((e.target.value || null) as Priority | null)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[130px]"
          >
            <option value="">Все</option>
            <option value="high">🔴 Высокий</option>
            <option value="medium">🟡 Средний</option>
            <option value="low">🟢 Низкий</option>
          </select>
        </div>

        {/* Статус */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Статус:</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as 'all' | 'active' | 'completed')}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[130px]"
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="completed">Выполненные</option>
          </select>
        </div>

        {/* Сортировка */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Сортировка:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'created_at' | 'priority')}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[130px]"
          >
            <option value="created_at">По дате</option>
            <option value="priority">По приоритету</option>
          </select>
        </div>
      </div>
    </div>
  );
}

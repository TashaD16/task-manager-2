'use client';

import { useState, useMemo } from 'react';
import { Plan } from '../types/plan';
import { Task, Priority } from '../types/task';
import { Category } from '../types/category';
import TaskGrid from './TaskGrid';
import TaskCard from './TaskCard';
import FilterBar from './FilterBar';

interface PlanCardProps {
  plan: Plan;
  isExpanded: boolean;
  tasks?: Task[];
  categories: Category[];
  onToggleExpand: (planId: string) => void;
  onSelect: (planId: string) => void;
  onEdit: (plan: Plan) => void;
  onDelete: (planId: string) => void;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

export default function PlanCard({ 
  plan, 
  isExpanded,
  tasks = [],
  categories,
  onToggleExpand,
  onSelect, 
  onEdit, 
  onDelete,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: PlanCardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'priority'>('created_at');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот план? Все задачи в плане также будут удалены.')) {
      onDelete(plan.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(plan);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(plan.id);
  };

  // Фильтрация и сортировка задач
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Фильтр по категории
    if (selectedCategoryId) {
      filtered = filtered.filter(task => task.category_id === selectedCategoryId);
    }

    // Фильтр по приоритету
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Фильтр по статусу
    if (selectedStatus === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (selectedStatus === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Сортировка
    if (sortBy === 'created_at') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    return filtered;
  }, [tasks, selectedCategoryId, selectedPriority, selectedStatus, sortBy]);

  const completionPercentage = plan.completion_percentage || 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 hover:bg-gray-800/70">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100 mb-2">{plan.name}</h3>
            {plan.description && (
              <p className="text-sm text-gray-400">{plan.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleExpand}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title={isExpanded ? 'Свернуть' : 'Развернуть'}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => onSelect(plan.id)}
              className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
              title="Открыть план"
            >
              Открыть
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              Удалить
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Задач: {plan.completed_tasks_count || 0} / {plan.tasks_count || 0}
            </span>
            <span className="text-gray-300 font-semibold">
              {completionPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Развернутые задачи */}
      {isExpanded && (
        <div className="border-t border-gray-700/50 p-4">
          {/* Фильтры и переключатель вида */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <FilterBar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedPriority={selectedPriority}
                selectedStatus={selectedStatus}
                onCategoryChange={setSelectedCategoryId}
                onPriorityChange={setSelectedPriority}
                onStatusChange={setSelectedStatus}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
                  title="Список"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
                  title="Сетка"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Список задач */}
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">Нет задач в этом плане</p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map((task) => (
                <TaskGrid
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete || (() => {})}
                  onEdit={onEditTask || (() => {})}
                  onDelete={onDeleteTask || (() => {})}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete || (() => {})}
                  onEdit={onEditTask || (() => {})}
                  onDelete={onDeleteTask || (() => {})}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

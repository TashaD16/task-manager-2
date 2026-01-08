'use client';

import { Task } from '../types/task';
import PriorityBadge from './PriorityBadge';

interface TaskGridProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskGrid({ task, onToggleComplete, onEdit, onDelete }: TaskGridProps) {
  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete(task.id);
    }
  };

  const borderColor = task.category?.color || '#6B7280';
  const borderStyle = task.completed 
    ? { borderColor: `${borderColor}40` }
    : { borderColor: `${borderColor}80` };

  return (
    <div 
      className={`bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-sm border-2 p-4 transition-all duration-300 h-full flex flex-col ${
        task.completed ? 'opacity-50' : 'hover:shadow-md hover:bg-gray-800/70'
      }`}
      style={borderStyle}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggleComplete(task.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600 relative"
            />
            {task.completed && (
              <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div 
            className={`w-3 h-3 rounded-full ${
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            title={
              task.priority === 'high' ? 'Высокий приоритет' :
              task.priority === 'medium' ? 'Средний приоритет' :
              'Низкий приоритет'
            }
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-all duration-200"
            title="Редактировать"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-200"
            title="Удалить"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-xs mb-2 line-clamp-3 flex-1 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}

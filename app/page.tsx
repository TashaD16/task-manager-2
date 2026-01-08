'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData, Priority } from './types/task';
import { Category } from './types/category';
import { Plan, PlanFormData } from './types/plan';
import { supabase } from './lib/supabase';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import PlanList from './components/PlanList';
import PlanForm from './components/PlanForm';

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [planTasks, setPlanTasks] = useState<Record<string, Task[]>>({});
  
  // Фильтры
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'priority'>('created_at');

  // Загрузка категорий
  useEffect(() => {
    loadCategories();
  }, []);

  // Загрузка планов
  useEffect(() => {
    loadPlans();
  }, []);

  // Загрузка задач при изменении выбранного плана или фильтров
  useEffect(() => {
    if (selectedPlanId) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [selectedPlanId, selectedCategoryId, selectedPriority, selectedStatus, sortBy]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) {
        console.error('Supabase error loading plans:', plansError);
        const errorMessage = plansError.message || 'Неизвестная ошибка';
        const errorCode = plansError.code || 'unknown';
        
        if (errorCode === 'PGRST116' || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
          console.warn('Таблица "plans" не найдена. Показываю пустой список.');
          setPlans([]);
          setLoading(false);
          return;
        } else if (errorCode === '42501' || errorMessage.includes('permission') || errorMessage.includes('RLS')) {
          console.warn('Ошибка доступа к таблице "plans". Проверьте RLS политики.');
          setPlans([]);
          setLoading(false);
          return;
        } else {
          console.error(`Ошибка при загрузке планов: ${errorMessage}`);
          setPlans([]);
          setLoading(false);
          return;
        }
      }

      // Если планов нет, просто устанавливаем пустой массив
      if (!plansData || plansData.length === 0) {
        setPlans([]);
        setLoading(false);
        return;
      }

      // Загружаем статистику по задачам для каждого плана
      const plansWithStats = await Promise.all(
        plansData.map(async (plan) => {
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('id, completed')
            .eq('plan_id', plan.id);

          if (tasksError) {
            console.warn(`Error loading tasks for plan ${plan.id}:`, tasksError);
            return {
              ...plan,
              tasks_count: 0,
              completed_tasks_count: 0,
              completion_percentage: 0,
            };
          }

          const totalTasks = tasksData?.length || 0;
          const completedTasks = tasksData?.filter(t => t.completed).length || 0;
          const completionPercentage = totalTasks > 0 
            ? (completedTasks / totalTasks) * 100 
            : 0;

          return {
            ...plan,
            tasks_count: totalTasks,
            completed_tasks_count: completedTasks,
            completion_percentage: completionPercentage,
          };
        })
      );

      setPlans(plansWithStats);
    } catch (error: any) {
      console.error('Error loading plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    if (!selectedPlanId) return;

    setLoading(true);
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          category:categories(id, name, color)
        `)
        .eq('plan_id', selectedPlanId);

      // Фильтр по категории
      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      }

      // Фильтр по приоритету
      if (selectedPriority) {
        query = query.eq('priority', selectedPriority);
      }

      // Фильтр по статусу
      if (selectedStatus === 'active') {
        query = query.eq('completed', false);
      } else if (selectedStatus === 'completed') {
        query = query.eq('completed', true);
      }

      // Сортировка
      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Преобразуем данные для соответствия типу Task
      let transformedTasks: Task[] = (data || []).map((task: any) => ({
        ...task,
        category: task.category ? {
          name: task.category.name,
          color: task.category.color,
        } : null,
      }));

      // Сортировка по приоритету на клиенте (high > medium > low)
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        transformedTasks = transformedTasks.sort((a, b) => {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      }

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      alert('Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (formData: PlanFormData) => {
    try {
      const { error } = await supabase
        .from('plans')
        .insert([formData]);

      if (error) throw error;
      
      setShowPlanForm(false);
      loadPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Ошибка при создании плана');
    }
  };

  const handleUpdatePlan = async (planId: string, formData: PlanFormData) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', planId);

      if (error) throw error;
      
      setEditingPlan(null);
      setShowPlanForm(false);
      loadPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Ошибка при обновлении плана');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      if (selectedPlanId === planId) {
        setSelectedPlanId(null);
      }
      loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Ошибка при удалении плана');
    }
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const taskData = {
        ...formData,
        plan_id: selectedPlanId,
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;
      
      setShowTaskForm(false);
      loadTasks();
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Ошибка при создании задачи');
    }
  };

  const handleUpdateTask = async (taskId: string, formData: TaskFormData) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(formData)
        .eq('id', taskId);

      if (error) throw error;
      
      setEditingTask(null);
      loadTasks();
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Ошибка при обновлении задачи');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
      loadTasks();
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Ошибка при обновлении задачи');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTasks();
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Ошибка при удалении задачи');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleTaskFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, formData);
    } else {
      handleCreateTask(formData);
    }
  };

  const handlePlanFormSubmit = (formData: PlanFormData) => {
    if (editingPlan) {
      handleUpdatePlan(editingPlan.id, formData);
    } else {
      handleCreatePlan(formData);
    }
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setShowPlanForm(false);
    setEditingTask(null);
    setEditingPlan(null);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setViewMode('grid'); // Устанавливаем режим сетки при открытии плана
  };

  const handleBackToPlans = () => {
    setSelectedPlanId(null);
    setTasks([]);
  };

  const handleToggleExpandPlan = async (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
      setExpandedPlans(newExpanded);
    } else {
      newExpanded.add(planId);
      setExpandedPlans(newExpanded);
      
      // Загружаем задачи плана, если еще не загружены
      if (!planTasks[planId]) {
        try {
          const { data, error } = await supabase
            .from('tasks')
            .select(`
              *,
              category:categories(id, name, color)
            `)
            .eq('plan_id', planId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const transformedTasks = (data || []).map((task: any) => ({
            ...task,
            category: task.category ? {
              name: task.category.name,
              color: task.category.color,
            } : null,
          }));

          setPlanTasks(prev => ({
            ...prev,
            [planId]: transformedTasks,
          }));
        } catch (error) {
          console.error('Error loading plan tasks:', error);
        }
      }
    }
  };

  const handleToggleCompleteInPlan = async (planId: string, taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;
      
      // Обновляем локальное состояние
      setPlanTasks(prev => ({
        ...prev,
        [planId]: prev[planId]?.map(task => 
          task.id === taskId ? { ...task, completed } : task
        ) || [],
      }));
      
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Ошибка при обновлении задачи');
    }
  };

  const handleDeleteTaskInPlan = async (planId: string, taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      // Обновляем локальное состояние
      setPlanTasks(prev => ({
        ...prev,
        [planId]: prev[planId]?.filter(task => task.id !== taskId) || [],
      }));
      
      loadPlans(); // Обновляем статистику планов
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Ошибка при удалении задачи');
    }
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Task Manager
          </h1>
          {selectedPlanId ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToPlans}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all font-medium border border-gray-600"
              >
                ← Назад к планам
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Новая задача
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingPlan(null);
                setShowPlanForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Новый план
              </span>
            </button>
          )}
        </div>

        {selectedPlanId ? (
          <>
            {/* Информация о плане */}
            {selectedPlan && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-100 mb-2">{selectedPlan.name}</h2>
                    {selectedPlan.description && (
                      <p className="text-gray-400 mb-4">{selectedPlan.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">
                        Задач: {selectedPlan.completed_tasks_count || 0} / {selectedPlan.tasks_count || 0}
                      </span>
                      <span className="text-gray-300 font-semibold text-lg">
                        {selectedPlan.completion_percentage?.toFixed(0) || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                        style={{ width: `${selectedPlan.completion_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Фильтры и переключатель вида */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                    }`}
                    title="Список"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Список задач */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-4">Загрузка...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                viewMode={viewMode}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}

            {/* Форма создания/редактирования задачи */}
            {showTaskForm && (
              <TaskForm
                task={editingTask}
                categories={categories}
                onSubmit={handleTaskFormSubmit}
                onCancel={handleFormCancel}
              />
            )}
          </>
        ) : (
          <>
            {/* Список планов */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-4">Загрузка...</p>
              </div>
            ) : (
              <PlanList
                plans={plans}
                expandedPlans={expandedPlans}
                planTasks={planTasks}
                categories={categories}
                onSelectPlan={handleSelectPlan}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
                onToggleExpand={handleToggleExpandPlan}
                onToggleComplete={handleToggleCompleteInPlan}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTaskInPlan}
              />
            )}

            {/* Форма создания/редактирования плана */}
            {showPlanForm && (
              <PlanForm
                plan={editingPlan}
                onSubmit={handlePlanFormSubmit}
                onCancel={handleFormCancel}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

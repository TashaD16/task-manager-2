'use client';

import { Plan } from '../types/plan';
import { Task } from '../types/task';
import { Category } from '../types/category';
import PlanCard from './PlanCard';

interface PlanListProps {
  plans: Plan[];
  expandedPlans: Set<string>;
  planTasks: Record<string, Task[]>;
  categories: Category[];
  onSelectPlan: (planId: string) => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  onToggleExpand: (planId: string) => void;
  onToggleComplete?: (planId: string, taskId: string, completed: boolean) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (planId: string, taskId: string) => void;
}

export default function PlanList({ 
  plans, 
  expandedPlans,
  planTasks,
  categories,
  onSelectPlan, 
  onEditPlan, 
  onDeletePlan,
  onToggleExpand,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: PlanListProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">Нет планов. Создайте новый план!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isExpanded={expandedPlans.has(plan.id)}
          tasks={planTasks[plan.id] || []}
          categories={categories}
          onToggleExpand={onToggleExpand}
          onSelect={onSelectPlan}
          onEdit={onEditPlan}
          onDelete={onDeletePlan}
          onToggleComplete={onToggleComplete ? (id, completed) => onToggleComplete(plan.id, id, completed) : undefined}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask ? (id) => onDeleteTask(plan.id, id) : undefined}
        />
      ))}
    </div>
  );
}

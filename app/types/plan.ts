export interface Plan {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  tasks_count?: number;
  completed_tasks_count?: number;
  completion_percentage?: number;
}

export interface PlanFormData {
  name: string;
  description: string;
}

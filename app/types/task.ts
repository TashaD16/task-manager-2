export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  category_id: string | null;
  plan_id: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    color: string;
  } | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category_id: string | null;
  plan_id: string | null;
}

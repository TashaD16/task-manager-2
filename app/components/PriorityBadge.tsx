import { Priority } from '../types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig = {
  low: {
    label: 'Низкий',
    emoji: '🟢',
    className: 'bg-green-500/20 text-green-400 border-green-500/50',
  },
  medium: {
    label: 'Средний',
    emoji: '🟡',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  },
  high: {
    label: 'Высокий',
    emoji: '🔴',
    className: 'bg-red-500/20 text-red-400 border-red-500/50',
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${config.className}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}

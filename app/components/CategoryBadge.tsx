interface CategoryBadgeProps {
  name: string;
  color: string;
}

export default function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}50`,
      }}
    >
      {name}
    </span>
  );
}

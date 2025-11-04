import type { TaskFilter } from '../types/task';

interface FilterButtonsProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  const filters: Array<{ value: TaskFilter; label: string; icon: string }> = [
    { value: 'all', label: 'Todas', icon: 'list-ul' },
    { value: 'pending', label: 'Pendentes', icon: 'clock' },
    { value: 'completed', label: 'Concluídas', icon: 'check-circle' },
  ];

  return (
    <div className="btn-group w-100 mb-3" role="group">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`btn ${
            activeFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          <i className={`bi bi-${filter.icon} me-2`}></i>
          {filter.label}
        </button>
      ))}
    </div>
  );
}

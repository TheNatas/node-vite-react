import type { Task, UpdateTaskDTO } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onUpdate: (id: string, data: UpdateTaskDTO) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TaskList({ tasks, onToggle, onUpdate, onDelete, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox display-1 text-muted"></i>
        <p className="text-muted mt-3">Nenhuma tarefa encontrada</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

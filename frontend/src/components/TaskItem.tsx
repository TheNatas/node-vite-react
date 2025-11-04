import { useState } from 'react';
import type { Task, UpdateTaskDTO } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onUpdate: (id: string, data: UpdateTaskDTO) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave = () => {
    if (editTitle.trim() && editDescription.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`card mb-3 shadow-sm ${task.completed ? 'border-success' : ''}`}>
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                <i className="bi bi-check-lg me-1"></i>
                Salvar
              </button>
              <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x-lg me-1"></i>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex align-items-start">
              <div className="form-check me-3 mt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task)}
                  id={`task-${task.id}`}
                />
              </div>
              <div className="flex-grow-1">
                <h5 className={`card-title mb-2 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {task.title}
                </h5>
                <p className={`card-text ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {task.description}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    Criado: {formatDate(task.createdAt)}
                  </small>
                  {task.completed && (
                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Concluída
                    </span>
                  )}
                </div>
              </div>
              <div className="ms-3">
                <div className="btn-group-vertical">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setIsEditing(true)}
                    disabled={task.completed}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

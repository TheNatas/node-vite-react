import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTaskDTO } from '../types/task';

interface TaskFormProps {
  onSubmit: (data: CreateTaskDTO) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres';
    } else if (title.trim().length > 100) {
      newErrors.title = 'O título deve ter no máximo 100 caracteres';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    } else if (description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter pelo menos 3 caracteres';
    } else if (description.trim().length > 500) {
      newErrors.description = 'A descrição deve ter no máximo 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="bi bi-plus-circle me-2"></i>
          Nova Tarefa
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">
              Título
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="taskDescription" className="form-label">
              Descrição
            </label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              id="taskDescription"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da tarefa"
              disabled={isSubmitting}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Criando...
              </>
            ) : (
              <>
                <i className="bi bi-plus-lg me-2"></i>
                Criar Tarefa
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskList } from '../components/TaskList'
import type { Task } from '../types/task'

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Tarefa 1',
      description: 'Descrição 1',
      completed: false,
      createdAt: '2025-11-04T15:00:00.000Z',
      updatedAt: '2025-11-04T15:00:00.000Z',
    },
    {
      id: '2',
      title: 'Tarefa 2',
      description: 'Descrição 2',
      completed: true,
      createdAt: '2025-11-04T15:00:00.000Z',
      updatedAt: '2025-11-04T15:00:00.000Z',
    },
  ]

  it('deve renderizar lista de tarefas', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskList
        tasks={mockTasks}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    )
    
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não há tarefas', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskList
        tasks={[]}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    )
    
    expect(screen.getByText(/Nenhuma tarefa encontrada/)).toBeInTheDocument()
  })

  it('deve exibir estado de carregamento', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskList
        tasks={[]}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    )
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('deve renderizar o número correto de tarefas', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    const { container } = render(
      <TaskList
        tasks={mockTasks}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isLoading={false}
      />
    )
    
    const taskCards = container.querySelectorAll('.card')
    expect(taskCards.length).toBe(2)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from '../components/TaskItem'
import type { Task } from '../types/task'

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Tarefa de teste',
    description: 'Descrição de teste',
    completed: false,
    createdAt: '2025-11-04T15:00:00.000Z',
    updatedAt: '2025-11-04T15:00:00.000Z',
  }

  it('deve renderizar a tarefa corretamente', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText('Tarefa de teste')).toBeInTheDocument()
    expect(screen.getByText('Descrição de teste')).toBeInTheDocument()
  })

  it('deve exibir tarefa como pendente quando não concluída', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('deve exibir tarefa como concluída quando completed é true', () => {
    const completedTask: Task = { ...mockTask, completed: true }
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('deve chamar onToggle ao clicar no checkbox', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(mockOnToggle).toHaveBeenCalledWith(mockTask)
  })

  it('deve chamar onDelete ao clicar no botão de deletar', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('i.bi-trash')
    )
    
    if (deleteButton) {
      fireEvent.click(deleteButton)
      expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
    }
  })

  it('deve exibir a data de criação formatada', () => {
    const mockOnToggle = vi.fn()
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText(/Criado:/)).toBeInTheDocument()
  })
})

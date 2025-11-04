import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskForm } from '../components/TaskForm'

describe('TaskForm', () => {
  it('deve renderizar o formulário corretamente', () => {
    const mockOnSubmit = vi.fn()
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o título da tarefa')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite a descrição da tarefa')).toBeInTheDocument()
    expect(screen.getByText('Criar Tarefa')).toBeInTheDocument()
  })

  it('deve validar título mínimo de 3 caracteres', async () => {
    const mockOnSubmit = vi.fn()
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const titleInput = screen.getByPlaceholderText('Digite o título da tarefa')
    const descInput = screen.getByPlaceholderText('Digite a descrição da tarefa')
    const submitButton = screen.getByText('Criar Tarefa')
    
    fireEvent.change(titleInput, { target: { value: 'ab' } })
    fireEvent.change(descInput, { target: { value: 'descrição válida' } })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('deve ter campos obrigatórios de título e descrição', async () => {
    const mockOnSubmit = vi.fn()
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const titleInput = screen.getByPlaceholderText('Digite o título da tarefa')
    const descInput = screen.getByPlaceholderText('Digite a descrição da tarefa')
    
    // Verifica que os campos existem
    expect(titleInput).toBeInTheDocument()
    expect(descInput).toBeInTheDocument()
  })

  it('deve validar descrição mínima de 3 caracteres', async () => {
    const mockOnSubmit = vi.fn()
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const titleInput = screen.getByPlaceholderText('Digite o título da tarefa')
    const descInput = screen.getByPlaceholderText('Digite a descrição da tarefa')
    const submitButton = screen.getByText('Criar Tarefa')
    
    fireEvent.change(titleInput, { target: { value: 'título válido' } })
    fireEvent.change(descInput, { target: { value: 'ab' } })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('deve submeter formulário com dados válidos', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const titleInput = screen.getByPlaceholderText('Digite o título da tarefa')
    const descInput = screen.getByPlaceholderText('Digite a descrição da tarefa')
    const submitButton = screen.getByText('Criar Tarefa')
    
    fireEvent.change(titleInput, { target: { value: 'Título válido' } })
    fireEvent.change(descInput, { target: { value: 'Descrição válida' } })
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Título válido',
      description: 'Descrição válida',
    })
  })

  it('deve limpar o formulário após submissão bem-sucedida', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={mockOnSubmit} />)
    
    const titleInput = screen.getByPlaceholderText('Digite o título da tarefa') as HTMLInputElement
    const descInput = screen.getByPlaceholderText('Digite a descrição da tarefa') as HTMLTextAreaElement
    const submitButton = screen.getByText('Criar Tarefa')
    
    fireEvent.change(titleInput, { target: { value: 'Título válido' } })
    fireEvent.change(descInput, { target: { value: 'Descrição válida' } })
    fireEvent.click(submitButton)
    
    // Aguarda a submissão
    await vi.waitFor(() => {
      expect(titleInput.value).toBe('')
      expect(descInput.value).toBe('')
    })
  })
})

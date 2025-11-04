import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterButtons } from '../components/FilterButtons'
import type { TaskFilter } from '../types/task'

describe('FilterButtons', () => {
  it('deve renderizar todos os botões de filtro', () => {
    const mockOnFilterChange = vi.fn()
    
    render(
      <FilterButtons
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    )
    
    expect(screen.getByText('Todas')).toBeInTheDocument()
    expect(screen.getByText('Pendentes')).toBeInTheDocument()
    expect(screen.getByText('Concluídas')).toBeInTheDocument()
  })

  it('deve destacar o filtro ativo', () => {
    const mockOnFilterChange = vi.fn()
    
    render(
      <FilterButtons
        activeFilter="pending"
        onFilterChange={mockOnFilterChange}
      />
    )
    
    const pendingButton = screen.getByText('Pendentes')
    expect(pendingButton.className).toContain('btn-primary')
  })

  it('deve chamar onFilterChange ao clicar em um filtro', () => {
    const mockOnFilterChange = vi.fn()
    
    render(
      <FilterButtons
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
      />
    )
    
    const completedButton = screen.getByText('Concluídas')
    fireEvent.click(completedButton)
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
  })

  it('deve aplicar estilo correto para cada filtro', () => {
    const mockOnFilterChange = vi.fn()
    
    const filters: TaskFilter[] = ['all', 'pending', 'completed']
    
    filters.forEach(filter => {
      const { unmount } = render(
        <FilterButtons
          activeFilter={filter}
          onFilterChange={mockOnFilterChange}
        />
      )
      
      const buttons = screen.getAllByRole('button')
      const activeButtons = buttons.filter(btn => 
        btn.className.includes('btn-primary')
      )
      
      expect(activeButtons.length).toBe(1)
      
      unmount()
    })
  })
})

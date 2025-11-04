import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../components/SearchBar'

describe('SearchBar', () => {
  it('deve renderizar o campo de busca', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    expect(screen.getByPlaceholderText('Buscar por título ou descrição...')).toBeInTheDocument()
  })

  it('deve chamar onSearch ao digitar', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Buscar por título ou descrição...')
    fireEvent.change(searchInput, { target: { value: 'teste' } })
    
    expect(mockOnSearch).toHaveBeenCalledWith('teste')
  })

  it('deve exibir o valor digitado', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Buscar por título ou descrição...') as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'busca teste' } })
    
    expect(searchInput.value).toBe('busca teste')
  })

  it('deve limpar o campo ao clicar no botão de limpar', () => {
    const mockOnSearch = vi.fn()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const searchInput = screen.getByPlaceholderText('Buscar por título ou descrição...') as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'teste' } })
    
    expect(searchInput.value).toBe('teste')
    
    // Procura pelo botão com ícone de limpar
    const clearButton = screen.getByRole('button')
    if (clearButton) {
      fireEvent.click(clearButton)
      expect(mockOnSearch).toHaveBeenCalledWith('')
    }
  })
})

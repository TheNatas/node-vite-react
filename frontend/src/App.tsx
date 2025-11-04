import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { FilterButtons } from './components/FilterButtons'
import { SearchBar } from './components/SearchBar'
import { TaskList } from './components/TaskList'
import { taskService } from './services/taskService'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilter, TaskStats } from './types/task'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, filter, searchQuery])

  useEffect(() => {
    updateStats()
  }, [tasks])

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (error) {
      toast.error('Erro ao carregar tarefas')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]
    if (filter === 'pending') {
      filtered = filtered.filter((task) => !task.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      )
    }
    setFilteredTasks(filtered)
  }

  const updateStats = () => {
    const completed = tasks.filter((task) => task.completed).length
    const pending = tasks.filter((task) => !task.completed).length
    setStats({ total: tasks.length, completed, pending })
  }

  const handleCreateTask = async (data: CreateTaskDTO) => {
    try {
      const newTask = await taskService.createTask(data)
      setTasks((prev) => [newTask, ...prev])
      toast.success('Tarefa criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar tarefa')
      console.error(error)
      throw error
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await taskService.toggleTask(task)
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
      toast.success(updated.completed ? 'Tarefa concluída!' : 'Tarefa marcada como pendente')
    } catch (error) {
      toast.error('Erro ao atualizar tarefa')
      console.error(error)
    }
  }

  const handleUpdateTask = async (id: string, data: UpdateTaskDTO) => {
    try {
      const updated = await taskService.updateTask(id, data)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      toast.success('Tarefa atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar tarefa')
      console.error(error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return
    try {
      await taskService.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tarefa excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir tarefa')
      console.error(error)
    }
  }

  const handleExport = () => {
    try {
      taskService.exportTasks(tasks)
      toast.success('Tarefas exportadas com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar tarefas')
      console.error(error)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const importedTasks = await taskService.importTasks(file)
      for (const task of importedTasks) {
        await taskService.createTask({ title: task.title, description: task.description })
      }
      await loadTasks()
      toast.success(`${importedTasks.length} tarefas importadas com sucesso!`)
    } catch (error) {
      toast.error('Erro ao importar tarefas')
      console.error(error)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header stats={stats} onExport={handleExport} onImport={handleImportClick} />
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
          <div className="col-lg-8">
            <FilterButtons activeFilter={filter} onFilterChange={setFilter} />
            <SearchBar onSearch={setSearchQuery} />
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggleTask}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App

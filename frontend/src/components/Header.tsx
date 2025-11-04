import { useTheme } from '../hooks/useTheme';
import type { TaskStats } from '../types/task';

interface HeaderProps {
  stats: TaskStats;
  onExport: () => void;
  onImport: () => void;
}

export function Header({ stats, onExport, onImport }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-primary text-white shadow-sm">
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h1 className="h3 mb-0">
              <i className="bi bi-check2-square me-2"></i>
              TODO App
            </h1>
          </div>
          
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center gap-3 mt-3 mt-md-0">
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.total}</div>
                <small className="text-white-50">Total</small>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.pending}</div>
                <small className="text-white-50">Pendentes</small>
              </div>
              <div className="text-center">
                <div className="fs-4 fw-bold">{stats.completed}</div>
                <small className="text-white-50">Concluídas</small>
              </div>
            </div>
          </div>

          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="btn-group">
              <button
                className="btn btn-outline-light"
                onClick={onExport}
                title="Exportar tarefas"
              >
                <i className="bi bi-download"></i>
              </button>
              <button
                className="btn btn-outline-light"
                onClick={onImport}
                title="Importar tarefas"
              >
                <i className="bi bi-upload"></i>
              </button>
              <button
                className="btn btn-outline-light"
                onClick={toggleTheme}
                title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
              >
                <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

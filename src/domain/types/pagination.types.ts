/**
 * Respuesta paginada genérica.
 * Todas las listas del API deben usar este formato:
 * { data: T[], meta: PaginationMeta }
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Parámetros de paginación y filtros comunes.
 */
export interface PaginationParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface ExpenseFilters extends PaginationParams {
  category?: string;
}

export interface GoalFilters extends PaginationParams {
  status?: 'active' | 'completed';
}

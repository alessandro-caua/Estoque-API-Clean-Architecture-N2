// ============================================================================
// INTERFACE: IAUDITLOGREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de logs de auditoria.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - Rastreabilidade de ações do sistema
// - Segurança e conformidade
// ============================================================================

import { AuditLog, AuditAction } from '../entities/AuditLog';

/**
 * Filtros para busca de logs de auditoria
 */
export interface AuditLogFilters {
  /** Filtrar por usuário */
  userId?: string;
  /** Filtrar por tipo de ação */
  action?: AuditAction;
  /** Filtrar por entidade afetada */
  entity?: string;
  /** Filtrar por ID da entidade afetada */
  entityId?: string;
  /** Data inicial do período */
  startDate?: Date;
  /** Data final do período */
  endDate?: Date;
  /** Filtrar apenas ações críticas */
  criticalOnly?: boolean;
  /** Busca textual por descrição */
  search?: string;
}

/**
 * Interface do repositório de AuditLog - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de logs de auditoria deve fornecer.
 */
export interface IAuditLogRepository {
  /**
   * Cria um novo registro de auditoria
   * @param log - Entidade AuditLog a ser persistida
   * @returns Promise com o log criado (incluindo ID gerado)
   */
  create(log: AuditLog): Promise<AuditLog>;

  /**
   * Busca um log pelo ID
   * @param id - Identificador único do log
   * @returns Promise com o log encontrado ou null
   */
  findById(id: string): Promise<AuditLog | null>;

  /**
   * Lista todos os logs com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de logs
   */
  findAll(filters?: AuditLogFilters): Promise<AuditLog[]>;

  /**
   * Busca logs com paginação
   * @param page - Número da página
   * @param limit - Quantidade por página
   * @param filters - Filtros opcionais
   * @returns Promise com logs e metadados de paginação
   */
  findPaginated(page: number, limit: number, filters?: AuditLogFilters): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  /**
   * Busca logs de um usuário específico
   * @param userId - ID do usuário
   * @returns Promise com array de logs
   */
  findByUserId(userId: string): Promise<AuditLog[]>;

  /**
   * Busca logs de uma entidade específica
   * @param entity - Nome da entidade (ex: 'Product', 'Sale')
   * @param entityId - ID da entidade (opcional)
   * @returns Promise com array de logs
   */
  findByEntity(entity: string, entityId?: string): Promise<AuditLog[]>;

  /**
   * Busca logs de um tipo de ação específico
   * @param action - Tipo de ação
   * @returns Promise com array de logs
   */
  findByAction(action: AuditAction): Promise<AuditLog[]>;

  /**
   * Busca logs em um período
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Promise com array de logs
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;

  /**
   * Busca apenas logs de ações críticas
   * @param startDate - Data inicial (opcional)
   * @param endDate - Data final (opcional)
   * @returns Promise com array de logs críticos
   */
  findCriticalActions(startDate?: Date, endDate?: Date): Promise<AuditLog[]>;

  /**
   * Conta o total de logs
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: AuditLogFilters): Promise<number>;

  /**
   * Obtém as últimas ações de um usuário
   * @param userId - ID do usuário
   * @param limit - Quantidade de registros
   * @returns Promise com array de logs mais recentes
   */
  getLatestByUser(userId: string, limit: number): Promise<AuditLog[]>;

  /**
   * Obtém os últimos logs do sistema
   * @param limit - Quantidade de registros
   * @returns Promise com array de logs mais recentes
   */
  getLatest(limit: number): Promise<AuditLog[]>;

  /**
   * Remove logs antigos (para manutenção)
   * @param olderThan - Data limite (logs anteriores serão removidos)
   * @returns Promise com quantidade de registros removidos
   */
  deleteOlderThan(olderThan: Date): Promise<number>;
}

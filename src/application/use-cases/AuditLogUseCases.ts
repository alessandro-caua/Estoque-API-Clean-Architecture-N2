// ============================================================================
// USE CASES: AUDIT LOG (LOG DE AUDITORIA)
// ============================================================================
// Casos de uso para gerenciamento de logs de auditoria.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// Requisitos atendidos:
// - RF20: Registro de logs de todas as operações
// - RF21: Rastreabilidade de alterações
// ============================================================================

import { AuditLog, AuditAction } from '../../domain/entities/AuditLog';
import { IAuditLogRepository, AuditLogFilters } from '../../domain/repositories/IAuditLogRepository';

// ==================== DTOs ====================

/**
 * DTO para criação de log de auditoria
 */
export interface CreateAuditLogDTO {
  /** ID do usuário que realizou a ação */
  userId: string;
  /** Tipo de ação */
  action: AuditAction;
  /** Entidade afetada */
  entity: string;
  /** ID da entidade */
  entityId?: string;
  /** Detalhes em JSON */
  details?: string;
  /** Endereço IP */
  ipAddress?: string;
}

/**
 * DTO para filtros de busca de logs
 */
export interface SearchAuditLogsDTO {
  /** ID do usuário */
  userId?: string;
  /** Tipo de ação */
  action?: AuditAction;
  /** Tipo de entidade */
  entity?: string;
  /** ID da entidade */
  entityId?: string;
  /** Data inicial */
  startDate?: Date;
  /** Data final */
  endDate?: Date;
  /** Texto para busca */
  search?: string;
  /** Página */
  page?: number;
  /** Itens por página */
  limit?: number;
}

/**
 * DTO para resultado paginado
 */
export interface AuditLogPaginatedResultDTO {
  /** Lista de logs */
  data: AuditLog[];
  /** Total de registros */
  total: number;
  /** Página atual */
  page: number;
  /** Total de páginas */
  totalPages: number;
}

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Log de Auditoria (RF20)
 * @description Registra uma nova entrada no log de auditoria
 */
export class CreateAuditLogUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a criação de um log de auditoria
   * @param data Dados do log
   * @returns Log criado
   */
  async execute(data: CreateAuditLogDTO): Promise<AuditLog> {
    const log = new AuditLog({
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      details: data.details,
      ipAddress: data.ipAddress,
    });

    return this.auditLogRepository.create(log);
  }
}

/**
 * Caso de Uso: Buscar Logs de Auditoria (RF21)
 * @description Busca logs de auditoria com filtros e paginação
 */
export class SearchAuditLogsUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca de logs
   * @param filters Filtros de busca
   * @returns Lista paginada de logs
   */
  async execute(filters: SearchAuditLogsDTO): Promise<AuditLogPaginatedResultDTO> {
    const page = filters.page || 1;
    const limit = filters.limit || 50;

    const repositoryFilters: AuditLogFilters = {
      userId: filters.userId,
      action: filters.action,
      entity: filters.entity,
      entityId: filters.entityId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      search: filters.search,
    };

    return this.auditLogRepository.findPaginated(page, limit, repositoryFilters);
  }
}

/**
 * Caso de Uso: Obter Log por ID
 * @description Busca um log específico por seu ID
 */
export class GetAuditLogByIdUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca do log
   * @param id ID do log
   * @returns Log encontrado ou null
   */
  async execute(id: string): Promise<AuditLog | null> {
    return this.auditLogRepository.findById(id);
  }
}

/**
 * Caso de Uso: Obter Histórico de Entidade (RF21)
 * @description Busca todo o histórico de alterações de uma entidade
 */
export class GetEntityHistoryUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca do histórico
   * @param entity Tipo da entidade
   * @param entityId ID da entidade
   * @returns Lista de logs da entidade
   */
  async execute(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByEntity(entity, entityId);
  }
}

/**
 * Caso de Uso: Obter Atividades do Usuário (RF21)
 * @description Busca todas as atividades de um usuário específico
 */
export class GetUserActivityUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca de atividades
   * @param userId ID do usuário
   * @returns Lista de atividades do usuário
   */
  async execute(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId);
  }
}

/**
 * Caso de Uso: Obter Logs por Tipo de Ação
 * @description Retorna logs filtrados por tipo de ação
 */
export class GetLogsByActionUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca por ação
   * @param action Tipo de ação
   * @returns Lista de logs
   */
  async execute(action: AuditAction): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }
}

/**
 * Caso de Uso: Obter Logs por Período
 * @description Retorna logs de um período específico
 */
export class GetLogsByPeriodUseCase {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  /**
   * Executa a busca por período
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Lista de logs
   */
  async execute(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll({
      startDate,
      endDate,
    });
  }
}

// ==================== HELPER SERVICE ====================

/**
 * Serviço auxiliar para criar logs de auditoria de forma simplificada
 */
export class AuditLogService {
  constructor(private createAuditLogUseCase: CreateAuditLogUseCase) {}

  /**
   * Registra criação de entidade
   */
  async logCreate(
    userId: string,
    entity: string,
    entityId: string,
    newData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.CREATE,
      entity,
      entityId,
      details: JSON.stringify(newData),
      ipAddress,
    });
  }

  /**
   * Registra atualização de entidade
   */
  async logUpdate(
    userId: string,
    entity: string,
    entityId: string,
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.UPDATE,
      entity,
      entityId,
      details: JSON.stringify({ oldData, newData }),
      ipAddress,
    });
  }

  /**
   * Registra exclusão de entidade
   */
  async logDelete(
    userId: string,
    entity: string,
    entityId: string,
    oldData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.DELETE,
      entity,
      entityId,
      details: JSON.stringify(oldData),
      ipAddress,
    });
  }

  /**
   * Registra login de usuário
   */
  async logLogin(
    userId: string,
    success: boolean,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
      entity: 'User',
      entityId: userId,
      details: JSON.stringify({ success }),
      ipAddress,
    });
  }

  /**
   * Registra logout de usuário
   */
  async logLogout(
    userId: string,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.LOGOUT,
      entity: 'User',
      entityId: userId,
      ipAddress,
    });
  }

  /**
   * Registra venda realizada
   */
  async logSale(
    userId: string,
    saleId: string,
    saleData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.SALE,
      entity: 'Sale',
      entityId: saleId,
      details: JSON.stringify(saleData),
      ipAddress,
    });
  }

  /**
   * Registra cancelamento de venda
   */
  async logSaleCancelled(
    userId: string,
    saleId: string,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.SALE_CANCELLED,
      entity: 'Sale',
      entityId: saleId,
      details: JSON.stringify({ reason }),
      ipAddress,
    });
  }

  /**
   * Registra movimentação de estoque
   */
  async logStockMovement(
    userId: string,
    movementId: string,
    movementData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.STOCK_MOVEMENT,
      entity: 'StockMovement',
      entityId: movementId,
      details: JSON.stringify(movementData),
      ipAddress,
    });
  }

  /**
   * Registra pagamento
   */
  async logPayment(
    userId: string,
    paymentId: string,
    paymentData: Record<string, unknown>,
    ipAddress?: string
  ): Promise<void> {
    await this.createAuditLogUseCase.execute({
      userId,
      action: AuditAction.PAYMENT,
      entity: 'Payment',
      entityId: paymentId,
      details: JSON.stringify(paymentData),
      ipAddress,
    });
  }
}

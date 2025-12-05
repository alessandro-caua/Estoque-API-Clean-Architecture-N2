// ============================================================================
// USE CASES: FINANCIAL (FINANCEIRO)
// ============================================================================
// Casos de uso para operações financeiras.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// CONCEITO: Contas a Pagar vs Contas a Receber
// ============================================
// - PAYABLE (A Pagar): Dinheiro que SAI (compras, despesas)
// - RECEIVABLE (A Receber): Dinheiro que ENTRA (vendas, fiado)
// 
// Estados possíveis:
// - PENDING: Aguardando pagamento
// - PAID: Paga/Recebida
// - OVERDUE: Vencida
// - CANCELLED: Cancelada
// 
// Requisitos atendidos:
// - RF15: Registro de contas a pagar
// - RF16: Registro de contas a receber
// - RF17: Relatórios financeiros (fluxo de caixa)
// ============================================================================

import { 
  FinancialAccount, 
  AccountType, 
  AccountStatus,
  AccountCategory 
} from '../../domain/entities/FinancialAccount';
import { 
  IFinancialAccountRepository, 
  FinancialAccountFilters,
  FinancialSummary 
} from '../../domain/repositories/IFinancialAccountRepository';

// Importando DTOs da pasta centralizada
import { CreateFinancialAccountDTO, RegisterPaymentDTO } from '../dtos';

// Importando erros de domínio específicos
import { 
  EntityNotFoundError, 
  InvalidEntityStateError 
} from '../../domain/errors';

// Re-exportando DTOs para manter compatibilidade
export { CreateFinancialAccountDTO, RegisterPaymentDTO as RegisterAccountPaymentDTO } from '../dtos';

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Conta a Pagar (RF15)
 */
export class CreatePayableAccountUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(data: CreateFinancialAccountDTO): Promise<FinancialAccount> {
    const account = new FinancialAccount({
      ...data,
      type: AccountType.PAYABLE,
      status: AccountStatus.PENDING,
    });

    return this.financialAccountRepository.create(account);
  }
}

/**
 * Caso de Uso: Criar Conta a Receber (RF16)
 */
export class CreateReceivableAccountUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(data: CreateFinancialAccountDTO): Promise<FinancialAccount> {
    const account = new FinancialAccount({
      ...data,
      type: AccountType.RECEIVABLE,
      status: AccountStatus.PENDING,
    });

    return this.financialAccountRepository.create(account);
  }
}

/**
 * Caso de Uso: Buscar Conta por ID
 */
export class GetAccountByIdUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(id: string): Promise<FinancialAccount | null> {
    return this.financialAccountRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Contas com Filtros
 */
export class GetPaginatedAccountsUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(filters?: FinancialAccountFilters): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findAll(filters);
  }
}

/**
 * Caso de Uso: Listar Contas Vencidas
 */
export class GetOverdueAccountsUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findOverdue();
  }
}

/**
 * Caso de Uso: Listar Contas a Vencer
 */
export class GetDueSoonAccountsUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(days: number = 7): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findDueSoon(days);
  }
}

/**
 * Caso de Uso: Registrar Pagamento de Conta
 */
export class RegisterAccountPaymentUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(data: RegisterPaymentDTO): Promise<FinancialAccount> {
    const account = await this.financialAccountRepository.findById(data.accountId);
    if (!account) {
      throw new EntityNotFoundError('Conta', data.accountId);
    }

    if (account.status === AccountStatus.PAID) {
      throw new InvalidEntityStateError('Conta', 'pagar', 'já foi paga');
    }

    if (account.status === AccountStatus.CANCELLED) {
      throw new InvalidEntityStateError('Conta', 'pagar', 'foi cancelada');
    }

    // Registra o pagamento
    return this.financialAccountRepository.pay(
      data.accountId,
      data.paidAt ?? new Date()
    );
  }
}

/**
 * Caso de Uso: Cancelar Conta
 */
export class CancelAccountUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(id: string): Promise<FinancialAccount> {
    const account = await this.financialAccountRepository.findById(id);
    if (!account) {
      throw new EntityNotFoundError('Conta', id);
    }

    if (account.status === AccountStatus.PAID) {
      throw new InvalidEntityStateError('Conta', 'cancelar', 'já foi paga');
    }

    return this.financialAccountRepository.cancel(id);
  }
}

/**
 * Caso de Uso: Obter Resumo Financeiro (RF17)
 */
export class GetFinancialSummaryUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<FinancialSummary> {
    return this.financialAccountRepository.getSummary(startDate, endDate);
  }
}

/**
 * Caso de Uso: Contas por Período
 */
export class GetAccountsByPeriodUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(startDate: Date, endDate: Date, type?: AccountType): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findByPeriod(startDate, endDate, type);
  }
}

/**
 * Caso de Uso: Contas por Tipo
 */
export class GetAccountsByTypeUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(type: AccountType): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findByType(type);
  }
}

/**
 * Caso de Uso: Contas por Status
 */
export class GetAccountsByStatusUseCase {
  constructor(private financialAccountRepository: IFinancialAccountRepository) {}

  async execute(status: AccountStatus): Promise<FinancialAccount[]> {
    return this.financialAccountRepository.findByStatus(status);
  }
}

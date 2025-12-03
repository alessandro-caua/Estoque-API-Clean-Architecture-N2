// ============================================================================
// REPOSITÓRIO PRISMA: FINANCIAL ACCOUNT (CONTAS FINANCEIRAS)
// ============================================================================
// Implementação do repositório de contas financeiras usando Prisma ORM.
// Camada de Infraestrutura - Implementa a interface definida no domínio.
// ============================================================================

import { PrismaClient } from '@prisma/client';
import { FinancialAccount, AccountType, AccountStatus, AccountCategory } from '../../domain/entities/FinancialAccount';
import { IFinancialAccountRepository, FinancialAccountFilters, FinancialSummary } from '../../domain/repositories/IFinancialAccountRepository';

/**
 * Repositório Prisma para a entidade FinancialAccount
 * @implements {IFinancialAccountRepository}
 */
export class PrismaFinancialAccountRepository implements IFinancialAccountRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova conta financeira
   */
  async create(account: FinancialAccount): Promise<FinancialAccount> {
    const created = await this.prisma.financialAccount.create({
      data: {
        type: account.type,
        description: account.description,
        amount: account.amount,
        dueDate: account.dueDate,
        paidDate: account.paidDate,
        status: account.status,
        category: account.category,
        referenceId: account.referenceId,
        notes: account.notes,
      },
    });

    return this.mapToEntity(created);
  }

  /**
   * Busca uma conta pelo ID
   */
  async findById(id: string): Promise<FinancialAccount | null> {
    const account = await this.prisma.financialAccount.findUnique({
      where: { id },
    });

    return account ? this.mapToEntity(account) : null;
  }

  /**
   * Lista todas as contas com filtros
   */
  async findAll(filters?: FinancialAccountFilters): Promise<FinancialAccount[]> {
    const where = this.buildWhereClause(filters);

    const accounts = await this.prisma.financialAccount.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Busca contas por tipo
   */
  async findByType(type: AccountType): Promise<FinancialAccount[]> {
    const accounts = await this.prisma.financialAccount.findMany({
      where: { type },
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Busca contas por status
   */
  async findByStatus(status: AccountStatus): Promise<FinancialAccount[]> {
    const accounts = await this.prisma.financialAccount.findMany({
      where: { status },
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Busca contas vencidas
   */
  async findOverdue(): Promise<FinancialAccount[]> {
    const accounts = await this.prisma.financialAccount.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: new Date() },
      },
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Busca contas a vencer em X dias
   */
  async findDueSoon(days: number): Promise<FinancialAccount[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const accounts = await this.prisma.financialAccount.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          gte: today,
          lte: futureDate,
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Busca contas por período
   */
  async findByPeriod(startDate: Date, endDate: Date, type?: AccountType): Promise<FinancialAccount[]> {
    const where: Record<string, unknown> = {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (type) {
      where.type = type;
    }

    const accounts = await this.prisma.financialAccount.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    return accounts.map(a => this.mapToEntity(a));
  }

  /**
   * Atualiza uma conta
   */
  async update(id: string, data: Partial<FinancialAccount>): Promise<FinancialAccount> {
    const updated = await this.prisma.financialAccount.update({
      where: { id },
      data: {
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate,
        paidDate: data.paidDate,
        status: data.status,
        category: data.category,
        notes: data.notes,
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Registra pagamento de uma conta
   */
  async pay(id: string, paidDate: Date): Promise<FinancialAccount> {
    const updated = await this.prisma.financialAccount.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate,
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Cancela uma conta
   */
  async cancel(id: string): Promise<FinancialAccount> {
    const updated = await this.prisma.financialAccount.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Exclui uma conta
   */
  async delete(id: string): Promise<void> {
    await this.prisma.financialAccount.delete({
      where: { id },
    });
  }

  /**
   * Conta registros com filtros
   */
  async count(filters?: FinancialAccountFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.financialAccount.count({ where });
  }

  /**
   * Retorna resumo financeiro do período
   */
  async getSummary(startDate: Date, endDate: Date): Promise<FinancialSummary> {
    const accounts = await this.prisma.financialAccount.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: 'CANCELLED' },
      },
    });

    const now = new Date();
    let totalPayable = 0;
    let totalReceivable = 0;
    let totalPaid = 0;
    let totalReceived = 0;
    let overduePayable = 0;
    let overdueReceivable = 0;

    accounts.forEach(account => {
      if (account.type === 'PAYABLE') {
        totalPayable += account.amount;
        if (account.status === 'PAID') {
          totalPaid += account.amount;
        }
        if (account.status === 'PENDING' && account.dueDate < now) {
          overduePayable += account.amount;
        }
      } else {
        totalReceivable += account.amount;
        if (account.status === 'PAID') {
          totalReceived += account.amount;
        }
        if (account.status === 'PENDING' && account.dueDate < now) {
          overdueReceivable += account.amount;
        }
      }
    });

    return {
      totalPayable,
      totalReceivable,
      totalPaid,
      totalReceived,
      overduePayable,
      overdueReceivable,
      balance: totalReceivable - totalPayable,
    };
  }

  /**
   * Constrói cláusula WHERE
   */
  private buildWhereClause(filters?: FinancialAccountFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (!filters) return where;

    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.startDate || filters.endDate) {
      where.dueDate = {};
      if (filters.startDate) {
        (where.dueDate as Record<string, unknown>).gte = filters.startDate;
      }
      if (filters.endDate) {
        (where.dueDate as Record<string, unknown>).lte = filters.endDate;
      }
    }

    return where;
  }

  /**
   * Mapeia registro do Prisma para entidade de domínio
   */
  private mapToEntity(data: {
    id: string;
    type: string;
    description: string;
    amount: number;
    dueDate: Date;
    paidDate: Date | null;
    status: string;
    category: string | null;
    referenceId: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): FinancialAccount {
    return new FinancialAccount({
      id: data.id,
      type: data.type as AccountType,
      description: data.description,
      amount: data.amount,
      dueDate: data.dueDate,
      paidDate: data.paidDate || undefined,
      status: data.status as AccountStatus,
      category: data.category as AccountCategory || undefined,
      referenceId: data.referenceId || undefined,
      notes: data.notes || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

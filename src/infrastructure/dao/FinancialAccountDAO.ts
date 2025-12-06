import { PrismaClient, FinancialAccount as PrismaFinancialAccount } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Conta Financeira
 * 
 * Responsabilidade: Acesso a dados de contas financeiras no banco
 * Gerencia contas a pagar, a receber, fluxo de caixa
 */

export type FinancialAccountCreateInput = {
  id?: string;
  description: string;
  type: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status?: string;
  category?: string | null;
  referenceId?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FinancialAccountUpdateInput = {
  description?: string;
  amount?: number;
  dueDate?: Date;
  paidDate?: Date | null;
  status?: string;
  category?: string | null;
  referenceId?: string | null;
  notes?: string | null;
  updatedAt?: Date;
};

export type FinancialAccountWhereInput = {
  id?: string;
  type?: string;
  status?: string;
};

export class FinancialAccountDAO implements IBaseDAO<PrismaFinancialAccount, FinancialAccountCreateInput, FinancialAccountUpdateInput, FinancialAccountWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: FinancialAccountCreateInput): Promise<PrismaFinancialAccount> {
    return this.prisma.financialAccount.create({
      data: {
        id: data.id,
        description: data.description,
        type: data.type,
        amount: data.amount,
        dueDate: data.dueDate,
        paidDate: data.paidDate,
        status: data.status ?? 'PENDING',
        category: data.category,
        referenceId: data.referenceId,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<PrismaFinancialAccount | null> {
    return this.prisma.financialAccount.findUnique({
      where: { id },
    });
  }

  async findOne(where: FinancialAccountWhereInput): Promise<PrismaFinancialAccount | null> {
    return this.prisma.financialAccount.findFirst({
      where,
    });
  }

  async findMany(where?: FinancialAccountWhereInput): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where,
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async update(id: string, data: FinancialAccountUpdateInput): Promise<PrismaFinancialAccount> {
    return this.prisma.financialAccount.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.financialAccount.delete({
      where: { id },
    });
  }

  async count(where?: FinancialAccountWhereInput): Promise<number> {
    return this.prisma.financialAccount.count({
      where,
    });
  }

  async exists(where: FinancialAccountWhereInput): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca contas a pagar
   */
  async findPayables(): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where: {
        type: 'PAYABLE',
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Busca contas a receber
   */
  async findReceivables(): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where: {
        type: 'RECEIVABLE',
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Busca contas pendentes
   */
  async findPending(): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Busca contas vencidas
   */
  async findOverdue(): Promise<PrismaFinancialAccount[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.financialAccount.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: today,
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Busca contas a vencer (próximos X dias)
   */
  async findDueSoon(days: number = 7): Promise<PrismaFinancialAccount[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.financialAccount.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          gte: today,
          lte: futureDate,
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Busca contas pagas
   */
  async findPaid(): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where: {
        status: 'PAID',
      },
      orderBy: {
        paidDate: 'desc',
      },
    });
  }

  /**
   * Marca conta como paga
   */
  async markAsPaid(id: string, paidDate?: Date): Promise<PrismaFinancialAccount> {
    return this.prisma.financialAccount.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: paidDate ?? new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Marca conta como cancelada
   */
  async markAsCancelled(id: string): Promise<PrismaFinancialAccount> {
    return this.prisma.financialAccount.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Soma contas a pagar pendentes
   */
  async sumPendingPayables(): Promise<number> {
    const result = await this.prisma.financialAccount.aggregate({
      where: {
        type: 'PAYABLE',
        status: 'PENDING',
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  /**
   * Soma contas a receber pendentes
   */
  async sumPendingReceivables(): Promise<number> {
    const result = await this.prisma.financialAccount.aggregate({
      where: {
        type: 'RECEIVABLE',
        status: 'PENDING',
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }

  /**
   * Resumo financeiro (a pagar vs a receber)
   */
  async getFinancialSummary(): Promise<{
    totalPayable: number;
    totalReceivable: number;
    balance: number;
  }> {
    const totalPayable = await this.sumPendingPayables();
    const totalReceivable = await this.sumPendingReceivables();
    
    return {
      totalPayable,
      totalReceivable,
      balance: totalReceivable - totalPayable,
    };
  }

  /**
   * Busca contas por período
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<PrismaFinancialAccount[]> {
    return this.prisma.financialAccount.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }
}

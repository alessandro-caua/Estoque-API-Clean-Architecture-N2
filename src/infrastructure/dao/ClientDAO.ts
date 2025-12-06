import { PrismaClient, Client as PrismaClient_Client } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Cliente
 * 
 * Responsabilidade: Acesso a dados de clientes no banco
 * Gerencia consultas relacionadas a crédito, débitos e vendas
 */

export type ClientCreateInput = {
  id?: string;
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  creditLimit?: number;
  currentDebt?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ClientUpdateInput = {
  name?: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  creditLimit?: number;
  currentDebt?: number;
  isActive?: boolean;
  updatedAt?: Date;
};

export type ClientWhereInput = {
  id?: string;
  name?: string;
  cpf?: string;
  isActive?: boolean;
};

export class ClientDAO implements IBaseDAO<PrismaClient_Client, ClientCreateInput, ClientUpdateInput, ClientWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: ClientCreateInput): Promise<PrismaClient_Client> {
    return this.prisma.client.create({
      data: {
        id: data.id,
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        address: data.address,
        creditLimit: data.creditLimit ?? 0,
        currentDebt: data.currentDebt ?? 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<PrismaClient_Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async findOne(where: ClientWhereInput): Promise<PrismaClient_Client | null> {
    return this.prisma.client.findFirst({
      where,
    });
  }

  async findMany(where?: ClientWhereInput): Promise<PrismaClient_Client[]> {
    return this.prisma.client.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: ClientUpdateInput): Promise<PrismaClient_Client> {
    return this.prisma.client.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async count(where?: ClientWhereInput): Promise<number> {
    return this.prisma.client.count({
      where,
    });
  }

  async exists(where: ClientWhereInput): Promise<boolean> {
    const count = await this.prisma.client.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca cliente por CPF
   */
  async findByCpf(cpf: string): Promise<PrismaClient_Client | null> {
    return this.prisma.client.findFirst({
      where: { cpf },
    });
  }

  /**
   * Busca clientes com débitos
   */
  async findClientsWithDebt(): Promise<PrismaClient_Client[]> {
    return this.prisma.client.findMany({
      where: {
        currentDebt: {
          gt: 0,
        },
      },
      orderBy: {
        currentDebt: 'desc',
      },
    });
  }

  /**
   * Busca clientes que excederam limite
   */
  async findClientsOverLimit(): Promise<PrismaClient_Client[]> {
    return this.prisma.client.findMany({
      where: {
        currentDebt: {
          gt: this.prisma.client.fields.creditLimit,
        },
      },
    });
  }

  /**
   * Atualiza débito do cliente
   */
  async updateDebt(clientId: string, newDebt: number): Promise<PrismaClient_Client> {
    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        currentDebt: newDebt,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Incrementa débito do cliente
   */
  async incrementDebt(clientId: string, amount: number): Promise<PrismaClient_Client> {
    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        currentDebt: {
          increment: amount,
        },
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Decrementa débito do cliente (pagamento)
   */
  async decrementDebt(clientId: string, amount: number): Promise<PrismaClient_Client> {
    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        currentDebt: {
          decrement: amount,
        },
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Busca clientes com suas vendas
   */
  async findClientsWithSales(): Promise<any[]> {
    return this.prisma.client.findMany({
      include: {
        sales: {
          select: {
            id: true,
            total: true,
            paymentStatus: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }
}

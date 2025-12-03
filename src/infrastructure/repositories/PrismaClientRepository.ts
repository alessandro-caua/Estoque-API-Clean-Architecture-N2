// ============================================================================
// REPOSITÓRIO PRISMA: CLIENT (CLIENTE)
// ============================================================================
// Implementação do repositório de clientes usando Prisma ORM.
// Camada de Infraestrutura - Implementa a interface definida no domínio.
// ============================================================================

import { PrismaClient } from '@prisma/client';
import { Client } from '../../domain/entities/Client';
import { IClientRepository, ClientFilters } from '../../domain/repositories/IClientRepository';

/**
 * Repositório Prisma para a entidade Client
 * @implements {IClientRepository}
 */
export class PrismaClientRepository implements IClientRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo cliente no banco de dados
   */
  async create(client: Client): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        name: client.name,
        cpf: client.cpf,
        email: client.email,
        phone: client.phone,
        address: client.address,
        creditLimit: client.creditLimit,
        currentDebt: client.currentDebt,
        isActive: client.isActive,
      },
    });

    return this.mapToEntity(created);
  }

  /**
   * Busca um cliente pelo ID
   */
  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    return client ? this.mapToEntity(client) : null;
  }

  /**
   * Busca um cliente pelo CPF
   */
  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
    });

    return client ? this.mapToEntity(client) : null;
  }

  /**
   * Busca um cliente pelo email
   */
  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });

    return client ? this.mapToEntity(client) : null;
  }

  /**
   * Lista todos os clientes com filtros opcionais
   */
  async findAll(filters?: ClientFilters): Promise<Client[]> {
    const where: Record<string, unknown> = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.hasDebt) {
      where.currentDebt = { gt: 0 };
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { cpf: { contains: filters.search } },
        { email: { contains: filters.search } },
        { phone: { contains: filters.search } },
      ];
    }

    const clients = await this.prisma.client.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return clients.map(this.mapToEntity);
  }

  /**
   * Busca clientes com débito
   */
  async findWithDebts(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        currentDebt: { gt: 0 },
        isActive: true,
      },
      orderBy: { currentDebt: 'desc' },
    });

    return clients.map(this.mapToEntity);
  }

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, data: Partial<Client>): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        address: data.address,
        creditLimit: data.creditLimit,
        currentDebt: data.currentDebt,
        isActive: data.isActive,
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Atualiza o débito do cliente
   */
  async updateDebt(id: string, amount: number): Promise<void> {
    await this.prisma.client.update({
      where: { id },
      data: { currentDebt: amount },
    });
  }

  /**
   * Remove um cliente (soft delete - apenas desativa)
   */
  async delete(id: string): Promise<void> {
    await this.prisma.client.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Conta o número de clientes
   */
  async count(filters?: ClientFilters): Promise<number> {
    const where: Record<string, unknown> = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.hasDebt) {
      where.currentDebt = { gt: 0 };
    }

    return this.prisma.client.count({ where });
  }

  /**
   * Retorna o total de débitos de todos os clientes
   */
  async getTotalDebts(): Promise<number> {
    const result = await this.prisma.client.aggregate({
      _sum: {
        currentDebt: true,
      },
      where: {
        isActive: true,
      },
    });

    return result._sum.currentDebt || 0;
  }

  /**
   * Verifica se CPF já existe
   */
  async cpfExists(cpf: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, unknown> = { cpf };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await this.prisma.client.count({ where });
    return count > 0;
  }

  /**
   * Mapeia o registro do Prisma para a entidade de domínio
   */
  private mapToEntity(data: {
    id: string;
    name: string;
    cpf: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    creditLimit: number;
    currentDebt: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Client {
    return new Client({
      id: data.id,
      name: data.name,
      cpf: data.cpf || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      creditLimit: data.creditLimit,
      currentDebt: data.currentDebt,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

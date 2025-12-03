// ============================================================================
// REPOSITÓRIO PRISMA: USER (USUÁRIO)
// ============================================================================
// Implementação do repositório de usuários usando Prisma ORM.
// Camada de Infraestrutura - Implementa a interface definida no domínio.
// ============================================================================

import { PrismaClient } from '@prisma/client';
import { User, UserRole } from '../../domain/entities/User';
import { IUserRepository, UserFilters } from '../../domain/repositories/IUserRepository';

/**
 * Repositório Prisma para a entidade User
 * @implements {IUserRepository}
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo usuário no banco de dados
   */
  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
      },
    });

    return this.mapToEntity(created);
  }

  /**
   * Busca um usuário pelo ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToEntity(user) : null;
  }

  /**
   * Busca um usuário pelo email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToEntity(user) : null;
  }

  /**
   * Lista todos os usuários com filtros opcionais
   */
  async findAll(filters?: UserFilters): Promise<User[]> {
    const where: Record<string, unknown> = {};

    if (filters?.role) {
      where.role = filters.role;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return users.map(this.mapToEntity);
  }

  /**
   * Atualiza um usuário existente
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
      },
    });

    return this.mapToEntity(updated);
  }

  /**
   * Remove um usuário (soft delete - apenas desativa)
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Conta o número de usuários
   */
  async count(filters?: UserFilters): Promise<number> {
    const where: Record<string, unknown> = {};

    if (filters?.role) {
      where.role = filters.role;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.user.count({ where });
  }

  /**
   * Verifica se um email já está em uso
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, unknown> = { email };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await this.prisma.user.count({ where });
    return count > 0;
  }

  /**
   * Mapeia o registro do Prisma para a entidade de domínio
   */
  private mapToEntity(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as UserRole,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

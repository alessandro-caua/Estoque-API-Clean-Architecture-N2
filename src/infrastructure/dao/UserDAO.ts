import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Usuário
 * 
 * Responsabilidade: Acesso a dados de usuários no banco
 * Gerencia autenticação, permissões e operações de usuários
 */

export type UserCreateInput = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserUpdateInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
  updatedAt?: Date;
};

export type UserWhereInput = {
  id?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

export class UserDAO implements IBaseDAO<PrismaUser, UserCreateInput, UserUpdateInput, UserWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: UserCreateInput): Promise<PrismaUser> {
    return this.prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? 'CAIXA',
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOne(where: UserWhereInput): Promise<PrismaUser | null> {
    return this.prisma.user.findFirst({
      where,
    });
  }

  async findMany(where?: UserWhereInput): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: UserUpdateInput): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async count(where?: UserWhereInput): Promise<number> {
    return this.prisma.user.count({
      where,
    });
  }

  async exists(where: UserWhereInput): Promise<boolean> {
    const count = await this.prisma.user.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca usuário por email (autenticação)
   */
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Busca usuários por role (cargo)
   */
  async findByRole(role: string): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({
      where: { role },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca apenas usuários ativos
   */
  async findActiveUsers(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(userId: string, newPassword: string): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Ativa/Desativa usuário
   */
  async setActiveStatus(userId: string, isActive: boolean): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Busca usuários administradores
   */
  async findAdmins(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
        isActive: true,
      },
    });
  }
}

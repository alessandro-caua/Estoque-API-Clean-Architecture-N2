import { PrismaClient, Category as PrismaCategory } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Categoria
 * 
 * Responsabilidade: Acesso a dados de categorias no banco
 * Implementa operações CRUD básicas + queries específicas
 */

// Types para operações de Category
export type CategoryCreateInput = {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CategoryUpdateInput = {
  name?: string;
  description?: string | null;
  updatedAt?: Date;
};

export type CategoryWhereInput = {
  id?: string;
  name?: string;
};

export class CategoryDAO implements IBaseDAO<PrismaCategory, CategoryCreateInput, CategoryUpdateInput, CategoryWhereInput> {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova categoria
   */
  async create(data: CategoryCreateInput): Promise<PrismaCategory> {
    return this.prisma.category.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  /**
   * Busca categoria por ID
   */
  async findById(id: string): Promise<PrismaCategory | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Busca uma categoria com condições
   */
  async findOne(where: CategoryWhereInput): Promise<PrismaCategory | null> {
    return this.prisma.category.findFirst({
      where,
    });
  }

  /**
   * Busca múltiplas categorias
   */
  async findMany(where?: CategoryWhereInput): Promise<PrismaCategory[]> {
    return this.prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Atualiza uma categoria
   */
  async update(id: string, data: CategoryUpdateInput): Promise<PrismaCategory> {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Deleta uma categoria
   */
  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Conta categorias com filtros
   */
  async count(where?: CategoryWhereInput): Promise<number> {
    return this.prisma.category.count({
      where,
    });
  }

  /**
   * Verifica se categoria existe
   */
  async exists(where: CategoryWhereInput): Promise<boolean> {
    const count = await this.prisma.category.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca categoria por nome (exato)
   */
  async findByName(name: string): Promise<PrismaCategory | null> {
    return this.prisma.category.findFirst({
      where: { name },
    });
  }

  /**
   * Busca categorias com produtos
   */
  async findCategoriesWithProducts(): Promise<any[]> {
    return this.prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            salePrice: true,
            quantity: true,
          },
        },
      },
    });
  }

  /**
   * Conta produtos por categoria
   */
  async countProductsByCategory(categoryId: string): Promise<number> {
    return this.prisma.product.count({
      where: { categoryId },
    });
  }
}

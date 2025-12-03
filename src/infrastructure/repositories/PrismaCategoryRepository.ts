// Repositório de Category com Prisma - Camada de Infraestrutura
import { PrismaClient } from '@prisma/client';
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });

    return new Category({
      id: created.id,
      name: created.name,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return new Category({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { name },
    });

    if (!category) return null;

    return new Category({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map(
      (category) =>
        new Category({
          id: category.id,
          name: category.name,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        })
    );
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return new Category({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}

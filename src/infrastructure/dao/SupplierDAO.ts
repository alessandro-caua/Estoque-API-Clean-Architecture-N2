import { PrismaClient, Supplier as PrismaSupplier } from '@prisma/client';
import { IBaseDAO } from './IBaseDAO';

/**
 * DAO de Fornecedor
 * 
 * Responsabilidade: Acesso a dados de fornecedores no banco
 */

export type SupplierCreateInput = {
  id?: string;
  name: string;
  cnpj?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SupplierUpdateInput = {
  name?: string;
  cnpj?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  updatedAt?: Date;
};

export type SupplierWhereInput = {
  id?: string;
  name?: string;
  cnpj?: string;
};

export class SupplierDAO implements IBaseDAO<PrismaSupplier, SupplierCreateInput, SupplierUpdateInput, SupplierWhereInput> {
  constructor(private prisma: PrismaClient) {}

  async create(data: SupplierCreateInput): Promise<PrismaSupplier> {
    return this.prisma.supplier.create({
      data: {
        id: data.id,
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
        address: data.address,

        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<PrismaSupplier | null> {
    return this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  async findOne(where: SupplierWhereInput): Promise<PrismaSupplier | null> {
    return this.prisma.supplier.findFirst({
      where,
    });
  }

  async findMany(where?: SupplierWhereInput): Promise<PrismaSupplier[]> {
    return this.prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: SupplierUpdateInput): Promise<PrismaSupplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.delete({
      where: { id },
    });
  }

  async count(where?: SupplierWhereInput): Promise<number> {
    return this.prisma.supplier.count({
      where,
    });
  }

  async exists(where: SupplierWhereInput): Promise<boolean> {
    const count = await this.prisma.supplier.count({
      where,
    });
    return count > 0;
  }

  /**
   * Busca fornecedor por CNPJ
   */
  async findByCnpj(cnpj: string): Promise<PrismaSupplier | null> {
    return this.prisma.supplier.findFirst({
      where: { cnpj },
    });
  }

  /**
   * Busca fornecedores com produtos
   */
  async findSuppliersWithProducts(): Promise<any[]> {
    return this.prisma.supplier.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            salePrice: true,
          },
        },
      },
    });
  }
}

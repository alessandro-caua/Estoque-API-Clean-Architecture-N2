// Repositório de Supplier com Prisma - Camada de Infraestrutura
import { PrismaClient } from '@prisma/client';
import { Supplier } from '../../domain/entities/Supplier';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';

export class PrismaSupplierRepository implements ISupplierRepository {
  constructor(private prisma: PrismaClient) {}

  async create(supplier: Supplier): Promise<Supplier> {
    const created = await this.prisma.supplier.create({
      data: {
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        cnpj: supplier.cnpj,
      },
    });

    return new Supplier({
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      address: created.address,
      cnpj: created.cnpj,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findById(id: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) return null;

    return new Supplier({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      cnpj: supplier.cnpj,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { email },
    });

    if (!supplier) return null;

    return new Supplier({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      cnpj: supplier.cnpj,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    });
  }

  async findByCnpj(cnpj: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { cnpj },
    });

    if (!supplier) return null;

    return new Supplier({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      cnpj: supplier.cnpj,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    });
  }

  async findAll(): Promise<Supplier[]> {
    const suppliers = await this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });

    return suppliers.map(
      (supplier) =>
        new Supplier({
          id: supplier.id,
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          cnpj: supplier.cnpj,
          createdAt: supplier.createdAt,
          updatedAt: supplier.updatedAt,
        })
    );
  }

  async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const updated = await this.prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        cnpj: data.cnpj,
      },
    });

    return new Supplier({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      cnpj: updated.cnpj,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supplier.delete({
      where: { id },
    });
  }
}

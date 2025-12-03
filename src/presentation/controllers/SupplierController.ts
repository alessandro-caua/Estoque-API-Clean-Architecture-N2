// Controller de Supplier - Camada de Apresentação
import { Request, Response } from 'express';
import {
  CreateSupplierUseCase,
  GetSupplierByIdUseCase,
  GetAllSuppliersUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase,
} from '../../application/use-cases/SupplierUseCases';

export class SupplierController {
  constructor(
    private createSupplierUseCase: CreateSupplierUseCase,
    private getSupplierByIdUseCase: GetSupplierByIdUseCase,
    private getAllSuppliersUseCase: GetAllSuppliersUseCase,
    private updateSupplierUseCase: UpdateSupplierUseCase,
    private deleteSupplierUseCase: DeleteSupplierUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, phone, address, cnpj } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const supplier = await this.createSupplierUseCase.execute({
        name,
        email,
        phone,
        address,
        cnpj,
      });

      return res.status(201).json(supplier.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const supplier = await this.getSupplierByIdUseCase.execute(id);

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      return res.json(supplier.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const suppliers = await this.getAllSuppliersUseCase.execute();

      return res.json(suppliers.map((s) => s.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, phone, address, cnpj } = req.body;

      const supplier = await this.updateSupplierUseCase.execute(id, {
        name,
        email,
        phone,
        address,
        cnpj,
      });

      return res.json(supplier.toJSON());
    } catch (error: any) {
      if (error.message === 'Fornecedor não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.deleteSupplierUseCase.execute(id);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Fornecedor não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

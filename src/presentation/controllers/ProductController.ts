// Controller de Product - Camada de Apresentação
import { Request, Response } from 'express';
import {
  CreateProductUseCase,
  GetProductByIdUseCase,
  GetProductByBarcodeUseCase,
  GetAllProductsUseCase,
  GetLowStockProductsUseCase,
  GetExpiredProductsUseCase,
  GetProductsByCategoryUseCase,
  GetProductsBySupplierUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from '../../application/use-cases/ProductUseCases';

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
    private getAllProductsUseCase: GetAllProductsUseCase,
    private getLowStockProductsUseCase: GetLowStockProductsUseCase,
    private getExpiredProductsUseCase: GetExpiredProductsUseCase,
    private getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private getProductsBySupplierUseCase: GetProductsBySupplierUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        name,
        description,
        barcode,
        salePrice,
        costPrice,
        quantity,
        minQuantity,
        unit,
        categoryId,
        supplierId,
        isActive,
        expirationDate,
      } = req.body;

      if (!name || !categoryId || salePrice === undefined || costPrice === undefined) {
        return res.status(400).json({
          error: 'Nome, categoria, preço de venda e preço de custo são obrigatórios',
        });
      }

      const product = await this.createProductUseCase.execute({
        name,
        description,
        barcode,
        salePrice,
        costPrice,
        quantity,
        minQuantity,
        unit,
        categoryId,
        supplierId,
        isActive,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      });

      return res.status(201).json(product.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const product = await this.getProductByIdUseCase.execute(id);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByBarcode(req: Request, res: Response): Promise<Response> {
    try {
      const { barcode } = req.params;

      const product = await this.getProductByBarcodeUseCase.execute(barcode);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, supplierId, isActive, search } = req.query;

      const products = await this.getAllProductsUseCase.execute({
        categoryId: categoryId as string,
        supplierId: supplierId as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        search: search as string,
      });

      return res.json(products.map((p) => p.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findLowStock(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.getLowStockProductsUseCase.execute();

      return res.json(products.map((p) => p.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findExpired(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.getExpiredProductsUseCase.execute();

      return res.json(products.map((p) => p.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;

      const products = await this.getProductsByCategoryUseCase.execute(categoryId);

      return res.json(products.map((p) => p.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findBySupplier(req: Request, res: Response): Promise<Response> {
    try {
      const { supplierId } = req.params;

      const products = await this.getProductsBySupplierUseCase.execute(supplierId);

      return res.json(products.map((p) => p.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        barcode,
        salePrice,
        costPrice,
        quantity,
        minQuantity,
        unit,
        categoryId,
        supplierId,
        isActive,
        expirationDate,
      } = req.body;

      const product = await this.updateProductUseCase.execute(id, {
        name,
        description,
        barcode,
        salePrice,
        costPrice,
        quantity,
        minQuantity,
        unit,
        categoryId,
        supplierId,
        isActive,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      });

      return res.json(product.toJSON());
    } catch (error: any) {
      if (error.message === 'Produto não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.deleteProductUseCase.execute(id);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Produto não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

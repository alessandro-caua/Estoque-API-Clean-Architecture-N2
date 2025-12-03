// Configuração da Aplicação Express
import express, { Application, Request, Response, NextFunction } from 'express';

// Importar Prisma Client
import { prisma } from './infrastructure/database/prisma-client';

// Importar Repositórios
import {
  PrismaCategoryRepository,
  PrismaSupplierRepository,
  PrismaProductRepository,
  PrismaStockMovementRepository,
} from './infrastructure/repositories';

// Importar Use Cases de Category
import {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from './application/use-cases/CategoryUseCases';

// Importar Use Cases de Supplier
import {
  CreateSupplierUseCase,
  GetSupplierByIdUseCase,
  GetAllSuppliersUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase,
} from './application/use-cases/SupplierUseCases';

// Importar Use Cases de Product
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
} from './application/use-cases/ProductUseCases';

// Importar Use Cases de StockMovement
import {
  CreateStockEntryUseCase,
  GetStockMovementByIdUseCase,
  GetAllStockMovementsUseCase,
  GetStockMovementsByProductUseCase,
  GetStockMovementsByTypeUseCase,
  GetStockMovementsByDateRangeUseCase,
  GetStockReportUseCase,
} from './application/use-cases/StockMovementUseCases';

// Importar Controllers
import {
  CategoryController,
  SupplierController,
  ProductController,
  StockMovementController,
} from './presentation/controllers';

// Importar Routes
import {
  createCategoryRoutes,
  createSupplierRoutes,
  createProductRoutes,
  createStockMovementRoutes,
} from './presentation/routes';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============ INJEÇÃO DE DEPENDÊNCIAS ============

  // Repositórios
  const categoryRepository = new PrismaCategoryRepository(prisma);
  const supplierRepository = new PrismaSupplierRepository(prisma);
  const productRepository = new PrismaProductRepository(prisma);
  const stockMovementRepository = new PrismaStockMovementRepository(prisma);

  // Use Cases de Category
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

  // Use Cases de Supplier
  const createSupplierUseCase = new CreateSupplierUseCase(supplierRepository);
  const getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepository);
  const getAllSuppliersUseCase = new GetAllSuppliersUseCase(supplierRepository);
  const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
  const deleteSupplierUseCase = new DeleteSupplierUseCase(supplierRepository);

  // Use Cases de Product
  const createProductUseCase = new CreateProductUseCase(
    productRepository,
    categoryRepository,
    supplierRepository
  );
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const getProductByBarcodeUseCase = new GetProductByBarcodeUseCase(productRepository);
  const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
  const getLowStockProductsUseCase = new GetLowStockProductsUseCase(productRepository);
  const getExpiredProductsUseCase = new GetExpiredProductsUseCase(productRepository);
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
  const getProductsBySupplierUseCase = new GetProductsBySupplierUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(
    productRepository,
    categoryRepository,
    supplierRepository
  );
  const deleteProductUseCase = new DeleteProductUseCase(productRepository);

  // Use Cases de StockMovement
  const createStockEntryUseCase = new CreateStockEntryUseCase(
    stockMovementRepository,
    productRepository
  );
  const getStockMovementByIdUseCase = new GetStockMovementByIdUseCase(stockMovementRepository);
  const getAllStockMovementsUseCase = new GetAllStockMovementsUseCase(stockMovementRepository);
  const getStockMovementsByProductUseCase = new GetStockMovementsByProductUseCase(
    stockMovementRepository
  );
  const getStockMovementsByTypeUseCase = new GetStockMovementsByTypeUseCase(
    stockMovementRepository
  );
  const getStockMovementsByDateRangeUseCase = new GetStockMovementsByDateRangeUseCase(
    stockMovementRepository
  );
  const getStockReportUseCase = new GetStockReportUseCase(
    stockMovementRepository,
    productRepository
  );

  // Controllers
  const categoryController = new CategoryController(
    createCategoryUseCase,
    getCategoryByIdUseCase,
    getAllCategoriesUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase
  );

  const supplierController = new SupplierController(
    createSupplierUseCase,
    getSupplierByIdUseCase,
    getAllSuppliersUseCase,
    updateSupplierUseCase,
    deleteSupplierUseCase
  );

  const productController = new ProductController(
    createProductUseCase,
    getProductByIdUseCase,
    getProductByBarcodeUseCase,
    getAllProductsUseCase,
    getLowStockProductsUseCase,
    getExpiredProductsUseCase,
    getProductsByCategoryUseCase,
    getProductsBySupplierUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );

  const stockMovementController = new StockMovementController(
    createStockEntryUseCase,
    getStockMovementByIdUseCase,
    getAllStockMovementsUseCase,
    getStockMovementsByProductUseCase,
    getStockMovementsByTypeUseCase,
    getStockMovementsByDateRangeUseCase,
    getStockReportUseCase
  );

  // ============ ROTAS ============

  // Rota de status/health check
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'API de Estoque - Supermercado',
      version: '1.0.0',
      endpoints: {
        categories: '/api/categories',
        suppliers: '/api/suppliers',
        products: '/api/products',
        stockMovements: '/api/stock-movements',
      },
    });
  });

  // Registrar rotas
  app.use('/api/categories', createCategoryRoutes(categoryController));
  app.use('/api/suppliers', createSupplierRoutes(supplierController));
  app.use('/api/products', createProductRoutes(productController));
  app.use('/api/stock-movements', createStockMovementRoutes(stockMovementController));

  // Middleware de erro global
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  // Rota 404
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  return app;
}

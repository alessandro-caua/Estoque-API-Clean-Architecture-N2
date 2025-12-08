/**
 * Aplicação Express - API de Estoque
 * Clean Architecture simplificada
 */

import express, { Application, Request, Response } from 'express';
import { prisma } from './infrastructure/database/prisma-client';

// Repositories
import { PrismaProductRepository } from './infrastructure/repositories/PrismaProductRepository';
import { PrismaCategoryRepository } from './infrastructure/repositories/PrismaCategoryRepository';
import { PrismaSupplierRepository } from './infrastructure/repositories/PrismaSupplierRepository';
import { PrismaClientRepository } from './infrastructure/repositories/PrismaClientRepository';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaStockMovementRepository } from './infrastructure/repositories/PrismaStockMovementRepository';
import { PrismaSaleRepository } from './infrastructure/repositories/PrismaSaleRepository';
import { PrismaFinancialAccountRepository } from './infrastructure/repositories/PrismaFinancialAccountRepository';

// Use Cases - Products
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

// Use Cases - Categories
import {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from './application/use-cases/CategoryUseCases';

// Use Cases - Suppliers
import {
  CreateSupplierUseCase,
  GetSupplierByIdUseCase,
  GetAllSuppliersUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase,
} from './application/use-cases/SupplierUseCases';

// Use Cases - Clients
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  GetPaginatedClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  GetClientsWithDebtsUseCase,
  GetTotalDebtsUseCase,
} from './application/use-cases/ClientUseCases';

// Use Cases - Users
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
  GetUserByIdUseCase,
  GetPaginatedUsersUseCase,
  UpdateUserUseCase,
  DeactivateUserUseCase,
  ChangePasswordUseCase,
} from './application/use-cases/UserUseCases';

// Use Cases - Stock Movements
import {
  CreateStockEntryUseCase,
  GetStockMovementByIdUseCase,
  GetAllStockMovementsUseCase,
  GetStockMovementsByProductUseCase,
  GetStockMovementsByTypeUseCase,
  GetStockMovementsByDateRangeUseCase,
  GetStockReportUseCase,
} from './application/use-cases/StockMovementUseCases';

// Use Cases - Sales
import {
  CreateSaleUseCase,
  GetSaleByIdUseCase,
  GetPaginatedSalesUseCase,
  CancelSaleUseCase,
  GetTodaySalesUseCase,
  GetSalesSummaryUseCase,
  GetSalesByDateRangeUseCase,
} from './application/use-cases/SaleUseCases';

// Use Cases - Financial
import {
  CreatePayableAccountUseCase,
  CreateReceivableAccountUseCase,
  GetAccountByIdUseCase,
  GetPaginatedAccountsUseCase,
  RegisterAccountPaymentUseCase,
  CancelAccountUseCase,
  GetOverdueAccountsUseCase,
  GetFinancialSummaryUseCase,
} from './application/use-cases/FinancialUseCases';

// Controllers
import { ProductController } from './presentation/controllers/ProductController';
import { CategoryController } from './presentation/controllers/CategoryController';
import { SupplierController } from './presentation/controllers/SupplierController';
import { ClientController } from './presentation/controllers/ClientController';
import { UserController } from './presentation/controllers/UserController';
import { StockMovementController } from './presentation/controllers/StockMovementController';
import { SaleController } from './presentation/controllers/SaleController';
import { FinancialController } from './presentation/controllers/FinancialController';

// Routes
import { createProductRoutes } from './presentation/routes/productRoutes';
import { createCategoryRoutes } from './presentation/routes/categoryRoutes';
import { createSupplierRoutes } from './presentation/routes/supplierRoutes';
import { createClientRoutes } from './presentation/routes/clientRoutes';
import { createUserRoutes } from './presentation/routes/userRoutes';
import { createStockMovementRoutes } from './presentation/routes/stockMovementRoutes';
import { createSaleRoutes } from './presentation/routes/saleRoutes';
import { createFinancialRoutes } from './presentation/routes/financialRoutes';

// Error Handler
import { errorHandler } from './presentation/middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple request logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Initialize repositories
  const productRepository = new PrismaProductRepository(prisma);
  const categoryRepository = new PrismaCategoryRepository(prisma);
  const supplierRepository = new PrismaSupplierRepository(prisma);
  const clientRepository = new PrismaClientRepository(prisma);
  const userRepository = new PrismaUserRepository(prisma);
  const stockMovementRepository = new PrismaStockMovementRepository(prisma);
  const saleRepository = new PrismaSaleRepository(prisma);
  const financialRepository = new PrismaFinancialAccountRepository(prisma);

  // Initialize Product Use Cases
  const createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository, supplierRepository);
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const getProductByBarcodeUseCase = new GetProductByBarcodeUseCase(productRepository);
  const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
  const getLowStockProductsUseCase = new GetLowStockProductsUseCase(productRepository);
  const getExpiredProductsUseCase = new GetExpiredProductsUseCase(productRepository);
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
  const getProductsBySupplierUseCase = new GetProductsBySupplierUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(productRepository, categoryRepository, supplierRepository);
  const deleteProductUseCase = new DeleteProductUseCase(productRepository);

  // Initialize Category Use Cases
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

  // Initialize Supplier Use Cases
  const createSupplierUseCase = new CreateSupplierUseCase(supplierRepository);
  const getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepository);
  const getAllSuppliersUseCase = new GetAllSuppliersUseCase(supplierRepository);
  const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
  const deleteSupplierUseCase = new DeleteSupplierUseCase(supplierRepository);

  // Initialize Client Use Cases
  const createClientUseCase = new CreateClientUseCase(clientRepository);
  const getClientByIdUseCase = new GetClientByIdUseCase(clientRepository);
  const getPaginatedClientsUseCase = new GetPaginatedClientsUseCase(clientRepository);
  const updateClientUseCase = new UpdateClientUseCase(clientRepository);
  const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
  const getClientsWithDebtsUseCase = new GetClientsWithDebtsUseCase(clientRepository);
  const getTotalDebtsUseCase = new GetTotalDebtsUseCase(clientRepository);

  // Initialize User Use Cases
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getPaginatedUsersUseCase = new GetPaginatedUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository);

  // Initialize Stock Movement Use Cases
  const createStockEntryUseCase = new CreateStockEntryUseCase(stockMovementRepository, productRepository);
  const getStockMovementByIdUseCase = new GetStockMovementByIdUseCase(stockMovementRepository);
  const getAllStockMovementsUseCase = new GetAllStockMovementsUseCase(stockMovementRepository);
  const getStockMovementsByProductUseCase = new GetStockMovementsByProductUseCase(stockMovementRepository);
  const getStockMovementsByTypeUseCase = new GetStockMovementsByTypeUseCase(stockMovementRepository);
  const getStockMovementsByDateRangeUseCase = new GetStockMovementsByDateRangeUseCase(stockMovementRepository);
  const getStockReportUseCase = new GetStockReportUseCase(stockMovementRepository, productRepository);

  // Initialize Sale Use Cases
  const createSaleUseCase = new CreateSaleUseCase(saleRepository, productRepository, clientRepository, stockMovementRepository);
  const getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository);
  const getPaginatedSalesUseCase = new GetPaginatedSalesUseCase(saleRepository);
  const cancelSaleUseCase = new CancelSaleUseCase(saleRepository, productRepository, stockMovementRepository, clientRepository);
  const getTodaySalesUseCase = new GetTodaySalesUseCase(saleRepository);
  const getSalesSummaryUseCase = new GetSalesSummaryUseCase(saleRepository);
  const getSalesByDateRangeUseCase = new GetSalesByDateRangeUseCase(saleRepository);

  // Initialize Financial Use Cases
  const createPayableUseCase = new CreatePayableAccountUseCase(financialRepository);
  const createReceivableUseCase = new CreateReceivableAccountUseCase(financialRepository);
  const getAccountByIdUseCase = new GetAccountByIdUseCase(financialRepository);
  const getPaginatedAccountsUseCase = new GetPaginatedAccountsUseCase(financialRepository);
  const registerPaymentUseCase = new RegisterAccountPaymentUseCase(financialRepository);
  const cancelAccountUseCase = new CancelAccountUseCase(financialRepository);
  const getOverdueAccountsUseCase = new GetOverdueAccountsUseCase(financialRepository);
  const getFinancialSummaryUseCase = new GetFinancialSummaryUseCase(financialRepository);

  // Initialize Controllers
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

  const clientController = new ClientController(
    createClientUseCase,
    getClientByIdUseCase,
    getPaginatedClientsUseCase,
    updateClientUseCase,
    deleteClientUseCase,
    getClientsWithDebtsUseCase,
    getTotalDebtsUseCase
  );

  const userController = new UserController(
    createUserUseCase,
    authenticateUserUseCase,
    getUserByIdUseCase,
    getPaginatedUsersUseCase,
    updateUserUseCase,
    deactivateUserUseCase,
    changePasswordUseCase
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

  const saleController = new SaleController(
    createSaleUseCase,
    getSaleByIdUseCase,
    getPaginatedSalesUseCase,
    cancelSaleUseCase,
    getTodaySalesUseCase,
    getSalesSummaryUseCase,
    getSalesByDateRangeUseCase
  );

  const financialController = new FinancialController(
    createPayableUseCase,
    createReceivableUseCase,
    getAccountByIdUseCase,
    getPaginatedAccountsUseCase,
    registerPaymentUseCase,
    cancelAccountUseCase,
    getOverdueAccountsUseCase,
    getFinancialSummaryUseCase
  );

  // Register routes
  const apiPrefix = '/api/v1';
  
  app.use(`${apiPrefix}/products`, createProductRoutes(productController));
  app.use(`${apiPrefix}/categories`, createCategoryRoutes(categoryController));
  app.use(`${apiPrefix}/suppliers`, createSupplierRoutes(supplierController));
  app.use(`${apiPrefix}/clients`, createClientRoutes(clientController));
  app.use(`${apiPrefix}/users`, createUserRoutes(userController));
  app.use(`${apiPrefix}/stock-movements`, createStockMovementRoutes(stockMovementController));
  app.use(`${apiPrefix}/sales`, createSaleRoutes(saleController));
  app.use(`${apiPrefix}/financial`, createFinancialRoutes(financialController));

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.path} not found` });
  });

  // Error handler
  app.use(errorHandler);

  console.log('✅ Application configured successfully');
  return app;
}

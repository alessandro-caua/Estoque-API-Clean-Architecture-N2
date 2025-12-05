// ============================================================================
// CONFIGURAÇÃO DA APLICAÇÃO EXPRESS
// ============================================================================
// Arquivo principal de configuração da API de Estoque para Supermercado.
// Implementa injeção de dependências seguindo Clean Architecture.
// ============================================================================

import express, { Application, Request, Response, NextFunction } from 'express';

// Importar Prisma Client
import { prisma } from './infrastructure/database/prisma-client';

// ============================================================================
// IMPORTAR REPOSITÓRIOS
// ============================================================================
import {
  PrismaCategoryRepository,
  PrismaSupplierRepository,
  PrismaProductRepository,
  PrismaStockMovementRepository,
  PrismaUserRepository,
  PrismaClientRepository,
  PrismaSaleRepository,
  PrismaFinancialAccountRepository,
} from './infrastructure/repositories';

// ============================================================================
// IMPORTAR USE CASES - CATEGORY
// ============================================================================
import {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from './application/use-cases/CategoryUseCases';

// ============================================================================
// IMPORTAR USE CASES - SUPPLIER
// ============================================================================
import {
  CreateSupplierUseCase,
  GetSupplierByIdUseCase,
  GetAllSuppliersUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase,
} from './application/use-cases/SupplierUseCases';

// ============================================================================
// IMPORTAR USE CASES - PRODUCT
// ============================================================================
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

// ============================================================================
// IMPORTAR USE CASES - STOCK MOVEMENT
// ============================================================================
import {
  CreateStockEntryUseCase,
  GetStockMovementByIdUseCase,
  GetAllStockMovementsUseCase,
  GetStockMovementsByProductUseCase,
  GetStockMovementsByTypeUseCase,
  GetStockMovementsByDateRangeUseCase,
  GetStockReportUseCase,
} from './application/use-cases/StockMovementUseCases';

// ============================================================================
// IMPORTAR USE CASES - USER
// ============================================================================
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
  GetUserByIdUseCase,
  GetPaginatedUsersUseCase,
  UpdateUserUseCase,
  DeactivateUserUseCase,
  ChangePasswordUseCase,
} from './application/use-cases/UserUseCases';

// ============================================================================
// IMPORTAR USE CASES - CLIENT
// ============================================================================
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  GetPaginatedClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  GetClientsWithDebtsUseCase,
  GetTotalDebtsUseCase,
} from './application/use-cases/ClientUseCases';

// ============================================================================
// IMPORTAR USE CASES - SALE
// ============================================================================
import {
  CreateSaleUseCase,
  GetSaleByIdUseCase,
  GetPaginatedSalesUseCase,
  CancelSaleUseCase,
  GetTodaySalesUseCase,
  GetSalesSummaryUseCase,
  GetSalesByDateRangeUseCase,
} from './application/use-cases/SaleUseCases';

// ============================================================================
// IMPORTAR USE CASES - FINANCIAL
// ============================================================================
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

// ============================================================================
// IMPORTAR CONTROLLERS
// ============================================================================
import {
  CategoryController,
  SupplierController,
  ProductController,
  StockMovementController,
  UserController,
  ClientController,
  SaleController,
  FinancialController,
} from './presentation/controllers';

// ============================================================================
// IMPORTAR ROUTES
// ============================================================================
import {
  createCategoryRoutes,
  createSupplierRoutes,
  createProductRoutes,
  createStockMovementRoutes,
  createUserRoutes,
  createClientRoutes,
  createSaleRoutes,
  createFinancialRoutes,
} from './presentation/routes';

/**
 * Cria e configura a aplicação Express.
 * 
 * @description Esta função implementa a injeção de dependências de todos os
 * módulos da aplicação seguindo Clean Architecture:
 * - Repositórios (Infrastructure Layer)
 * - Use Cases (Application Layer)  
 * - Controllers (Presentation Layer)
 * - Routes (Presentation Layer)
 * 
 * @returns {Application} Instância configurada do Express
 */
export function createApp(): Application {
  const app = express();

  // ============================================================================
  // MIDDLEWARES GLOBAIS
  // ============================================================================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - REPOSITÓRIOS
  // ============================================================================

  // Repositórios de Estoque
  const categoryRepository = new PrismaCategoryRepository(prisma);
  const supplierRepository = new PrismaSupplierRepository(prisma);
  const productRepository = new PrismaProductRepository(prisma);
  const stockMovementRepository = new PrismaStockMovementRepository(prisma);

  // Repositórios de Usuários e Clientes
  const userRepository = new PrismaUserRepository(prisma);
  const clientRepository = new PrismaClientRepository(prisma);

  // Repositórios de Vendas e Financeiro
  const saleRepository = new PrismaSaleRepository(prisma);
  const financialAccountRepository = new PrismaFinancialAccountRepository(prisma);

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - USE CASES DE ESTOQUE
  // ============================================================================

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

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - USE CASES DE USUÁRIOS
  // ============================================================================

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getPaginatedUsersUseCase = new GetPaginatedUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository);

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - USE CASES DE CLIENTES
  // ============================================================================

  const createClientUseCase = new CreateClientUseCase(clientRepository);
  const getClientByIdUseCase = new GetClientByIdUseCase(clientRepository);
  const getPaginatedClientsUseCase = new GetPaginatedClientsUseCase(clientRepository);
  const updateClientUseCase = new UpdateClientUseCase(clientRepository);
  const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
  const getClientsWithDebtsUseCase = new GetClientsWithDebtsUseCase(clientRepository);
  const getTotalDebtsUseCase = new GetTotalDebtsUseCase(clientRepository);

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - USE CASES DE VENDAS
  // ============================================================================

  const createSaleUseCase = new CreateSaleUseCase(saleRepository, productRepository, clientRepository, stockMovementRepository);
  const getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository);
  const getPaginatedSalesUseCase = new GetPaginatedSalesUseCase(saleRepository);
  const cancelSaleUseCase = new CancelSaleUseCase(saleRepository, productRepository, stockMovementRepository, clientRepository);
  const getTodaySalesUseCase = new GetTodaySalesUseCase(saleRepository);
  const getSalesSummaryUseCase = new GetSalesSummaryUseCase(saleRepository);
  const getSalesByDateRangeUseCase = new GetSalesByDateRangeUseCase(saleRepository);

  // ============================================================================
  // INJEÇÃO DE DEPENDÊNCIAS - USE CASES FINANCEIROS
  // ============================================================================

  const createPayableUseCase = new CreatePayableAccountUseCase(financialAccountRepository);
  const createReceivableUseCase = new CreateReceivableAccountUseCase(financialAccountRepository);
  const getAccountByIdUseCase = new GetAccountByIdUseCase(financialAccountRepository);
  const getPaginatedAccountsUseCase = new GetPaginatedAccountsUseCase(financialAccountRepository);
  const registerPaymentUseCase = new RegisterAccountPaymentUseCase(financialAccountRepository);
  const cancelAccountUseCase = new CancelAccountUseCase(financialAccountRepository);
  const getOverdueAccountsUseCase = new GetOverdueAccountsUseCase(financialAccountRepository);
  const getFinancialSummaryUseCase = new GetFinancialSummaryUseCase(financialAccountRepository);

  // ============================================================================
  // CONTROLLERS
  // ============================================================================

  // Controllers de Estoque
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

  // Controller de Usuários
  const userController = new UserController(
    createUserUseCase,
    authenticateUserUseCase,
    getUserByIdUseCase,
    getPaginatedUsersUseCase,
    updateUserUseCase,
    deactivateUserUseCase,
    changePasswordUseCase
  );

  // Controller de Clientes
  const clientController = new ClientController(
    createClientUseCase,
    getClientByIdUseCase,
    getPaginatedClientsUseCase,
    updateClientUseCase,
    deleteClientUseCase,
    getClientsWithDebtsUseCase,
    getTotalDebtsUseCase
  );

  // Controller de Vendas
  const saleController = new SaleController(
    createSaleUseCase,
    getSaleByIdUseCase,
    getPaginatedSalesUseCase,
    cancelSaleUseCase,
    getTodaySalesUseCase,
    getSalesSummaryUseCase,
    getSalesByDateRangeUseCase
  );

  // Controller Financeiro
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

  // ============================================================================
  // ROTAS
  // ============================================================================

  // Rota de status/health check
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'API de Estoque - Sistema de Gestão para Supermercado',
      version: '2.0.0',
      description: 'API completa com Clean Architecture para controle mercantil',
      modules: {
        stock: {
          categories: '/api/categories',
          suppliers: '/api/suppliers',
          products: '/api/products',
          stockMovements: '/api/stock-movements',
        },
        users: {
          users: '/api/users',
        },
        sales: {
          clients: '/api/clients',
          sales: '/api/sales',
        },
        financial: {
          accounts: '/api/financial/accounts',
          summary: '/api/financial/summary',
        },
      },
    });
  });

  // Rotas de Estoque
  app.use('/api/categories', createCategoryRoutes(categoryController));
  app.use('/api/suppliers', createSupplierRoutes(supplierController));
  app.use('/api/products', createProductRoutes(productController));
  app.use('/api/stock-movements', createStockMovementRoutes(stockMovementController));

  // Rotas de Usuários
  app.use('/api/users', createUserRoutes(userController));

  // Rotas de Clientes e Vendas
  app.use('/api/clients', createClientRoutes(clientController));
  app.use('/api/sales', createSaleRoutes(saleController));

  // Rotas Financeiras
  app.use('/api/financial', createFinancialRoutes(financialController));

  // ============================================================================
  // MIDDLEWARE DE ERRO GLOBAL
  // ============================================================================
  // Importamos os middlewares centralizados para tratamento de erros.
  // O notFoundHandler trata rotas que não existem (404).
  // O errorHandler trata todos os erros lançados pela aplicação.
  // ============================================================================
  
  // Importar middlewares de erro
  const { errorHandler, notFoundHandler } = require('./presentation/middlewares');
  
  // Middleware para rotas não encontradas (deve vir antes do errorHandler)
  app.use(notFoundHandler);
  
  // Middleware de tratamento de erros (deve ser o último)
  app.use(errorHandler);

  return app;
}

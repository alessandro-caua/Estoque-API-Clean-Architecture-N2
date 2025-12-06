/**
 * DEPENDENCY INJECTION CONTAINER
 * 
 * Configura e registra todas as dependências usando TSyringe.
 * Elimina necessidade de DI manual.
 */

import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

// Prisma e Database
import { PrismaLibSql } from '../database/PrismaLibSql';

// DAOs
import { IBaseDAO } from '../dao/IBaseDAO';
import { ProductDAO } from '../dao/ProductDAO';
import { CategoryDAO } from '../dao/CategoryDAO';
import { SupplierDAO } from '../dao/SupplierDAO';
import { ClientDAO } from '../dao/ClientDAO';
import { UserDAO } from '../dao/UserDAO';
import { StockMovementDAO } from '../dao/StockMovementDAO';
import { SaleDAO } from '../dao/SaleDAO';
import { FinancialAccountDAO } from '../dao/FinancialAccountDAO';

// Repositories
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { ISupplierRepository } from '../../domain/repositories/ISupplierRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IStockMovementRepository } from '../../domain/repositories/IStockMovementRepository';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import { IFinancialAccountRepository } from '../../domain/repositories/IFinancialAccountRepository';

import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaSupplierRepository } from '../repositories/PrismaSupplierRepository';
import { PrismaClientRepository } from '../repositories/PrismaClientRepository';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaStockMovementRepository } from '../repositories/PrismaStockMovementRepository';
import { PrismaSaleRepository } from '../repositories/PrismaSaleRepository';
import { PrismaFinancialAccountRepository } from '../repositories/PrismaFinancialAccountRepository';

// Events
import { IEventDispatcher } from '../events/IEventDispatcher';
import { InMemoryEventDispatcher } from '../events/InMemoryEventDispatcher';
import {
  LogProductCreatedHandler,
  LowStockAlertHandler,
  LogSaleCreatedHandler,
  LogStockMovementHandler,
  UpdateStatisticsHandler,
} from '../events/EventHandlers';

// Use Cases - Product
import { CreateProductUseCase } from '../../application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '../../application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/use-cases/product/DeleteProductUseCase';
import { GetProductByIdUseCase } from '../../application/use-cases/product/GetProductByIdUseCase';
import { ListProductsUseCase } from '../../application/use-cases/product/ListProductsUseCase';
import { SearchProductsUseCase } from '../../application/use-cases/product/SearchProductsUseCase';
import { GetLowStockProductsUseCase } from '../../application/use-cases/product/GetLowStockProductsUseCase';
import { AdjustStockUseCase } from '../../application/use-cases/product/AdjustStockUseCase';

// Use Cases - Category
import { CreateCategoryUseCase } from '../../application/use-cases/category/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../../application/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../application/use-cases/category/DeleteCategoryUseCase';
import { GetCategoryByIdUseCase } from '../../application/use-cases/category/GetCategoryByIdUseCase';
import { ListCategoriesUseCase } from '../../application/use-cases/category/ListCategoriesUseCase';

// Use Cases - Supplier
import { CreateSupplierUseCase } from '../../application/use-cases/supplier/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '../../application/use-cases/supplier/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '../../application/use-cases/supplier/DeleteSupplierUseCase';
import { GetSupplierByIdUseCase } from '../../application/use-cases/supplier/GetSupplierByIdUseCase';
import { ListSuppliersUseCase } from '../../application/use-cases/supplier/ListSuppliersUseCase';

// Use Cases - Client
import { CreateClientUseCase } from '../../application/use-cases/client/CreateClientUseCase';
import { UpdateClientUseCase } from '../../application/use-cases/client/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../application/use-cases/client/DeleteClientUseCase';
import { GetClientByIdUseCase } from '../../application/use-cases/client/GetClientByIdUseCase';
import { ListClientsUseCase } from '../../application/use-cases/client/ListClientsUseCase';

// Use Cases - User
import { CreateUserUseCase } from '../../application/use-cases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/user/DeleteUserUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/user/GetUserByIdUseCase';
import { ListUsersUseCase } from '../../application/use-cases/user/ListUsersUseCase';

// Use Cases - Stock Movement
import { CreateStockMovementUseCase } from '../../application/use-cases/stock-movement/CreateStockMovementUseCase';
import { GetStockMovementByIdUseCase } from '../../application/use-cases/stock-movement/GetStockMovementByIdUseCase';
import { ListStockMovementsUseCase } from '../../application/use-cases/stock-movement/ListStockMovementsUseCase';
import { GetStockHistoryUseCase } from '../../application/use-cases/stock-movement/GetStockHistoryUseCase';

// Use Cases - Sale
import { CreateSaleUseCase } from '../../application/use-cases/sale/CreateSaleUseCase';
import { CancelSaleUseCase } from '../../application/use-cases/sale/CancelSaleUseCase';
import { GetSaleByIdUseCase } from '../../application/use-cases/sale/GetSaleByIdUseCase';
import { ListSalesUseCase } from '../../application/use-cases/sale/ListSalesUseCase';
import { GetSalesByPeriodUseCase } from '../../application/use-cases/sale/GetSalesByPeriodUseCase';

// Use Cases - Financial Account
import { CreateFinancialAccountUseCase } from '../../application/use-cases/financial-account/CreateFinancialAccountUseCase';
import { GetFinancialAccountByIdUseCase } from '../../application/use-cases/financial-account/GetFinancialAccountByIdUseCase';
import { ListFinancialAccountsUseCase } from '../../application/use-cases/financial-account/ListFinancialAccountsUseCase';
import { GetAccountBalanceUseCase } from '../../application/use-cases/financial-account/GetAccountBalanceUseCase';
import { RecordTransactionUseCase } from '../../application/use-cases/financial-account/RecordTransactionUseCase';

// Controllers
import { ProductController } from '../../presentation/controllers/ProductController';
import { CategoryController } from '../../presentation/controllers/CategoryController';
import { SupplierController } from '../../presentation/controllers/SupplierController';
import { ClientController } from '../../presentation/controllers/ClientController';
import { UserController } from '../../presentation/controllers/UserController';
import { StockMovementController } from '../../presentation/controllers/StockMovementController';
import { SaleController } from '../../presentation/controllers/SaleController';
import { FinancialAccountController } from '../../presentation/controllers/FinancialAccountController';

import { logger } from '../logging/logger';

/**
 * Configura e inicializa o container de DI
 */
export function setupContainer(): void {
  logger.info('🔧 Setting up DI Container...');

  // ========================================
  // DATABASE & PRISMA
  // ========================================
  const prismaClient = PrismaLibSql.getInstance();
  container.registerInstance(PrismaClient, prismaClient);

  // ========================================
  // EVENT DISPATCHER
  // ========================================
  container.registerSingleton<IEventDispatcher>(
    'IEventDispatcher',
    InMemoryEventDispatcher
  );

  // Registra event handlers
  const eventDispatcher = container.resolve<IEventDispatcher>('IEventDispatcher');
  
  eventDispatcher.register('product.created', new LogProductCreatedHandler());
  eventDispatcher.register('product.low-stock', new LowStockAlertHandler());
  eventDispatcher.register('sale.created', new LogSaleCreatedHandler());
  eventDispatcher.register('sale.created', new UpdateStatisticsHandler());
  eventDispatcher.register('stock.movement-registered', new LogStockMovementHandler());

  logger.info('✅ Event handlers registered');

  // ========================================
  // DAOs
  // ========================================
  container.register<ProductDAO>('ProductDAO', {
    useFactory: (c) => new ProductDAO(c.resolve(PrismaClient)),
  });

  container.register<CategoryDAO>('CategoryDAO', {
    useFactory: (c) => new CategoryDAO(c.resolve(PrismaClient)),
  });

  container.register<SupplierDAO>('SupplierDAO', {
    useFactory: (c) => new SupplierDAO(c.resolve(PrismaClient)),
  });

  container.register<ClientDAO>('ClientDAO', {
    useFactory: (c) => new ClientDAO(c.resolve(PrismaClient)),
  });

  container.register<UserDAO>('UserDAO', {
    useFactory: (c) => new UserDAO(c.resolve(PrismaClient)),
  });

  container.register<StockMovementDAO>('StockMovementDAO', {
    useFactory: (c) => new StockMovementDAO(c.resolve(PrismaClient)),
  });

  container.register<SaleDAO>('SaleDAO', {
    useFactory: (c) => new SaleDAO(c.resolve(PrismaClient)),
  });

  container.register<FinancialAccountDAO>('FinancialAccountDAO', {
    useFactory: (c) => new FinancialAccountDAO(c.resolve(PrismaClient)),
  });

  // ========================================
  // REPOSITORIES
  // ========================================
  container.register<IProductRepository>('IProductRepository', {
    useFactory: (c) => new PrismaProductRepository(
      c.resolve('ProductDAO')
    ),
  });

  container.register<ICategoryRepository>('ICategoryRepository', {
    useFactory: (c) => new PrismaCategoryRepository(
      c.resolve('CategoryDAO')
    ),
  });

  container.register<ISupplierRepository>('ISupplierRepository', {
    useFactory: (c) => new PrismaSupplierRepository(
      c.resolve('SupplierDAO')
    ),
  });

  container.register<IClientRepository>('IClientRepository', {
    useFactory: (c) => new PrismaClientRepository(
      c.resolve('ClientDAO')
    ),
  });

  container.register<IUserRepository>('IUserRepository', {
    useFactory: (c) => new PrismaUserRepository(
      c.resolve('UserDAO')
    ),
  });

  container.register<IStockMovementRepository>('IStockMovementRepository', {
    useFactory: (c) => new PrismaStockMovementRepository(
      c.resolve('StockMovementDAO')
    ),
  });

  container.register<ISaleRepository>('ISaleRepository', {
    useFactory: (c) => new PrismaSaleRepository(
      c.resolve('SaleDAO')
    ),
  });

  container.register<IFinancialAccountRepository>('IFinancialAccountRepository', {
    useFactory: (c) => new PrismaFinancialAccountRepository(
      c.resolve('FinancialAccountDAO')
    ),
  });

  // ========================================
  // USE CASES - Product
  // ========================================
  container.register(CreateProductUseCase, {
    useFactory: (c) => new CreateProductUseCase(
      c.resolve<IProductRepository>('IProductRepository'),
      c.resolve<ICategoryRepository>('ICategoryRepository'),
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  container.register(UpdateProductUseCase, {
    useFactory: (c) => new UpdateProductUseCase(
      c.resolve<IProductRepository>('IProductRepository'),
      c.resolve<ICategoryRepository>('ICategoryRepository'),
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  container.register(DeleteProductUseCase, {
    useFactory: (c) => new DeleteProductUseCase(
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(GetProductByIdUseCase, {
    useFactory: (c) => new GetProductByIdUseCase(
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(ListProductsUseCase, {
    useFactory: (c) => new ListProductsUseCase(
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(SearchProductsUseCase, {
    useFactory: (c) => new SearchProductsUseCase(
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(GetLowStockProductsUseCase, {
    useFactory: (c) => new GetLowStockProductsUseCase(
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(AdjustStockUseCase, {
    useFactory: (c) => new AdjustStockUseCase(
      c.resolve<IProductRepository>('IProductRepository'),
      c.resolve<IStockMovementRepository>('IStockMovementRepository')
    ),
  });

  // ========================================
  // USE CASES - Category
  // ========================================
  container.register(CreateCategoryUseCase, {
    useFactory: (c) => new CreateCategoryUseCase(
      c.resolve<ICategoryRepository>('ICategoryRepository')
    ),
  });

  container.register(UpdateCategoryUseCase, {
    useFactory: (c) => new UpdateCategoryUseCase(
      c.resolve<ICategoryRepository>('ICategoryRepository')
    ),
  });

  container.register(DeleteCategoryUseCase, {
    useFactory: (c) => new DeleteCategoryUseCase(
      c.resolve<ICategoryRepository>('ICategoryRepository'),
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(GetCategoryByIdUseCase, {
    useFactory: (c) => new GetCategoryByIdUseCase(
      c.resolve<ICategoryRepository>('ICategoryRepository')
    ),
  });

  container.register(ListCategoriesUseCase, {
    useFactory: (c) => new ListCategoriesUseCase(
      c.resolve<ICategoryRepository>('ICategoryRepository')
    ),
  });

  // ========================================
  // USE CASES - Supplier
  // ========================================
  container.register(CreateSupplierUseCase, {
    useFactory: (c) => new CreateSupplierUseCase(
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  container.register(UpdateSupplierUseCase, {
    useFactory: (c) => new UpdateSupplierUseCase(
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  container.register(DeleteSupplierUseCase, {
    useFactory: (c) => new DeleteSupplierUseCase(
      c.resolve<ISupplierRepository>('ISupplierRepository'),
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(GetSupplierByIdUseCase, {
    useFactory: (c) => new GetSupplierByIdUseCase(
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  container.register(ListSuppliersUseCase, {
    useFactory: (c) => new ListSuppliersUseCase(
      c.resolve<ISupplierRepository>('ISupplierRepository')
    ),
  });

  // ========================================
  // USE CASES - Client
  // ========================================
  container.register(CreateClientUseCase, {
    useFactory: (c) => new CreateClientUseCase(
      c.resolve<IClientRepository>('IClientRepository')
    ),
  });

  container.register(UpdateClientUseCase, {
    useFactory: (c) => new UpdateClientUseCase(
      c.resolve<IClientRepository>('IClientRepository')
    ),
  });

  container.register(DeleteClientUseCase, {
    useFactory: (c) => new DeleteClientUseCase(
      c.resolve<IClientRepository>('IClientRepository')
    ),
  });

  container.register(GetClientByIdUseCase, {
    useFactory: (c) => new GetClientByIdUseCase(
      c.resolve<IClientRepository>('IClientRepository')
    ),
  });

  container.register(ListClientsUseCase, {
    useFactory: (c) => new ListClientsUseCase(
      c.resolve<IClientRepository>('IClientRepository')
    ),
  });

  // ========================================
  // USE CASES - User
  // ========================================
  container.register(CreateUserUseCase, {
    useFactory: (c) => new CreateUserUseCase(
      c.resolve<IUserRepository>('IUserRepository')
    ),
  });

  container.register(UpdateUserUseCase, {
    useFactory: (c) => new UpdateUserUseCase(
      c.resolve<IUserRepository>('IUserRepository')
    ),
  });

  container.register(DeleteUserUseCase, {
    useFactory: (c) => new DeleteUserUseCase(
      c.resolve<IUserRepository>('IUserRepository')
    ),
  });

  container.register(GetUserByIdUseCase, {
    useFactory: (c) => new GetUserByIdUseCase(
      c.resolve<IUserRepository>('IUserRepository')
    ),
  });

  container.register(ListUsersUseCase, {
    useFactory: (c) => new ListUsersUseCase(
      c.resolve<IUserRepository>('IUserRepository')
    ),
  });

  // ========================================
  // USE CASES - Stock Movement
  // ========================================
  container.register(CreateStockMovementUseCase, {
    useFactory: (c) => new CreateStockMovementUseCase(
      c.resolve<IStockMovementRepository>('IStockMovementRepository'),
      c.resolve<IProductRepository>('IProductRepository')
    ),
  });

  container.register(GetStockMovementByIdUseCase, {
    useFactory: (c) => new GetStockMovementByIdUseCase(
      c.resolve<IStockMovementRepository>('IStockMovementRepository')
    ),
  });

  container.register(ListStockMovementsUseCase, {
    useFactory: (c) => new ListStockMovementsUseCase(
      c.resolve<IStockMovementRepository>('IStockMovementRepository')
    ),
  });

  container.register(GetStockHistoryUseCase, {
    useFactory: (c) => new GetStockHistoryUseCase(
      c.resolve<IStockMovementRepository>('IStockMovementRepository')
    ),
  });

  // ========================================
  // USE CASES - Sale
  // ========================================
  container.register(CreateSaleUseCase, {
    useFactory: (c) => new CreateSaleUseCase(
      c.resolve<ISaleRepository>('ISaleRepository'),
      c.resolve<IProductRepository>('IProductRepository'),
      c.resolve<IUserRepository>('IUserRepository'),
      c.resolve<IClientRepository>('IClientRepository'),
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(CancelSaleUseCase, {
    useFactory: (c) => new CancelSaleUseCase(
      c.resolve<ISaleRepository>('ISaleRepository'),
      c.resolve<IProductRepository>('IProductRepository'),
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(GetSaleByIdUseCase, {
    useFactory: (c) => new GetSaleByIdUseCase(
      c.resolve<ISaleRepository>('ISaleRepository')
    ),
  });

  container.register(ListSalesUseCase, {
    useFactory: (c) => new ListSalesUseCase(
      c.resolve<ISaleRepository>('ISaleRepository')
    ),
  });

  container.register(GetSalesByPeriodUseCase, {
    useFactory: (c) => new GetSalesByPeriodUseCase(
      c.resolve<ISaleRepository>('ISaleRepository')
    ),
  });

  // ========================================
  // USE CASES - Financial Account
  // ========================================
  container.register(CreateFinancialAccountUseCase, {
    useFactory: (c) => new CreateFinancialAccountUseCase(
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(GetFinancialAccountByIdUseCase, {
    useFactory: (c) => new GetFinancialAccountByIdUseCase(
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(ListFinancialAccountsUseCase, {
    useFactory: (c) => new ListFinancialAccountsUseCase(
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(GetAccountBalanceUseCase, {
    useFactory: (c) => new GetAccountBalanceUseCase(
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  container.register(RecordTransactionUseCase, {
    useFactory: (c) => new RecordTransactionUseCase(
      c.resolve<IFinancialAccountRepository>('IFinancialAccountRepository')
    ),
  });

  // ========================================
  // CONTROLLERS
  // ========================================
  container.register(ProductController, {
    useFactory: (c) => new ProductController(
      c.resolve(CreateProductUseCase),
      c.resolve(UpdateProductUseCase),
      c.resolve(DeleteProductUseCase),
      c.resolve(GetProductByIdUseCase),
      c.resolve(ListProductsUseCase),
      c.resolve(SearchProductsUseCase),
      c.resolve(GetLowStockProductsUseCase),
      c.resolve(AdjustStockUseCase)
    ),
  });

  container.register(CategoryController, {
    useFactory: (c) => new CategoryController(
      c.resolve(CreateCategoryUseCase),
      c.resolve(UpdateCategoryUseCase),
      c.resolve(DeleteCategoryUseCase),
      c.resolve(GetCategoryByIdUseCase),
      c.resolve(ListCategoriesUseCase)
    ),
  });

  container.register(SupplierController, {
    useFactory: (c) => new SupplierController(
      c.resolve(CreateSupplierUseCase),
      c.resolve(UpdateSupplierUseCase),
      c.resolve(DeleteSupplierUseCase),
      c.resolve(GetSupplierByIdUseCase),
      c.resolve(ListSuppliersUseCase)
    ),
  });

  container.register(ClientController, {
    useFactory: (c) => new ClientController(
      c.resolve(CreateClientUseCase),
      c.resolve(UpdateClientUseCase),
      c.resolve(DeleteClientUseCase),
      c.resolve(GetClientByIdUseCase),
      c.resolve(ListClientsUseCase)
    ),
  });

  container.register(UserController, {
    useFactory: (c) => new UserController(
      c.resolve(CreateUserUseCase),
      c.resolve(UpdateUserUseCase),
      c.resolve(DeleteUserUseCase),
      c.resolve(GetUserByIdUseCase),
      c.resolve(ListUsersUseCase)
    ),
  });

  container.register(StockMovementController, {
    useFactory: (c) => new StockMovementController(
      c.resolve(CreateStockMovementUseCase),
      c.resolve(GetStockMovementByIdUseCase),
      c.resolve(ListStockMovementsUseCase),
      c.resolve(GetStockHistoryUseCase)
    ),
  });

  container.register(SaleController, {
    useFactory: (c) => new SaleController(
      c.resolve(CreateSaleUseCase),
      c.resolve(CancelSaleUseCase),
      c.resolve(GetSaleByIdUseCase),
      c.resolve(ListSalesUseCase),
      c.resolve(GetSalesByPeriodUseCase)
    ),
  });

  container.register(FinancialAccountController, {
    useFactory: (c) => new FinancialAccountController(
      c.resolve(CreateFinancialAccountUseCase),
      c.resolve(GetFinancialAccountByIdUseCase),
      c.resolve(ListFinancialAccountsUseCase),
      c.resolve(GetAccountBalanceUseCase),
      c.resolve(RecordTransactionUseCase)
    ),
  });

  logger.info('✅ DI Container configured successfully');
}

/**
 * Exporta o container configurado
 */
export { container };

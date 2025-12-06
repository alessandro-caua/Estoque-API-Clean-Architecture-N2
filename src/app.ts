/**
 * ============================================================================
 * APLICAÇÃO EXPRESS - Clean Architecture com DI Container
 * ============================================================================
 * API de Estoque para Supermercado usando:
 * - TSyringe para Injeção de Dependências
 * - Winston para Logging Estruturado
 * - Domain Events para comunicação entre módulos
 * - Clean Architecture (Domain → Application → Infrastructure → Presentation)
 * ============================================================================
 */

import 'reflect-metadata'; // Necessário para TSyringe
import express, { Application, Request, Response, NextFunction } from 'express';

// Config e Logging
import { config, validateConfig } from './config';
import { logger, logRequest } from './infrastructure/logging/logger';

// Container de DI
import { setupContainer, container } from './infrastructure/di/container';

// Controllers (resolvidos via container)
import { ProductController } from './presentation/controllers/ProductController';
import { CategoryController } from './presentation/controllers/CategoryController';
import { SupplierController } from './presentation/controllers/SupplierController';
import { ClientController } from './presentation/controllers/ClientController';
import { UserController } from './presentation/controllers/UserController';
import { StockMovementController } from './presentation/controllers/StockMovementController';
import { SaleController } from './presentation/controllers/SaleController';
// Routes
import { createProductRoutes } from './presentation/routes/productRoutes';
import { createCategoryRoutes } from './presentation/routes/categoryRoutes';
import { createSupplierRoutes } from './presentation/routes/supplierRoutes';
import { createClientRoutes } from './presentation/routes/clientRoutes';
import { createUserRoutes } from './presentation/routes/userRoutes';
import { createStockMovementRoutes } from './presentation/routes/stockMovementRoutes';
import { createSaleRoutes } from './presentation/routes/saleRoutes';

// Middleware de erro
import { errorHandler } from './presentation/middlewares/errorHandler';

/**
 * Cria e configura a aplicação Express
 */
export function createApp(): Application {
  // Valida configurações
  validateConfig();

  // Inicializa container de DI
  setupContainer();

  // Cria aplicação Express
  const app = express();

  // ========================================
  // MIDDLEWARES GLOBAIS
  // ========================================
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware de logging de requisições
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logRequest(req.method, req.path, res.statusCode, duration);
    });

    next();
  });

  // ========================================
  // HEALTH CHECK
  // ========================================
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      environment: config.app.env,
      version: config.app.version,
      timestamp: new Date().toISOString(),
    });
  });

  // ========================================
  // ROTAS DA API
  // ========================================
  const apiPrefix = config.api.prefix;

  // Resolve controllers do container
  const productController = container.resolve(ProductController);
  const categoryController = container.resolve(CategoryController);
  const supplierController = container.resolve(SupplierController);
  const clientController = container.resolve(ClientController);
  const userController = container.resolve(UserController);
  const stockMovementController = container.resolve(StockMovementController);
  const saleController = container.resolve(SaleController);

  // Registra rotas
  app.use(`${apiPrefix}/products`, createProductRoutes(productController));
  app.use(`${apiPrefix}/categories`, createCategoryRoutes(categoryController));
  app.use(`${apiPrefix}/suppliers`, createSupplierRoutes(supplierController));
  app.use(`${apiPrefix}/clients`, createClientRoutes(clientController));
  app.use(`${apiPrefix}/users`, createUserRoutes(userController));
  app.use(`${apiPrefix}/stock-movements`, createStockMovementRoutes(stockMovementController));
  app.use(`${apiPrefix}/sales`, createSaleRoutes(saleController));

  // ========================================
  // ROTA 404
  // ========================================
  app.use((req: Request, res: Response) => {
    logger.warn(`Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // ========================================
  // ERROR HANDLER
  // ========================================
  app.use(errorHandler);

  logger.info('✅ Express application configured successfully');

  return app;
}

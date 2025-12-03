// ============================================================================
// ROUTES - EXPORTS
// ============================================================================
// Arquivo barrel para exportação de todas as rotas da aplicação.
// ============================================================================

// Módulos de Estoque
export { createCategoryRoutes } from './categoryRoutes';
export { createSupplierRoutes } from './supplierRoutes';
export { createProductRoutes } from './productRoutes';
export { createStockMovementRoutes } from './stockMovementRoutes';

// Módulos de Usuários
export { createUserRoutes } from './userRoutes';

// Módulos de Clientes e Vendas
export { createClientRoutes } from './clientRoutes';
export { createSaleRoutes } from './saleRoutes';

// Módulos Financeiros
export { createFinancialRoutes } from './financialRoutes';

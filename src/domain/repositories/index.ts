// ============================================================================
// ARQUIVO DE EXPORTAÇÃO: INTERFACES DE REPOSITÓRIOS
// ============================================================================
// Este arquivo centraliza todas as exportações das interfaces de repositório.
// Segue o princípio de Inversão de Dependência (DIP - SOLID).
// As implementações concretas ficam na camada de infraestrutura.
// ============================================================================

// ==================== REPOSITÓRIOS BASE ====================

/** Repositório de categorias */
export { ICategoryRepository } from './ICategoryRepository';

/** Repositório de fornecedores */
export { ISupplierRepository } from './ISupplierRepository';

/** Repositório de produtos */
export { IProductRepository, ProductFilters } from './IProductRepository';

/** Repositório de movimentações de estoque */
export { 
  IStockMovementRepository, 
  StockMovementFilters
} from './IStockMovementRepository';

// ==================== USUÁRIOS E AUTENTICAÇÃO ====================

/** Repositório de usuários */
export { IUserRepository } from './IUserRepository';

// ==================== CLIENTES ====================

/** Repositório de clientes */
export { IClientRepository, ClientFilters } from './IClientRepository';

// ==================== VENDAS ====================

/** Repositório de vendas */
export { ISaleRepository, SaleFilters, SalesSummary } from './ISaleRepository';

// ==================== FINANCEIRO ====================

/** Repositório de contas financeiras */
export { 
  IFinancialAccountRepository, 
  FinancialAccountFilters,
  FinancialSummary 
} from './IFinancialAccountRepository';

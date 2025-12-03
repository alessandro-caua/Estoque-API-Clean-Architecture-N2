// ============================================================================
// CASOS DE USO - EXPORTS
// ============================================================================
// Arquivo barrel para exportação de todos os casos de uso da aplicação.
// Facilita a importação em outras partes do sistema.
// ============================================================================

// Módulos de Estoque
export * from './CategoryUseCases';
export * from './SupplierUseCases';
export * from './ProductUseCases';
export * from './StockMovementUseCases';

// Módulos de Vendas e Clientes
export * from './SaleUseCases';
export * from './ClientUseCases';

// Módulos Financeiros
export * from './FinancialUseCases';

// Módulos de Usuários
export * from './UserUseCases';

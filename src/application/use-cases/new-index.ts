// ============================================================================
// ÍNDICE PRINCIPAL DE USE CASES
// ============================================================================
// 
// Este arquivo exporta TODOS os Use Cases da aplicação.
// Permite importar de um único lugar.
// 
// ESTRUTURA FINAL:
// ================
// 
// src/application/use-cases/
// ├── category/
// │   ├── CreateCategoryUseCase.ts
// │   ├── GetCategoryByIdUseCase.ts
// │   ├── GetAllCategoriesUseCase.ts
// │   ├── UpdateCategoryUseCase.ts
// │   ├── DeleteCategoryUseCase.ts
// │   └── index.ts
// ├── product/
// │   ├── CreateProductUseCase.ts
// │   ├── GetProductUseCases.ts
// │   ├── UpdateProductUseCase.ts
// │   ├── DeleteProductUseCase.ts
// │   └── index.ts
// ├── sale/
// │   ├── CreateSaleUseCase.ts
// │   ├── CancelSaleUseCase.ts
// │   ├── GetSaleUseCases.ts
// │   └── index.ts
// └── index.ts                   <- Este arquivo
// 
// COMO USAR:
// ==========
// 
// // Importa tudo de uma vez
// import { 
//   CreateCategoryUseCase, 
//   CreateProductUseCase,
//   CreateSaleUseCase 
// } from './application/use-cases';
// 
// ============================================================================

// ============================================================================
// USE CASES DE CATEGORIA
// ============================================================================
export {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from './category';

// ============================================================================
// USE CASES DE PRODUTO
// ============================================================================
export {
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
} from './product';

// ============================================================================
// USE CASES DE VENDA
// ============================================================================
export {
  CreateSaleUseCase,
  CancelSaleUseCase,
  GetSaleByIdUseCase,
  GetPaginatedSalesUseCase,
  GetTodaySalesUseCase,
  GetSalesSummaryUseCase,
  GetSalesByDateRangeUseCase,
} from './sale';

// ============================================================================
// MANTER COMPATIBILIDADE COM CÓDIGO EXISTENTE
// ============================================================================
// 
// Os arquivos antigos (CategoryUseCases.ts, ProductUseCases.ts, etc.)
// ainda existem e funcionam. Esta nova estrutura é uma alternativa
// mais organizada que pode ser adotada gradualmente.
// 
// Reexporta dos arquivos antigos para não quebrar imports existentes:
// 
// ============================================================================

// Supplier (mantém arquivo antigo por enquanto)
export {
  CreateSupplierUseCase,
  GetSupplierByIdUseCase,
  GetAllSuppliersUseCase,
  UpdateSupplierUseCase,
  DeleteSupplierUseCase,
} from './SupplierUseCases';

// Stock Movement (mantém arquivo antigo)
export {
  CreateStockEntryUseCase,
  GetStockMovementByIdUseCase,
  GetAllStockMovementsUseCase,
  GetStockMovementsByProductUseCase,
  GetStockMovementsByTypeUseCase,
  GetStockMovementsByDateRangeUseCase,
  GetStockReportUseCase,
} from './StockMovementUseCases';

// User (mantém arquivo antigo)
export {
  CreateUserUseCase,
  AuthenticateUserUseCase,
  GetUserByIdUseCase,
  GetPaginatedUsersUseCase,
  UpdateUserUseCase,
  DeactivateUserUseCase,
  ChangePasswordUseCase,
} from './UserUseCases';

// Client (mantém arquivo antigo)
export {
  CreateClientUseCase,
  GetClientByIdUseCase,
  GetPaginatedClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  GetClientsWithDebtsUseCase,
  GetTotalDebtsUseCase,
} from './ClientUseCases';

// Financial (mantém arquivo antigo)
export {
  CreatePayableAccountUseCase,
  CreateReceivableAccountUseCase,
  GetAccountByIdUseCase,
  GetPaginatedAccountsUseCase,
  RegisterAccountPaymentUseCase,
  CancelAccountUseCase,
  GetOverdueAccountsUseCase,
  GetFinancialSummaryUseCase,
} from './FinancialUseCases';

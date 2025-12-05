// ============================================================================
// ÍNDICE DE DTOs - BARREL EXPORT
// ============================================================================
// 
// Este arquivo exporta todos os DTOs de um único lugar.
// 
// CONCEITO: Barrel Export (Exportação em Barril)
// ================================================
// 
// Imagine que você tem 10 arquivos de DTO.
// Sem barrel export, você teria que importar assim:
// 
// ```typescript
// import { CreateProductDTO } from './dtos/ProductDTO';
// import { CreateCategoryDTO } from './dtos/CategoryDTO';
// import { CreateSupplierDTO } from './dtos/SupplierDTO';
// // ... mais 7 imports
// ```
// 
// Com barrel export, você importa tudo de um lugar:
// 
// ```typescript
// import { 
//   CreateProductDTO, 
//   CreateCategoryDTO,
//   CreateSupplierDTO,
//   // ...tudo junto
// } from './dtos';
// ```
// 
// VANTAGENS:
// 1. Código mais limpo e organizado
// 2. Facilita refatoração (mover arquivos)
// 3. Centraliza as exportações
// 
// ============================================================================

// ============================================================================
// DTOs DE CATEGORIA
// ============================================================================
export {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryFiltersDTO,
} from './CategoryDTO';

// ============================================================================
// DTOs DE FORNECEDOR
// ============================================================================
export {
  CreateSupplierDTO,
  UpdateSupplierDTO,
  SupplierFiltersDTO,
} from './SupplierDTO';

// ============================================================================
// DTOs DE PRODUTO
// ============================================================================
export {
  CreateProductDTO,
  UpdateProductDTO,
  ProductFiltersDTO,
} from './ProductDTO';

// ============================================================================
// DTOs DE MOVIMENTAÇÃO DE ESTOQUE
// ============================================================================
export {
  CreateStockMovementDTO,
  StockMovementFiltersDTO,
  StockReportDTO,
} from './StockMovementDTO';

// ============================================================================
// DTOs DE USUÁRIO
// ============================================================================
export {
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
  ChangePasswordDTO,
  UserFiltersDTO,
} from './UserDTO';

// ============================================================================
// DTOs DE CLIENTE
// ============================================================================
export {
  CreateClientDTO,
  UpdateClientDTO,
  ClientFiltersDTO,
  DebtReportDTO,
} from './ClientDTO';

// ============================================================================
// DTOs DE VENDA
// ============================================================================
export {
  SaleItemDTO,
  CreateSaleDTO,
  SaleFiltersDTO,
  SalesSummaryDTO,
} from './SaleDTO';

// ============================================================================
// DTOs FINANCEIROS
// ============================================================================
export {
  CreateFinancialAccountDTO,
  RegisterPaymentDTO,
  FinancialAccountFiltersDTO,
  FinancialSummaryDTO,
} from './FinancialDTO';

// ============================================================================
// ÍNDICE DE USE CASES DE PRODUTO
// ============================================================================

// Criação
export { CreateProductUseCase } from './CreateProductUseCase';

// Consultas
export { 
  GetProductByIdUseCase,
  GetProductByBarcodeUseCase,
  GetAllProductsUseCase,
  GetLowStockProductsUseCase,
  GetExpiredProductsUseCase,
  GetProductsByCategoryUseCase,
  GetProductsBySupplierUseCase,
} from './GetProductUseCases';

// Atualização
export { UpdateProductUseCase } from './UpdateProductUseCase';

// Exclusão
export { DeleteProductUseCase } from './DeleteProductUseCase';

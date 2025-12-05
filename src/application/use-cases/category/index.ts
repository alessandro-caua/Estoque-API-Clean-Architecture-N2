// ============================================================================
// ÍNDICE DE USE CASES DE CATEGORIA
// ============================================================================
// 
// Barrel export para os Use Cases de Category.
// 
// ORGANIZAÇÃO RECOMENDADA:
// ========================
// 
// src/application/use-cases/
// ├── category/                 <- Pasta por entidade
// │   ├── CreateCategoryUseCase.ts
// │   ├── GetCategoryByIdUseCase.ts
// │   ├── GetAllCategoriesUseCase.ts
// │   ├── UpdateCategoryUseCase.ts
// │   ├── DeleteCategoryUseCase.ts
// │   └── index.ts              <- Este arquivo (barrel export)
// ├── product/
// ├── supplier/
// └── index.ts                  <- Exporta tudo junto
// 
// ============================================================================

export { CreateCategoryUseCase } from './CreateCategoryUseCase';
export { GetCategoryByIdUseCase } from './GetCategoryByIdUseCase';
export { GetAllCategoriesUseCase } from './GetAllCategoriesUseCase';
export { UpdateCategoryUseCase } from './UpdateCategoryUseCase';
export { DeleteCategoryUseCase } from './DeleteCategoryUseCase';

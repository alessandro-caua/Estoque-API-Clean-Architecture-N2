// ============================================================================
// VALIDADORES DE ENTRADA (INPUT VALIDATION)
// ============================================================================
// 
// Esta pasta contém os schemas de validação usando Zod.
// 
// CONCEITO: Validação de Entrada vs Validação de Domínio
// =====================================================
// 
// VALIDAÇÃO DE ENTRADA (aqui):
// - Verifica se os dados da requisição estão no formato correto
// - Ex: Email é uma string válida, preço é um número positivo
// - Acontece ANTES de chegar no Use Case
// - Retorna HTTP 400 (Bad Request) se inválido
// 
// VALIDAÇÃO DE DOMÍNIO (Use Cases):
// - Verifica regras de negócio
// - Ex: Email não está duplicado, estoque é suficiente
// - Acontece DENTRO do Use Case
// - Retorna erros específicos do domínio
// 
// BIBLIOTECA: Zod
// ===============
// Zod é uma biblioteca de validação com:
// - Inferência automática de tipos TypeScript
// - Mensagens de erro personalizáveis
// - Composição de schemas
// - Validação de tipos complexos
// 
// USO:
// ```typescript
// import { createCategorySchema } from './validators';
// 
// // No controller:
// const result = createCategorySchema.safeParse(req.body);
// if (!result.success) {
//   return res.status(400).json({ errors: result.error.errors });
// }
// const data = result.data; // Tipado automaticamente!
// ```
// 
// ============================================================================

export * from './categoryValidators';
export * from './productValidators';
export * from './supplierValidators';
export * from './clientValidators';
export * from './saleValidators';
export * from './userValidators';
export * from './stockMovementValidators';
export * from './financialValidators';

// ============================================================================
// ÍNDICE DE MIDDLEWARES
// ============================================================================
// 
// Esta pasta contém os middlewares da aplicação.
// 
// CONCEITO: Middleware
// ====================
// 
// Um middleware é uma função que intercepta requisições HTTP.
// Ele pode:
// - Modificar a requisição ou resposta
// - Executar código antes/depois do controller
// - Decidir se a requisição continua ou para
// 
// Middlewares são como "filtros" por onde a requisição passa:
// 
// Request → [Auth] → [Validation] → [Controller] → [Error] → Response
// 
// ============================================================================

export { errorHandler, notFoundHandler } from './errorHandler';

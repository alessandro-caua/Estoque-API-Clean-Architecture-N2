// ============================================================================
// DTOs DE CATEGORIA
// ============================================================================
// 
// DTO = Data Transfer Object (Objeto de Transferência de Dados)
// 
// O QUE É UM DTO?
// ----------------
// Um DTO é uma "caixa" que carrega dados entre camadas da aplicação.
// Ele define EXATAMENTE quais dados podem entrar ou sair de um Use Case.
// 
// POR QUE USAR DTOs?
// ------------------
// 1. SEGURANÇA: Evita que dados não desejados sejam aceitos
//    (ex: não queremos que o cliente envie o campo "id" na criação)
// 
// 2. DESACOPLAMENTO: A API pode mudar sem afetar as entidades
//    (ex: API usa "categoryName", entidade usa "name")
// 
// 3. VALIDAÇÃO: Define claramente o que é obrigatório
//    (campos com "?" são opcionais)
// 
// 4. DOCUMENTAÇÃO: Serve como contrato entre frontend e backend
// 
// CONVENÇÃO DE NOMES:
// - Create[Entidade]DTO: Para criação
// - Update[Entidade]DTO: Para atualização (campos opcionais)
// - [Entidade]ResponseDTO: Para respostas (se diferente da entidade)
// 
// ============================================================================

/**
 * DTO para criação de uma nova categoria
 * 
 * @description
 * Define os dados necessários para criar uma categoria.
 * Note que "id" não está aqui - é gerado automaticamente.
 * 
 * @example
 * ```typescript
 * const dto: CreateCategoryDTO = {
 *   name: 'Bebidas',
 *   description: 'Refrigerantes, sucos e águas'
 * };
 * ```
 */
export interface CreateCategoryDTO {
  /**
   * Nome da categoria
   * - Obrigatório
   * - Mínimo 2 caracteres
   * - Máximo 100 caracteres
   * - Deve ser único no sistema
   */
  name: string;

  /**
   * Descrição detalhada da categoria
   * - Opcional
   * - Ajuda a entender quais produtos pertencem aqui
   */
  description?: string;
}

/**
 * DTO para atualização de categoria existente
 * 
 * @description
 * Todos os campos são opcionais (Partial).
 * Apenas os campos enviados serão atualizados.
 * 
 * CONCEITO: Partial Update (Atualização Parcial)
 * O cliente pode enviar apenas os campos que quer mudar,
 * sem precisar reenviar todos os dados.
 * 
 * @example
 * ```typescript
 * // Atualizar apenas o nome
 * const dto: UpdateCategoryDTO = { name: 'Bebidas Geladas' };
 * 
 * // Atualizar apenas a descrição
 * const dto: UpdateCategoryDTO = { description: 'Nova descrição' };
 * ```
 */
export interface UpdateCategoryDTO {
  /**
   * Novo nome da categoria
   * - Opcional
   * - Se fornecido, deve ter 2-100 caracteres
   * - Deve ser único no sistema
   */
  name?: string;

  /**
   * Nova descrição da categoria
   * - Opcional
   */
  description?: string;
}

/**
 * DTO para filtros de listagem de categorias
 * 
 * @description
 * Define parâmetros opcionais para busca e paginação.
 * 
 * CONCEITO: Paginação
 * Em vez de retornar todos os registros (pode ser milhares),
 * retornamos em "páginas" de tamanho limitado.
 * 
 * @example
 * ```typescript
 * // Primeira página com 10 itens, buscando por "Bebida"
 * const filters: CategoryFiltersDTO = {
 *   search: 'Bebida',
 *   page: 1,
 *   limit: 10
 * };
 * ```
 */
export interface CategoryFiltersDTO {
  /**
   * Termo de busca textual
   * Busca no nome e descrição
   */
  search?: string;

  /**
   * Número da página (começa em 1)
   */
  page?: number;

  /**
   * Quantidade de itens por página
   * Padrão geralmente é 10 ou 20
   */
  limit?: number;
}

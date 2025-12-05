// ============================================================================
// DTOs DE PRODUTO
// ============================================================================
// 
// Produto é a entidade central do sistema de estoque.
// É onde acontece a maior parte das operações.
// 
// CONCEITOS IMPORTANTES:
// 
// 1. Preço de Custo vs Preço de Venda
//    - Custo: Quanto pagamos ao fornecedor
//    - Venda: Quanto vendemos ao cliente
//    - Margem = (Venda - Custo) / Custo * 100
// 
// 2. Quantidade vs Quantidade Mínima
//    - Quantidade: Estoque atual
//    - Mínima: Ponto de reposição (quando pedir mais)
//    - Baixo estoque: Quantidade <= Quantidade Mínima
// 
// ============================================================================

/**
 * DTO para criação de um novo produto
 * 
 * @description
 * Contém todos os dados necessários para cadastrar um produto.
 * Campos obrigatórios garantem que todo produto tenha as
 * informações essenciais para venda e controle.
 * 
 * @example
 * ```typescript
 * const dto: CreateProductDTO = {
 *   name: 'Refrigerante Cola 2L',
 *   description: 'Refrigerante sabor cola, garrafa PET 2 litros',
 *   barcode: '7891234567890',
 *   salePrice: 8.99,
 *   costPrice: 5.50,
 *   quantity: 100,
 *   minQuantity: 20,
 *   unit: 'UN',
 *   categoryId: 'uuid-da-categoria-bebidas',
 *   supplierId: 'uuid-do-fornecedor',
 *   expirationDate: new Date('2025-12-31')
 * };
 * ```
 */
export interface CreateProductDTO {
  /**
   * Nome do produto
   * - Obrigatório
   * - Mínimo 2 caracteres
   * - Deve ser descritivo (incluir marca, tamanho, etc)
   */
  name: string;

  /**
   * Descrição detalhada
   * - Opcional
   * - Informações adicionais sobre o produto
   */
  description?: string;

  /**
   * Código de barras
   * - Opcional
   * - Geralmente EAN-13 (13 dígitos)
   * - Deve ser único no sistema
   * 
   * DICA: O código de barras é lido pelo leitor no caixa,
   * agilizando o registro de vendas.
   */
  barcode?: string;

  /**
   * Preço de venda ao consumidor
   * - Obrigatório
   * - Não pode ser negativo
   * - Em Reais (R$)
   */
  salePrice: number;

  /**
   * Preço de custo (compra do fornecedor)
   * - Obrigatório
   * - Não pode ser negativo
   * - Usado para calcular lucro/margem
   */
  costPrice: number;

  /**
   * Quantidade inicial em estoque
   * - Opcional (padrão: 0)
   * - Não pode ser negativo
   */
  quantity?: number;

  /**
   * Quantidade mínima para alerta
   * - Opcional (padrão: 10)
   * - Quando estoque <= minQuantity, produto aparece como "baixo estoque"
   * 
   * REGRA DE NEGÓCIO:
   * Este valor ajuda o gerente a saber quando fazer novos pedidos.
   * Produtos de alta rotatividade devem ter minQuantity maior.
   */
  minQuantity?: number;

  /**
   * Unidade de medida
   * - Opcional (padrão: 'UN')
   * - Valores comuns: 'UN' (unidade), 'KG', 'L', 'PCT' (pacote)
   */
  unit?: string;

  /**
   * ID da categoria
   * - Obrigatório
   * - Deve existir no sistema
   * - Ex: "bebidas", "laticínios", "higiene"
   */
  categoryId: string;

  /**
   * ID do fornecedor
   * - Opcional
   * - Útil para saber de onde repor o produto
   */
  supplierId?: string;

  /**
   * Status do produto
   * - Opcional (padrão: true)
   * - Produtos inativos não podem ser vendidos
   */
  isActive?: boolean;

  /**
   * Data de validade
   * - Opcional
   * - Produtos vencidos aparecem em relatório especial
   * 
   * REGRA DE NEGÓCIO:
   * Produtos vencidos NÃO devem ser vendidos.
   * O sistema pode alertar automaticamente.
   */
  expirationDate?: Date;
}

/**
 * DTO para atualização de produto existente
 * 
 * @description
 * Permite atualização parcial dos dados do produto.
 * Útil para correções de preço, estoque, etc.
 * 
 * @example
 * ```typescript
 * // Reajuste de preço
 * const dto: UpdateProductDTO = {
 *   salePrice: 9.99,
 *   costPrice: 6.00
 * };
 * 
 * // Desativar produto descontinuado
 * const dto: UpdateProductDTO = { isActive: false };
 * ```
 */
export interface UpdateProductDTO {
  name?: string;
  description?: string;
  barcode?: string;
  salePrice?: number;
  costPrice?: number;
  quantity?: number;
  minQuantity?: number;
  unit?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  expirationDate?: Date;
}

/**
 * DTO para filtros de busca de produtos
 * 
 * @description
 * Define várias formas de filtrar a lista de produtos.
 * Filtros podem ser combinados.
 * 
 * @example
 * ```typescript
 * // Produtos ativos da categoria "bebidas" com baixo estoque
 * const filters: ProductFiltersDTO = {
 *   categoryId: 'uuid-bebidas',
 *   isActive: true,
 *   lowStock: true
 * };
 * ```
 */
export interface ProductFiltersDTO {
  /** Filtrar por categoria */
  categoryId?: string;

  /** Filtrar por fornecedor */
  supplierId?: string;

  /** Filtrar por status ativo/inativo */
  isActive?: boolean;

  /** Filtrar apenas produtos com estoque baixo */
  lowStock?: boolean;

  /** Filtrar apenas produtos vencidos */
  expired?: boolean;

  /** Filtrar produtos que vencem em X dias */
  nearExpiration?: number;

  /** Busca textual (nome, descrição, código) */
  search?: string;

  /** Preço mínimo */
  minPrice?: number;

  /** Preço máximo */
  maxPrice?: number;

  /** Página atual */
  page?: number;

  /** Itens por página */
  limit?: number;
}

// ============================================================================
// INTERFACE: IPRODUCTREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de produtos.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF01: Cadastro de produtos
// - RF02: Atualização de dados do produto
// - RF03: Exclusão de produtos
// - RF04: Listagem com filtros
// - RF05: Alertas de estoque mínimo
// ============================================================================

import { Product } from '../entities/Product';

/**
 * Filtros para busca de produtos
 */
export interface ProductFilters {
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
  /** Filtrar produtos próximos do vencimento (dias) */
  nearExpiration?: number;
  /** Busca textual por nome/descrição/código de barras */
  search?: string;
  /** Preço mínimo */
  minPrice?: number;
  /** Preço máximo */
  maxPrice?: number;
}

/**
 * Interface do repositório de Product - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de produtos deve fornecer.
 */
export interface IProductRepository {
  /**
   * Cria um novo produto
   * @param product - Entidade Product a ser persistida
   * @returns Promise com o produto criado (incluindo ID gerado)
   */
  create(product: Product): Promise<Product>;

  /**
   * Busca um produto pelo ID
   * @param id - Identificador único do produto
   * @returns Promise com o produto encontrado ou null
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Busca um produto pelo código de barras
   * @param barcode - Código de barras do produto
   * @returns Promise com o produto encontrado ou null
   */
  findByBarcode(barcode: string): Promise<Product | null>;

  /**
   * Lista todos os produtos com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de produtos
   */
  findAll(filters?: ProductFilters): Promise<Product[]>;

  /**
   * Busca produtos com estoque abaixo do mínimo (RF05)
   * @returns Promise com array de produtos com estoque baixo
   */
  findLowStock(): Promise<Product[]>;

  /**
   * Busca produtos vencidos
   * @returns Promise com array de produtos vencidos
   */
  findExpired(): Promise<Product[]>;

  /**
   * Busca produtos por categoria
   * @param categoryId - ID da categoria
   * @returns Promise com array de produtos da categoria
   */
  findByCategory(categoryId: string): Promise<Product[]>;

  /**
   * Busca produtos por fornecedor
   * @param supplierId - ID do fornecedor
   * @returns Promise com array de produtos do fornecedor
   */
  findBySupplier(supplierId: string): Promise<Product[]>;

  /**
   * Atualiza um produto existente
   * @param id - ID do produto a atualizar
   * @param product - Dados parciais para atualização
   * @returns Promise com o produto atualizado
   */
  update(id: string, product: Partial<Product>): Promise<Product>;

  /**
   * Atualiza apenas a quantidade em estoque
   * @param id - ID do produto
   * @param quantity - Nova quantidade
   * @returns Promise com o produto atualizado
   */
  updateQuantity(id: string, quantity: number): Promise<Product>;

  /**
   * Remove um produto (exclusão física)
   * @param id - ID do produto a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;
}

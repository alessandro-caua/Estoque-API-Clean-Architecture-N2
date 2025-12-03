// ============================================================================
// INTERFACE: IPROMOTIONREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de promoções.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF09: Aplicação de descontos e promoções em vendas
// ============================================================================

import { Promotion, DiscountType } from '../entities/Promotion';

/**
 * Filtros para busca de promoções
 */
export interface PromotionFilters {
  /** Filtrar por status ativo/inativo */
  isActive?: boolean;
  /** Filtrar por produto específico */
  productId?: string;
  /** Filtrar por categoria */
  categoryId?: string;
  /** Filtrar por tipo de desconto */
  discountType?: DiscountType;
  /** Filtrar apenas promoções válidas (dentro do período) */
  validOnly?: boolean;
  /** Busca textual por nome/descrição */
  search?: string;
}

/**
 * Interface do repositório de Promotion - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de promoções deve fornecer.
 */
export interface IPromotionRepository {
  /**
   * Cria uma nova promoção
   * @param promotion - Entidade Promotion a ser persistida
   * @returns Promise com a promoção criada (incluindo ID gerado)
   */
  create(promotion: Promotion): Promise<Promotion>;

  /**
   * Busca uma promoção pelo ID
   * @param id - Identificador único da promoção
   * @returns Promise com a promoção encontrada ou null
   */
  findById(id: string): Promise<Promotion | null>;

  /**
   * Lista todas as promoções com filtros opcionais
   * @param filters - Filtros para a busca
   * @returns Promise com array de promoções
   */
  findAll(filters?: PromotionFilters): Promise<Promotion[]>;

  /**
   * Busca promoções com paginação
   * @param page - Número da página
   * @param limit - Quantidade por página
   * @param filters - Filtros opcionais
   * @returns Promise com promoções e metadados de paginação
   */
  findPaginated(page: number, limit: number, filters?: PromotionFilters): Promise<{
    data: Promotion[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  /**
   * Busca promoções válidas (ativas e dentro do período)
   * @returns Promise com array de promoções válidas
   */
  findValid(): Promise<Promotion[]>;

  /**
   * Busca promoções aplicáveis a um produto
   * @param productId - ID do produto
   * @param categoryId - ID da categoria do produto
   * @returns Promise com array de promoções aplicáveis
   */
  findApplicableToProduct(productId: string, categoryId: string): Promise<Promotion[]>;

  /**
   * Busca promoções de uma categoria
   * @param categoryId - ID da categoria
   * @returns Promise com array de promoções
   */
  findByCategoryId(categoryId: string): Promise<Promotion[]>;

  /**
   * Busca promoções que expiram em breve
   * @param days - Número de dias para considerar
   * @returns Promise com array de promoções
   */
  findExpiringSoon(days: number): Promise<Promotion[]>;

  /**
   * Atualiza uma promoção existente
   * @param id - ID da promoção a atualizar
   * @param promotion - Dados parciais para atualização
   * @returns Promise com a promoção atualizada
   */
  update(id: string, promotion: Partial<Promotion>): Promise<Promotion>;

  /**
   * Desativa uma promoção
   * @param id - ID da promoção a desativar
   * @returns Promise com a promoção desativada
   */
  deactivate(id: string): Promise<Promotion>;

  /**
   * Ativa uma promoção
   * @param id - ID da promoção a ativar
   * @returns Promise com a promoção ativada
   */
  activate(id: string): Promise<Promotion>;

  /**
   * Remove uma promoção
   * @param id - ID da promoção a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Conta o total de promoções
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: PromotionFilters): Promise<number>;
}

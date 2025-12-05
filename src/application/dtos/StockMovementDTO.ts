// ============================================================================
// DTOs DE MOVIMENTAÇÃO DE ESTOQUE
// ============================================================================
// 
// Movimentações de estoque registram TODAS as alterações de quantidade.
// Isso cria um histórico completo e rastreável.
// 
// TIPOS DE MOVIMENTAÇÃO:
// 
// 1. ENTRY (Entrada)
//    - Compra de fornecedor
//    - Recebimento de mercadoria
// 
// 2. EXIT (Saída)
//    - Venda ao cliente
//    - Uso interno
// 
// 3. ADJUSTMENT (Ajuste)
//    - Correção após inventário
//    - Acerto de quantidade
// 
// 4. RETURN (Devolução)
//    - Cliente devolveu produto
//    - Cancelamento de venda
// 
// 5. LOSS (Perda)
//    - Produto vencido
//    - Produto danificado
//    - Furto/extravio
// 
// CONCEITO: Auditoria
// Cada movimentação é um registro permanente. Não pode ser editada.
// Isso permite auditoria e rastreabilidade completa.
// 
// ============================================================================

import { MovementType } from '../../domain/entities/StockMovement';

/**
 * DTO para criação de movimentação de estoque
 * 
 * @description
 * Registra uma alteração de quantidade no estoque.
 * A quantidade do produto é atualizada automaticamente.
 * 
 * @example
 * ```typescript
 * // Entrada de mercadoria (compra)
 * const dto: CreateStockMovementDTO = {
 *   productId: 'uuid-do-produto',
 *   type: MovementType.ENTRY,
 *   quantity: 50,
 *   reason: 'Compra - Nota Fiscal 12345',
 *   unitPrice: 5.50
 * };
 * 
 * // Perda por vencimento
 * const dto: CreateStockMovementDTO = {
 *   productId: 'uuid-do-produto',
 *   type: MovementType.LOSS,
 *   quantity: 5,
 *   reason: 'Produto vencido em 01/12/2025'
 * };
 * ```
 */
export interface CreateStockMovementDTO {
  /**
   * ID do produto
   * - Obrigatório
   * - Produto deve existir e estar ativo
   */
  productId: string;

  /**
   * Tipo de movimentação
   * - Obrigatório
   * - Determina se aumenta ou diminui o estoque
   * 
   * @see MovementType
   */
  type: MovementType;

  /**
   * Quantidade movimentada
   * - Obrigatório
   * - Sempre positivo (o tipo determina o sinal)
   * 
   * IMPORTANTE: Para saídas (EXIT, LOSS), o sistema
   * verifica se há estoque suficiente.
   */
  quantity: number;

  /**
   * Motivo/justificativa da movimentação
   * - Opcional
   * - RECOMENDADO: Sempre preencher para auditoria
   * - Ex: "Compra NF 12345", "Venda #789", "Inventário mensal"
   */
  reason?: string;

  /**
   * Preço unitário (para entradas)
   * - Opcional
   * - Útil para controle de custos
   * - total = unitPrice * quantity
   */
  unitPrice?: number;
}

/**
 * DTO para filtros de busca de movimentações
 * 
 * @example
 * ```typescript
 * // Todas as saídas do último mês
 * const filters: StockMovementFiltersDTO = {
 *   type: MovementType.EXIT,
 *   startDate: new Date('2025-11-01'),
 *   endDate: new Date('2025-11-30')
 * };
 * ```
 */
export interface StockMovementFiltersDTO {
  /** Filtrar por produto */
  productId?: string;

  /** Filtrar por tipo */
  type?: MovementType;

  /** Data inicial */
  startDate?: Date;

  /** Data final */
  endDate?: Date;

  /** Página */
  page?: number;

  /** Itens por página */
  limit?: number;
}

/**
 * DTO de resposta para relatório de estoque
 * 
 * @description
 * Resume a situação atual do estoque.
 * Útil para dashboard/painel gerencial.
 */
export interface StockReportDTO {
  /** Total de produtos ativos cadastrados */
  totalProducts: number;

  /** Quantidade de produtos com estoque baixo */
  lowStockProducts: number;

  /** Valor total do estoque (soma de preço * quantidade) */
  totalValue: number;

  /** Últimas 10 movimentações */
  recentMovements: any[];
}

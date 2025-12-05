// ============================================================================
// DTOs DE VENDA
// ============================================================================
// 
// Venda é a operação principal do sistema comercial.
// Uma venda pode ter múltiplos itens e diferentes formas de pagamento.
// 
// FLUXO DE UMA VENDA:
// 
// 1. CRIAÇÃO
//    - Cliente (opcional) é identificado
//    - Itens são adicionados (produto + quantidade)
//    - Descontos são aplicados
//    - Forma de pagamento é escolhida
// 
// 2. PROCESSAMENTO
//    - Valida estoque de cada item
//    - Calcula totais
//    - Baixa estoque (cria movimentação EXIT)
//    - Se fiado, atualiza débito do cliente
// 
// 3. FINALIZAÇÃO
//    - Venda é registrada
//    - Pode gerar cupom/comprovante
// 
// FORMAS DE PAGAMENTO:
// - CASH: Dinheiro (liquidação imediata)
// - CARD: Cartão débito/crédito
// - PIX: Pagamento instantâneo
// - FIADO: Crédito do cliente (fica devendo)
// 
// ============================================================================

import { PaymentMethod } from '../../domain/entities/Sale';

/**
 * DTO para um item da venda
 * 
 * @description
 * Representa um produto dentro da venda com sua quantidade.
 * O preço vem do cadastro do produto (não é informado aqui).
 * 
 * @example
 * ```typescript
 * const item: SaleItemDTO = {
 *   productId: 'uuid-refrigerante',
 *   quantity: 2,
 *   discount: 0.50  // R$ 0,50 de desconto
 * };
 * ```
 */
export interface SaleItemDTO {
  /**
   * ID do produto
   * - Obrigatório
   * - Produto deve existir e estar ativo
   * - Deve ter estoque suficiente
   */
  productId: string;

  /**
   * Quantidade a ser vendida
   * - Obrigatório
   * - Deve ser maior que zero
   * - Não pode exceder estoque disponível
   */
  quantity: number;

  /**
   * Desconto no item (em reais)
   * - Opcional (padrão: 0)
   * - Aplicado sobre o total do item (preço * quantidade)
   */
  discount?: number;
}

/**
 * DTO para criação de venda
 * 
 * @description
 * Contém todos os dados para registrar uma nova venda.
 * 
 * IMPORTANTE: Vendas fiado (FIADO) exigem cliente cadastrado!
 * 
 * @example
 * ```typescript
 * // Venda simples em dinheiro
 * const dto: CreateSaleDTO = {
 *   userId: 'uuid-operador-caixa',
 *   items: [
 *     { productId: 'uuid-produto-1', quantity: 2 },
 *     { productId: 'uuid-produto-2', quantity: 1 }
 *   ],
 *   paymentMethod: PaymentMethod.CASH
 * };
 * 
 * // Venda fiado para cliente
 * const dto: CreateSaleDTO = {
 *   clientId: 'uuid-cliente',
 *   userId: 'uuid-operador',
 *   items: [{ productId: 'uuid-produto', quantity: 1 }],
 *   paymentMethod: PaymentMethod.FIADO,
 *   notes: 'Cliente prometeu pagar dia 10'
 * };
 * ```
 */
export interface CreateSaleDTO {
  /**
   * ID do cliente
   * - Opcional para vendas à vista
   * - OBRIGATÓRIO para vendas fiado
   */
  clientId?: string;

  /**
   * ID do usuário (operador de caixa)
   * - Obrigatório
   * - Registra quem fez a venda (auditoria)
   */
  userId: string;

  /**
   * Itens da venda
   * - Obrigatório
   * - Pelo menos 1 item
   */
  items: SaleItemDTO[];

  /**
   * Desconto geral da venda (em reais)
   * - Opcional
   * - Aplicado sobre o total da venda
   * 
   * NOTA: Gerentes podem ter limite de desconto maior.
   */
  discount?: number;

  /**
   * Forma de pagamento
   * - Obrigatório
   * @see PaymentMethod
   */
  paymentMethod: PaymentMethod;

  /**
   * Observações da venda
   * - Opcional
   * - Ex: "Cliente vai buscar amanhã", "Falta troco"
   */
  notes?: string;
}

/**
 * DTO para filtros de busca de vendas
 */
export interface SaleFiltersDTO {
  /** Filtrar por cliente */
  clientId?: string;

  /** Filtrar por operador */
  userId?: string;

  /** Filtrar por forma de pagamento */
  paymentMethod?: PaymentMethod;

  /** Filtrar por status (PAID, PENDING, CANCELLED) */
  paymentStatus?: string;

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
 * DTO de resposta para resumo de vendas
 * 
 * @description
 * Resume as vendas de um período para relatórios.
 */
export interface SalesSummaryDTO {
  /** Total de vendas no período */
  totalSales: number;

  /** Valor total vendido */
  totalAmount: number;

  /** Total de descontos concedidos */
  totalDiscount: number;

  /** Quantidade de vendas canceladas */
  cancelledSales: number;

  /** Vendas por forma de pagamento */
  byPaymentMethod: {
    method: PaymentMethod;
    count: number;
    total: number;
  }[];
}

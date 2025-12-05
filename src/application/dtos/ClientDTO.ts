// ============================================================================
// DTOs DE CLIENTE
// ============================================================================
// 
// Clientes são as pessoas que compram no supermercado.
// O cadastro de cliente é opcional para vendas à vista,
// mas OBRIGATÓRIO para vendas fiado (crédito).
// 
// SISTEMA DE FIADO (CRÉDITO DO CLIENTE):
// 
// 1. Cliente tem um limite de crédito (creditLimit)
// 2. Cliente tem um débito atual (currentDebt)
// 3. Regra: currentDebt não pode ultrapassar creditLimit
// 4. Cliente paga as dívidas e débito diminui
// 
// EXEMPLO:
// - Limite: R$ 500,00
// - Débito atual: R$ 200,00
// - Pode comprar mais R$ 300,00 no fiado
// 
// ============================================================================

/**
 * DTO para criação de cliente
 * 
 * @description
 * Define os dados para cadastrar um novo cliente.
 * Dados como CPF e email são opcionais mas importantes
 * para identificação e comunicação.
 * 
 * @example
 * ```typescript
 * const dto: CreateClientDTO = {
 *   name: 'Maria da Silva',
 *   cpf: '123.456.789-00',
 *   phone: '(11) 98765-4321',
 *   creditLimit: 500.00
 * };
 * ```
 */
export interface CreateClientDTO {
  /**
   * Nome completo do cliente
   * - Obrigatório
   * - Usado para identificação
   */
  name: string;

  /**
   * CPF do cliente
   * - Opcional
   * - Deve ser único se informado
   * - Formato: XXX.XXX.XXX-XX
   * 
   * NOTA: Em produção, validar com algoritmo do CPF.
   */
  cpf?: string;

  /**
   * Email do cliente
   * - Opcional
   * - Deve ser único se informado
   * - Pode ser usado para enviar cupons/promoções
   */
  email?: string;

  /**
   * Telefone de contato
   * - Opcional
   * - Útil para avisar sobre promoções ou cobranças
   */
  phone?: string;

  /**
   * Endereço do cliente
   * - Opcional
   * - Pode ser usado para entregas
   */
  address?: string;

  /**
   * Limite de crédito para compras fiado
   * - Opcional (padrão: R$ 0,00)
   * - R$ 0,00 significa que não pode comprar fiado
   * 
   * REGRA DE NEGÓCIO:
   * Apenas clientes com limite > 0 podem fazer compras fiado.
   * O gerente define o limite baseado na confiança no cliente.
   */
  creditLimit?: number;
}

/**
 * DTO para atualização de cliente
 * 
 * @description
 * Permite atualizar dados cadastrais e limite de crédito.
 * 
 * NOTA: O campo currentDebt (débito atual) NÃO pode ser
 * alterado diretamente. Ele muda automaticamente com vendas/pagamentos.
 */
export interface UpdateClientDTO {
  /** Novo nome */
  name?: string;

  /** Novo CPF (deve ser único) */
  cpf?: string;

  /** Novo email (deve ser único) */
  email?: string;

  /** Novo telefone */
  phone?: string;

  /** Novo endereço */
  address?: string;

  /** Novo limite de crédito */
  creditLimit?: number;
}

/**
 * DTO para filtros de listagem de clientes
 */
export interface ClientFiltersDTO {
  /** Busca por nome, CPF, email ou telefone */
  search?: string;

  /** Filtrar apenas clientes com débitos pendentes */
  hasDebt?: boolean;

  /** Filtrar por status ativo/inativo */
  isActive?: boolean;

  /** Página */
  page?: number;

  /** Itens por página */
  limit?: number;
}

/**
 * DTO para relatório de débitos
 */
export interface DebtReportDTO {
  /** Total de clientes com débitos */
  clientsWithDebt: number;

  /** Soma total dos débitos */
  totalDebt: number;

  /** Lista de clientes devedores */
  clients: Array<{
    id: string;
    name: string;
    currentDebt: number;
    creditLimit: number;
  }>;
}

// ============================================================================
// DTOs DE FORNECEDOR
// ============================================================================
// 
// Fornecedores são as empresas que vendem produtos para o supermercado.
// Gerenciar fornecedores é importante para:
// - Saber de onde vem cada produto
// - Fazer pedidos de compra
// - Rastrear problemas de qualidade
// 
// ============================================================================

/**
 * DTO para criação de um novo fornecedor
 * 
 * @description
 * Define os dados para cadastrar um fornecedor.
 * Apenas o nome é obrigatório - outros dados podem ser
 * adicionados posteriormente.
 * 
 * @example
 * ```typescript
 * const dto: CreateSupplierDTO = {
 *   name: 'Coca-Cola FEMSA',
 *   email: 'pedidos@coca-cola.com.br',
 *   phone: '(11) 3333-4444',
 *   cnpj: '12.345.678/0001-99',
 *   address: 'Av. Industrial, 1000 - São Paulo/SP'
 * };
 * ```
 */
export interface CreateSupplierDTO {
  /**
   * Nome/Razão social do fornecedor
   * - Obrigatório
   * - Ex: "Ambev S/A", "Nestlé Brasil Ltda"
   */
  name: string;

  /**
   * Email para contato/pedidos
   * - Opcional
   * - Deve ser um email válido se fornecido
   * - Deve ser único no sistema
   */
  email?: string;

  /**
   * Telefone de contato
   * - Opcional
   * - Formato livre (pode incluir DDD, extensão, etc)
   */
  phone?: string;

  /**
   * Endereço completo
   * - Opcional
   * - Útil para logística de entregas
   */
  address?: string;

  /**
   * CNPJ do fornecedor
   * - Opcional
   * - Formato: XX.XXX.XXX/XXXX-XX
   * - Deve ser único no sistema
   * 
   * NOTA: Em um sistema real, você validaria o CNPJ
   * usando o algoritmo oficial da Receita Federal.
   */
  cnpj?: string;
}

/**
 * DTO para atualização de fornecedor existente
 * 
 * @description
 * Permite atualização parcial dos dados do fornecedor.
 * 
 * @example
 * ```typescript
 * // Apenas atualizar telefone
 * const dto: UpdateSupplierDTO = {
 *   phone: '(11) 99999-8888'
 * };
 * ```
 */
export interface UpdateSupplierDTO {
  /** Novo nome do fornecedor */
  name?: string;

  /** Novo email de contato */
  email?: string;

  /** Novo telefone */
  phone?: string;

  /** Novo endereço */
  address?: string;

  /** Novo CNPJ */
  cnpj?: string;
}

/**
 * DTO para filtros de listagem de fornecedores
 */
export interface SupplierFiltersDTO {
  /** Busca por nome, email ou CNPJ */
  search?: string;

  /** Número da página */
  page?: number;

  /** Itens por página */
  limit?: number;
}

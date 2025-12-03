// ============================================================================
// INTERFACE: ICLIENTREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de clientes.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF10: Cadastro de clientes
// - RF11: Registro de vendas fiadas
// - RF12: Consulta de débitos
// ============================================================================

import { Client } from '../entities/Client';

/**
 * Filtros para busca de clientes
 */
export interface ClientFilters {
  /** Filtrar por status ativo/inativo */
  isActive?: boolean;
  /** Filtrar apenas clientes com débitos */
  hasDebt?: boolean;
  /** Busca textual por nome/email/CPF */
  search?: string;
}

/**
 * Interface do repositório de Client - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de clientes deve fornecer.
 */
export interface IClientRepository {
  /**
   * Cria um novo cliente
   * @param client - Entidade Client a ser persistida
   * @returns Promise com o cliente criado (incluindo ID gerado)
   */
  create(client: Client): Promise<Client>;

  /**
   * Busca um cliente pelo ID
   * @param id - Identificador único do cliente
   * @returns Promise com o cliente encontrado ou null
   */
  findById(id: string): Promise<Client | null>;

  /**
   * Busca um cliente pelo CPF
   * @param cpf - CPF do cliente
   * @returns Promise com o cliente encontrado ou null
   */
  findByCpf(cpf: string): Promise<Client | null>;

  /**
   * Busca um cliente pelo email
   * @param email - Email do cliente
   * @returns Promise com o cliente encontrado ou null
   */
  findByEmail(email: string): Promise<Client | null>;

  /**
   * Lista todos os clientes
   * @param filters - Filtros opcionais
   * @returns Promise com array de clientes
   */
  findAll(filters?: ClientFilters): Promise<Client[]>;

  /**
   * Busca clientes com débitos (RF12)
   * @returns Promise com array de clientes devedores
   */
  findWithDebts(): Promise<Client[]>;

  /**
   * Atualiza um cliente existente
   * @param id - ID do cliente a atualizar
   * @param client - Dados parciais para atualização
   * @returns Promise com o cliente atualizado
   */
  update(id: string, client: Partial<Client>): Promise<Client>;

  /**
   * Atualiza o saldo de débito do cliente
   * @param id - ID do cliente
   * @param amount - Novo valor de débito
   * @returns Promise void
   */
  updateDebt(id: string, amount: number): Promise<void>;

  /**
   * Remove um cliente (soft delete)
   * @param id - ID do cliente a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Conta o total de clientes
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: ClientFilters): Promise<number>;

  /**
   * Calcula o total de débitos de todos os clientes
   * @returns Promise com o valor total de débitos
   */
  getTotalDebts(): Promise<number>;

  /**
   * Verifica se um CPF já está em uso
   * @param cpf - CPF a verificar
   * @param excludeId - ID do cliente a excluir da verificação
   * @returns Promise boolean
   */
  cpfExists(cpf: string, excludeId?: string): Promise<boolean>;
}

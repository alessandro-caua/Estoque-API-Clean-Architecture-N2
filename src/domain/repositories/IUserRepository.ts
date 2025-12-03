// ============================================================================
// INTERFACE: IUSERREPOSITORY
// ============================================================================
// Define o contrato para operações de persistência de usuários.
// Segue o princípio de Inversão de Dependência (SOLID).
// 
// Requisitos atendidos:
// - RF20: Cadastro de usuários
// - RF21: Controle de acesso por perfis
// - RF22: Autenticação
// ============================================================================

import { User, UserRole } from '../entities/User';

/**
 * Filtros para busca de usuários
 */
export interface UserFilters {
  /** Filtrar por papel/role */
  role?: UserRole;
  /** Filtrar por status ativo/inativo */
  isActive?: boolean;
  /** Busca textual por nome/email */
  search?: string;
}

/**
 * Interface do repositório de User - Camada de Domínio
 * @description Define os métodos que qualquer implementação de repositório
 *              de usuários deve fornecer.
 */
export interface IUserRepository {
  /**
   * Cria um novo usuário
   * @param user - Entidade User a ser persistida
   * @returns Promise com o usuário criado (incluindo ID gerado)
   */
  create(user: User): Promise<User>;

  /**
   * Busca um usuário pelo ID
   * @param id - Identificador único do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário pelo email
   * @param email - Email do usuário
   * @returns Promise com o usuário encontrado ou null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Lista todos os usuários
   * @param filters - Filtros opcionais
   * @returns Promise com array de usuários
   */
  findAll(filters?: UserFilters): Promise<User[]>;

  /**
   * Atualiza um usuário existente
   * @param id - ID do usuário a atualizar
   * @param user - Dados parciais para atualização
   * @returns Promise com o usuário atualizado
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Remove um usuário (soft delete)
   * @param id - ID do usuário a remover
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Conta o total de usuários
   * @param filters - Filtros opcionais
   * @returns Promise com a quantidade total
   */
  count(filters?: UserFilters): Promise<number>;

  /**
   * Verifica se um email já está em uso
   * @param email - Email a verificar
   * @param excludeId - ID do usuário a excluir da verificação (para update)
   * @returns Promise boolean
   */
  emailExists(email: string, excludeId?: string): Promise<boolean>;
}

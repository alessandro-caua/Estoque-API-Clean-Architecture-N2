// ============================================================================
// DTOs DE USUÁRIO
// ============================================================================
// 
// Usuários são as pessoas que operam o sistema.
// Cada usuário tem um perfil (role) que define suas permissões.
// 
// PERFIS DE ACESSO (UserRole):
// 
// 1. ADMIN (Administrador)
//    - Acesso total ao sistema
//    - Pode criar outros usuários
//    - Pode ver relatórios financeiros
// 
// 2. GERENTE (Gerente)
//    - Gerencia estoque e produtos
//    - Acessa relatórios de vendas
//    - Pode dar descontos
// 
// 3. CAIXA (Operador de Caixa)
//    - Registra vendas
//    - Consulta produtos
//    - Acesso limitado
// 
// SEGURANÇA:
// - Senha deve ter mínimo 6 caracteres
// - Em produção, usar hash (bcrypt) para armazenar senhas
// - NUNCA armazenar senha em texto puro
// 
// ============================================================================

import { UserRole } from '../../domain/entities/User';

/**
 * DTO para criação de usuário
 * 
 * @description
 * Define os dados para cadastrar um novo usuário.
 * Apenas administradores podem criar usuários.
 * 
 * @example
 * ```typescript
 * const dto: CreateUserDTO = {
 *   name: 'João Silva',
 *   email: 'joao@supermercado.com',
 *   password: 'senha123',
 *   role: UserRole.CAIXA
 * };
 * ```
 */
export interface CreateUserDTO {
  /**
   * Nome completo do usuário
   * - Obrigatório
   * - Exibido na interface do sistema
   */
  name: string;

  /**
   * Email para login
   * - Obrigatório
   * - Deve ser único no sistema
   * - Usado como identificador de login
   */
  email: string;

  /**
   * Senha de acesso
   * - Obrigatório
   * - Mínimo 6 caracteres
   * 
   * SEGURANÇA: Em um sistema real, a senha seria
   * hasheada antes de salvar no banco.
   */
  password: string;

  /**
   * Perfil de acesso
   * - Opcional (padrão: CAIXA)
   * - Define as permissões do usuário
   */
  role?: UserRole;
}

/**
 * DTO para atualização de usuário
 * 
 * @description
 * Permite atualizar dados do usuário.
 * NOTA: Senha tem DTO separado por segurança.
 */
export interface UpdateUserDTO {
  /** Novo nome */
  name?: string;

  /** Novo email (deve ser único) */
  email?: string;

  /** Novo perfil */
  role?: UserRole;
}

/**
 * DTO para login (autenticação)
 * 
 * @description
 * Dados necessários para fazer login no sistema.
 * 
 * @example
 * ```typescript
 * const dto: LoginDTO = {
 *   email: 'joao@supermercado.com',
 *   password: 'senha123'
 * };
 * ```
 */
export interface LoginDTO {
  /** Email cadastrado */
  email: string;

  /** Senha do usuário */
  password: string;
}

/**
 * DTO para alteração de senha
 * 
 * @description
 * Separado do UpdateUserDTO por segurança.
 * Exige a senha atual para validação.
 * 
 * @example
 * ```typescript
 * const dto: ChangePasswordDTO = {
 *   userId: 'uuid-do-usuario',
 *   currentPassword: 'senhaAtual123',
 *   newPassword: 'novaSenha456'
 * };
 * ```
 */
export interface ChangePasswordDTO {
  /** ID do usuário */
  userId: string;

  /** Senha atual (para validação) */
  currentPassword: string;

  /** Nova senha (mínimo 6 caracteres) */
  newPassword: string;
}

/**
 * DTO para filtros de listagem de usuários
 */
export interface UserFiltersDTO {
  /** Busca por nome ou email */
  search?: string;

  /** Filtrar por perfil */
  role?: UserRole;

  /** Filtrar por status ativo/inativo */
  isActive?: boolean;

  /** Página */
  page?: number;

  /** Itens por página */
  limit?: number;
}

// ============================================================================
// ROTAS DE USUÁRIOS - CAMADA DE APRESENTAÇÃO
// ============================================================================
// Define todas as rotas relacionadas ao gerenciamento de usuários do sistema.
// Implementa endpoints para CRUD, autenticação e alteração de senha.
//
// Endpoints disponíveis:
// - POST   /users           - Criar novo usuário
// - GET    /users           - Listar usuários
// - GET    /users/:id       - Buscar usuário por ID
// - PUT    /users/:id       - Atualizar usuário
// - DELETE /users/:id       - Excluir usuário
// - POST   /users/login     - Autenticar usuário
// - PATCH  /users/:id/password - Alterar senha
// ============================================================================

import { Router } from 'express';
import { UserController } from '../controllers/UserController';

/**
 * Cria e configura as rotas do módulo de usuários.
 * 
 * @param {UserController} controller - Instância do controller de usuários
 * @returns {Router} Router do Express configurado
 * 
 * @example
 * const userController = new UserController(...);
 * const userRoutes = createUserRoutes(userController);
 * app.use('/api/users', userRoutes);
 */
export const createUserRoutes = (controller: UserController): Router => {
  const router = Router();

  // ============================================================================
  // ROTAS DE AUTENTICAÇÃO (devem vir antes das rotas com parâmetros)
  // ============================================================================

  /**
   * @route POST /users/login
   * @description Autentica um usuário no sistema
   * @body { email: string, password: string }
   * @returns { success: boolean, data: { user: User, token?: string } }
   */
  router.post('/login', (req, res) => controller.login(req, res));

  // ============================================================================
  // ROTAS DE CRUD BÁSICO
  // ============================================================================

  /**
   * @route POST /users
   * @description Cria um novo usuário no sistema
   * @body { name: string, email: string, password: string, role: UserRole }
   * @returns { success: boolean, data: User }
   */
  router.post('/', (req, res) => controller.create(req, res));

  /**
   * @route GET /users
   * @description Lista todos os usuários com filtros
   * @query role - Filtrar por cargo
   * @query isActive - Filtrar por status ativo (true/false)
   * @query search - Buscar por nome ou email
   * @returns { success: boolean, data: User[] }
   */
  router.get('/', (req, res) => controller.findAll(req, res));

  /**
   * @route GET /users/:id
   * @description Busca um usuário específico pelo ID
   * @param id - ID do usuário
   * @returns { success: boolean, data: User }
   */
  router.get('/:id', (req, res) => controller.findById(req, res));

  /**
   * @route PUT /users/:id
   * @description Atualiza os dados de um usuário
   * @param id - ID do usuário
   * @body { name?: string, email?: string, role?: UserRole, isActive?: boolean }
   * @returns { success: boolean, data: User }
   */
  router.put('/:id', (req, res) => controller.update(req, res));

  /**
   * @route DELETE /users/:id
   * @description Remove um usuário do sistema (soft delete)
   * @param id - ID do usuário
   * @returns { status: 204 }
   */
  router.delete('/:id', (req, res) => controller.delete(req, res));

  // ============================================================================
  // ROTAS DE ALTERAÇÃO DE SENHA
  // ============================================================================

  /**
   * @route PATCH /users/:id/password
   * @description Altera a senha de um usuário
   * @param id - ID do usuário
   * @body { currentPassword: string, newPassword: string }
   * @returns { success: boolean, message: string }
   */
  router.patch('/:id/password', (req, res) => controller.changePassword(req, res));

  return router;
};

// ============================================================================
// ROTAS DE CLIENTES - CAMADA DE APRESENTAÇÃO
// ============================================================================
// Define todas as rotas relacionadas ao gerenciamento de clientes.
// Implementa endpoints para CRUD e consulta de devedores.
//
// Endpoints disponíveis:
// - POST   /clients           - Criar novo cliente
// - GET    /clients           - Listar clientes (paginado)
// - GET    /clients/debtors   - Listar clientes devedores
// - GET    /clients/:id       - Buscar cliente por ID
// - PUT    /clients/:id       - Atualizar cliente
// - DELETE /clients/:id       - Excluir cliente
// ============================================================================

import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';

/**
 * Cria e configura as rotas do módulo de clientes.
 * 
 * @param {ClientController} controller - Instância do controller de clientes
 * @returns {Router} Router do Express configurado
 * 
 * @example
 * const clientController = new ClientController(...);
 * const clientRoutes = createClientRoutes(clientController);
 * app.use('/api/clients', clientRoutes);
 */
export const createClientRoutes = (controller: ClientController): Router => {
  const router = Router();

  // ============================================================================
  // ROTAS ESPECIAIS (devem vir antes das rotas com parâmetros :id)
  // ============================================================================

  /**
   * @route GET /clients/debtors
   * @description Lista clientes com débito em aberto (fiado)
   * @returns { count: number, totalDebt: number, clients: Client[] }
   */
  router.get('/debtors', (req, res) => controller.findDebtors(req, res));

  // ============================================================================
  // ROTAS DE CRUD BÁSICO
  // ============================================================================

  /**
   * @route POST /clients
   * @description Cadastra um novo cliente no sistema
   * @body { name: string, cpf?: string, phone?: string, email?: string, address?: string, creditLimit?: number }
   * @returns { success: boolean, data: Client }
   */
  router.post('/', (req, res) => controller.create(req, res));

  /**
   * @route GET /clients
   * @description Lista todos os clientes com paginação e filtros
   * @query page - Número da página (default: 1)
   * @query limit - Itens por página (default: 20)
   * @query isActive - Filtrar por status ativo
   * @query hasDebt - Filtrar clientes com débito
   * @query search - Termo de busca (nome, CPF)
   * @returns { data: Client[], pagination: {...} }
   */
  router.get('/', (req, res) => controller.findAll(req, res));

  /**
   * @route GET /clients/:id
   * @description Busca um cliente específico pelo ID
   * @param id - ID do cliente
   * @returns { success: boolean, data: Client }
   */
  router.get('/:id', (req, res) => controller.findById(req, res));

  /**
   * @route PUT /clients/:id
   * @description Atualiza os dados de um cliente
   * @param id - ID do cliente
   * @body { name?: string, cpf?: string, phone?: string, email?: string, address?: string, creditLimit?: number }
   * @returns { success: boolean, data: Client }
   */
  router.put('/:id', (req, res) => controller.update(req, res));

  /**
   * @route DELETE /clients/:id
   * @description Remove um cliente do sistema (soft delete)
   * @param id - ID do cliente
   * @returns { status: 204 }
   */
  router.delete('/:id', (req, res) => controller.delete(req, res));

  return router;
};

// ============================================================================
// ROTAS FINANCEIRAS - CAMADA DE APRESENTAÇÃO
// ============================================================================
// Define todas as rotas relacionadas ao módulo financeiro.
// Implementa endpoints para contas a pagar/receber e resumo financeiro.
//
// Endpoints disponíveis:
// - POST   /financial/accounts       - Criar conta a pagar/receber
// - GET    /financial/accounts       - Listar contas (paginado)
// - GET    /financial/accounts/overdue - Listar contas vencidas
// - GET    /financial/accounts/:id   - Buscar conta por ID
// - POST   /financial/accounts/:id/pay - Registrar pagamento
// - POST   /financial/accounts/:id/cancel - Cancelar conta
// - GET    /financial/summary        - Resumo financeiro
// ============================================================================

import { Router } from 'express';
import { FinancialController } from '../controllers/FinancialController';

/**
 * Cria e configura as rotas do módulo financeiro.
 * 
 * @param {FinancialController} controller - Instância do controller financeiro
 * @returns {Router} Router do Express configurado
 * 
 * @example
 * const financialController = new FinancialController(...);
 * const financialRoutes = createFinancialRoutes(financialController);
 * app.use('/api/financial', financialRoutes);
 */
export const createFinancialRoutes = (controller: FinancialController): Router => {
  const router = Router();

  // ============================================================================
  // ROTAS ESPECIAIS (devem vir antes das rotas com parâmetros :id)
  // ============================================================================

  /**
   * @route GET /financial/accounts/overdue
   * @description Lista contas vencidas (a pagar e a receber)
   * @returns { count: number, accounts: FinancialAccount[] }
   */
  router.get('/accounts/overdue', (req, res) => controller.findOverdueAccounts(req, res));

  /**
   * @route GET /financial/summary
   * @description Retorna um resumo financeiro por período
   * @query startDate - Data inicial (YYYY-MM-DD) - obrigatório
   * @query endDate - Data final (YYYY-MM-DD) - obrigatório
   * @returns { summary: FinancialSummary }
   */
  router.get('/summary', (req, res) => controller.getSummary(req, res));

  // ============================================================================
  // ROTAS DE CONTAS A PAGAR/RECEBER
  // ============================================================================

  /**
   * @route POST /financial/accounts
   * @description Cria uma nova conta a pagar ou receber
   * @body { 
   *   type: 'PAYABLE' | 'RECEIVABLE',
   *   description: string,
   *   amount: number,
   *   dueDate: string (YYYY-MM-DD),
   *   category?: string,
   *   referenceId?: string,
   *   notes?: string
   * }
   * @returns { success: boolean, data: FinancialAccount }
   */
  router.post('/accounts', (req, res) => controller.createAccount(req, res));

  /**
   * @route GET /financial/accounts
   * @description Lista todas as contas com paginação e filtros
   * @query page - Número da página (default: 1)
   * @query limit - Itens por página (default: 20)
   * @query type - Tipo da conta (PAYABLE, RECEIVABLE)
   * @query status - Status (PENDING, PAID, OVERDUE, CANCELLED)
   * @query category - Categoria da conta
   * @query startDate - Data inicial do vencimento
   * @query endDate - Data final do vencimento
   * @returns { data: FinancialAccount[], pagination: {...} }
   */
  router.get('/accounts', (req, res) => controller.findAllAccounts(req, res));

  /**
   * @route GET /financial/accounts/:id
   * @description Busca uma conta específica pelo ID
   * @param id - ID da conta
   * @returns { success: boolean, data: FinancialAccount }
   */
  router.get('/accounts/:id', (req, res) => controller.findAccountById(req, res));

  /**
   * @route POST /financial/accounts/:id/pay
   * @description Registra o pagamento de uma conta
   * @param id - ID da conta
   * @body { amount?: number, paidDate?: string }
   * @returns { message: string, account: FinancialAccount }
   */
  router.post('/accounts/:id/pay', (req, res) => controller.payAccount(req, res));

  /**
   * @route POST /financial/accounts/:id/cancel
   * @description Cancela uma conta
   * @param id - ID da conta
   * @returns { message: string, account: FinancialAccount }
   */
  router.post('/accounts/:id/cancel', (req, res) => controller.cancelAccount(req, res));

  return router;
};

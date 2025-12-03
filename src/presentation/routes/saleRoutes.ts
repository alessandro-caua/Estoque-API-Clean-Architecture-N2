// ============================================================================
// ROTAS DE VENDAS - CAMADA DE APRESENTAÇÃO
// ============================================================================
// Define todas as rotas relacionadas ao módulo de vendas (PDV).
// Implementa endpoints para registro de vendas, consultas e relatórios.
//
// Endpoints disponíveis:
// - POST   /sales           - Registrar nova venda
// - GET    /sales           - Listar vendas (paginado)
// - GET    /sales/period    - Vendas por período
// - GET    /sales/daily     - Vendas do dia atual
// - GET    /sales/summary   - Resumo de vendas por período
// - GET    /sales/:id       - Buscar venda por ID
// - POST   /sales/:id/cancel - Cancelar venda
// ============================================================================

import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';

/**
 * Cria e configura as rotas do módulo de vendas.
 * 
 * @param {SaleController} controller - Instância do controller de vendas
 * @returns {Router} Router do Express configurado
 * 
 * @example
 * const saleController = new SaleController(...);
 * const saleRoutes = createSaleRoutes(saleController);
 * app.use('/api/sales', saleRoutes);
 */
export const createSaleRoutes = (controller: SaleController): Router => {
  const router = Router();

  // ============================================================================
  // ROTAS ESPECIAIS (devem vir antes das rotas com parâmetros :id)
  // ============================================================================

  /**
   * @route GET /sales/period
   * @description Busca vendas em um período específico
   * @query startDate - Data inicial (YYYY-MM-DD) - obrigatório
   * @query endDate - Data final (YYYY-MM-DD) - obrigatório
   * @returns { success: boolean, data: Sale[] }
   */
  router.get('/period', (req, res) => controller.findByPeriod(req, res));

  /**
   * @route GET /sales/daily
   * @description Retorna as vendas do dia atual com resumo
   * @returns { count: number, totalAmount: number, sales: Sale[] }
   */
  router.get('/daily', (req, res) => controller.getDailyReport(req, res));

  /**
   * @route GET /sales/summary
   * @description Retorna o resumo de vendas por período
   * @query startDate - Data inicial (YYYY-MM-DD) - obrigatório
   * @query endDate - Data final (YYYY-MM-DD) - obrigatório
   * @returns { summary: SalesSummary }
   */
  router.get('/summary', (req, res) => controller.getSummary(req, res));

  // ============================================================================
  // ROTAS DE CRUD BÁSICO
  // ============================================================================

  /**
   * @route POST /sales
   * @description Registra uma nova venda no sistema
   * @body { 
   *   clientId?: string, 
   *   userId: string,
   *   items: [{ productId: string, quantity: number, unitPrice?: number }],
   *   paymentMethod: PaymentMethod,
   *   discount?: number,
   *   notes?: string
   * }
   * @returns { success: boolean, data: Sale }
   */
  router.post('/', (req, res) => controller.create(req, res));

  /**
   * @route GET /sales
   * @description Lista todas as vendas com paginação e filtros
   * @query page - Número da página (default: 1)
   * @query limit - Itens por página (default: 20)
   * @query clientId - Filtrar por cliente
   * @query userId - Filtrar por vendedor
   * @query paymentMethod - Filtrar por forma de pagamento
   * @query paymentStatus - Filtrar por status de pagamento
   * @query startDate - Data inicial
   * @query endDate - Data final
   * @returns { data: Sale[], pagination: {...} }
   */
  router.get('/', (req, res) => controller.findAll(req, res));

  /**
   * @route GET /sales/:id
   * @description Busca uma venda específica pelo ID
   * @param id - ID da venda
   * @returns { success: boolean, data: Sale }
   */
  router.get('/:id', (req, res) => controller.findById(req, res));

  // ============================================================================
  // ROTAS DE OPERAÇÕES
  // ============================================================================

  /**
   * @route POST /sales/:id/cancel
   * @description Cancela uma venda
   * @param id - ID da venda
   * @body { reason?: string }
   * @returns { message: string, sale: Sale }
   */
  router.post('/:id/cancel', (req, res) => controller.cancel(req, res));

  return router;
};

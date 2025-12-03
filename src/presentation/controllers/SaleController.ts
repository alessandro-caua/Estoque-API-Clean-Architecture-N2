// ============================================================================
// CONTROLLER: SALE (VENDA)
// ============================================================================
// Controller para gerenciamento de vendas.
// Camada de Apresentação - Recebe requisições HTTP e retorna respostas.
// ============================================================================

import { Request, Response } from 'express';
import {
  CreateSaleUseCase,
  GetSaleByIdUseCase,
  GetPaginatedSalesUseCase,
  CancelSaleUseCase,
  GetTodaySalesUseCase,
  GetSalesSummaryUseCase,
  GetSalesByDateRangeUseCase,
} from '../../application/use-cases/SaleUseCases';
import { Sale, PaymentMethod, PaymentStatus } from '../../domain/entities/Sale';

/**
 * Controller de Vendas
 * @description Gerencia requisições HTTP relacionadas a vendas
 */
export class SaleController {
  constructor(
    private createSaleUseCase: CreateSaleUseCase,
    private getSaleByIdUseCase: GetSaleByIdUseCase,
    private getPaginatedSalesUseCase: GetPaginatedSalesUseCase,
    private cancelSaleUseCase: CancelSaleUseCase,
    private getTodaySalesUseCase: GetTodaySalesUseCase,
    private getSalesSummaryUseCase: GetSalesSummaryUseCase,
    private getSalesByDateRangeUseCase: GetSalesByDateRangeUseCase
  ) {}

  /**
   * Cria uma nova venda
   * POST /sales
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { clientId, userId, items, discount, paymentMethod, notes } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'ID do usuário é obrigatório',
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'Itens da venda são obrigatórios',
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          error: 'Forma de pagamento é obrigatória',
        });
      }

      const sale = await this.createSaleUseCase.execute({
        clientId,
        userId,
        items,
        discount,
        paymentMethod,
        notes,
      });

      return res.status(201).json(sale.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Busca uma venda pelo ID
   * GET /sales/:id
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const sale = await this.getSaleByIdUseCase.execute(id);

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      return res.json(sale.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista todas as vendas
   * GET /sales
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { clientId, userId, paymentMethod, paymentStatus, startDate, endDate } = req.query;

      const sales = await this.getPaginatedSalesUseCase.execute({
        clientId: clientId as string,
        userId: userId as string,
        paymentMethod: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
        paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      return res.json({
        count: sales.length,
        sales: sales.map((sale: Sale) => sale.toJSON()),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Busca vendas por período
   * GET /sales/period
   */
  async findByPeriod(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Data inicial e final são obrigatórias',
        });
      }

      const sales = await this.getSalesByDateRangeUseCase.execute(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      return res.json(sales.map((sale: Sale) => sale.toJSON()));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Retorna relatório de vendas do dia
   * GET /sales/daily-report
   */
  async getDailyReport(req: Request, res: Response): Promise<Response> {
    try {
      const sales = await this.getTodaySalesUseCase.execute();

      const summary = {
        count: sales.length,
        totalAmount: sales.reduce((sum: number, sale: Sale) => sum + sale.total, 0),
        sales: sales.map((sale: Sale) => sale.toJSON()),
      };

      return res.json(summary);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Retorna resumo de vendas por período
   * GET /sales/summary
   */
  async getSummary(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Data inicial e final são obrigatórias',
        });
      }

      const summary = await this.getSalesSummaryUseCase.execute(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      return res.json(summary);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Cancela uma venda
   * POST /sales/:id/cancel
   */
  async cancel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const sale = await this.cancelSaleUseCase.execute(id);

      return res.json({
        message: 'Venda cancelada com sucesso',
        sale: sale.toJSON(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }
}

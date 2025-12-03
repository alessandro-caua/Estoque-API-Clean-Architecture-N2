// Controller de StockMovement - Camada de Apresentação
import { Request, Response } from 'express';
import { MovementType } from '../../domain/entities/StockMovement';
import {
  CreateStockEntryUseCase,
  GetStockMovementByIdUseCase,
  GetAllStockMovementsUseCase,
  GetStockMovementsByProductUseCase,
  GetStockMovementsByTypeUseCase,
  GetStockMovementsByDateRangeUseCase,
  GetStockReportUseCase,
} from '../../application/use-cases/StockMovementUseCases';

export class StockMovementController {
  constructor(
    private createStockEntryUseCase: CreateStockEntryUseCase,
    private getStockMovementByIdUseCase: GetStockMovementByIdUseCase,
    private getAllStockMovementsUseCase: GetAllStockMovementsUseCase,
    private getStockMovementsByProductUseCase: GetStockMovementsByProductUseCase,
    private getStockMovementsByTypeUseCase: GetStockMovementsByTypeUseCase,
    private getStockMovementsByDateRangeUseCase: GetStockMovementsByDateRangeUseCase,
    private getStockReportUseCase: GetStockReportUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { productId, type, quantity, reason, unitPrice } = req.body;

      if (!productId || !type || !quantity) {
        return res.status(400).json({
          error: 'Produto, tipo e quantidade são obrigatórios',
        });
      }

      const validTypes = ['ENTRY', 'EXIT', 'ADJUSTMENT', 'LOSS', 'RETURN'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: `Tipo inválido. Tipos válidos: ${validTypes.join(', ')}`,
        });
      }

      const movement = await this.createStockEntryUseCase.execute({
        productId,
        type: type as MovementType,
        quantity,
        reason,
        unitPrice,
      });

      return res.status(201).json(movement.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const movement = await this.getStockMovementByIdUseCase.execute(id);

      if (!movement) {
        return res.status(404).json({ error: 'Movimentação não encontrada' });
      }

      return res.json(movement.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { productId, type, startDate, endDate } = req.query;

      const movements = await this.getAllStockMovementsUseCase.execute({
        productId: productId as string,
        type: type as MovementType,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      return res.json(movements.map((m) => m.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { productId } = req.params;

      const movements = await this.getStockMovementsByProductUseCase.execute(productId);

      return res.json(movements.map((m) => m.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByType(req: Request, res: Response): Promise<Response> {
    try {
      const { type } = req.params;

      const validTypes = ['ENTRY', 'EXIT', 'ADJUSTMENT', 'LOSS', 'RETURN'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: `Tipo inválido. Tipos válidos: ${validTypes.join(', ')}`,
        });
      }

      const movements = await this.getStockMovementsByTypeUseCase.execute(
        type as MovementType
      );

      return res.json(movements.map((m) => m.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByDateRange(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Data inicial e final são obrigatórias',
        });
      }

      const movements = await this.getStockMovementsByDateRangeUseCase.execute(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      return res.json(movements.map((m) => m.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getReport(req: Request, res: Response): Promise<Response> {
    try {
      const report = await this.getStockReportUseCase.execute();

      return res.json({
        totalProducts: report.totalProducts,
        lowStockProducts: report.lowStockProducts,
        totalValue: report.totalValue,
        recentMovements: report.recentMovements.map((m) => m.toJSON()),
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

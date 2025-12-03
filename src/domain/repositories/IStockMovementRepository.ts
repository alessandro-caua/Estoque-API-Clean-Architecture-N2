// Interface do repositório de StockMovement - Camada de Domínio
import { StockMovement, MovementType } from '../entities/StockMovement';

export interface StockMovementFilters {
  productId?: string;
  type?: MovementType;
  startDate?: Date;
  endDate?: Date;
}

export interface IStockMovementRepository {
  create(movement: StockMovement): Promise<StockMovement>;
  findById(id: string): Promise<StockMovement | null>;
  findAll(filters?: StockMovementFilters): Promise<StockMovement[]>;
  findByProductId(productId: string): Promise<StockMovement[]>;
  findByType(type: MovementType): Promise<StockMovement[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]>;
  delete(id: string): Promise<void>;
}

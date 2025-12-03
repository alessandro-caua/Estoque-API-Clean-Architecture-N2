// Use Cases de StockMovement - Camada de Aplicação
import { StockMovement, MovementType } from '../../domain/entities/StockMovement';
import { IStockMovementRepository, StockMovementFilters } from '../../domain/repositories/IStockMovementRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

// DTOs
export interface CreateStockMovementDTO {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  unitPrice?: number;
}

// Create Stock Movement Use Case (Entry)
export class CreateStockEntryUseCase {
  constructor(
    private stockMovementRepository: IStockMovementRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(data: CreateStockMovementDTO): Promise<StockMovement> {
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    const totalPrice = data.unitPrice ? data.unitPrice * data.quantity : null;

    const movement = new StockMovement({
      productId: data.productId,
      type: data.type,
      quantity: data.quantity,
      reason: data.reason,
      unitPrice: data.unitPrice,
      totalPrice,
    });

    // Atualizar quantidade do produto baseado no tipo de movimento
    let newQuantity = product.quantity;
    
    if (data.type === MovementType.ENTRY || data.type === MovementType.RETURN) {
      newQuantity = product.quantity + data.quantity;
    } else if (data.type === MovementType.EXIT || data.type === MovementType.LOSS) {
      if (product.quantity < data.quantity) {
        throw new Error('Quantidade insuficiente em estoque');
      }
      newQuantity = product.quantity - data.quantity;
    } else if (data.type === MovementType.ADJUSTMENT) {
      newQuantity = data.quantity; // Ajuste define a quantidade diretamente
    }

    await this.productRepository.updateQuantity(data.productId, newQuantity);
    
    return this.stockMovementRepository.create(movement);
  }
}

// Get Stock Movement By Id Use Case
export class GetStockMovementByIdUseCase {
  constructor(private stockMovementRepository: IStockMovementRepository) {}

  async execute(id: string): Promise<StockMovement | null> {
    return this.stockMovementRepository.findById(id);
  }
}

// Get All Stock Movements Use Case
export class GetAllStockMovementsUseCase {
  constructor(private stockMovementRepository: IStockMovementRepository) {}

  async execute(filters?: StockMovementFilters): Promise<StockMovement[]> {
    return this.stockMovementRepository.findAll(filters);
  }
}

// Get Stock Movements By Product Use Case
export class GetStockMovementsByProductUseCase {
  constructor(private stockMovementRepository: IStockMovementRepository) {}

  async execute(productId: string): Promise<StockMovement[]> {
    return this.stockMovementRepository.findByProductId(productId);
  }
}

// Get Stock Movements By Type Use Case
export class GetStockMovementsByTypeUseCase {
  constructor(private stockMovementRepository: IStockMovementRepository) {}

  async execute(type: MovementType): Promise<StockMovement[]> {
    return this.stockMovementRepository.findByType(type);
  }
}

// Get Stock Movements By Date Range Use Case
export class GetStockMovementsByDateRangeUseCase {
  constructor(private stockMovementRepository: IStockMovementRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<StockMovement[]> {
    return this.stockMovementRepository.findByDateRange(startDate, endDate);
  }
}

// Get Stock Report Use Case
export class GetStockReportUseCase {
  constructor(
    private stockMovementRepository: IStockMovementRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(): Promise<{
    totalProducts: number;
    lowStockProducts: number;
    totalValue: number;
    recentMovements: StockMovement[];
  }> {
    const [products, lowStockProducts, movements] = await Promise.all([
      this.productRepository.findAll({ isActive: true }),
      this.productRepository.findLowStock(),
      this.stockMovementRepository.findAll(),
    ]);

    const totalValue = products.reduce((sum, product) => {
      return sum + (product.salePrice * product.quantity);
    }, 0);

    // Pegar os 10 movimentos mais recentes
    const recentMovements = movements
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() ?? 0;
        const dateB = b.createdAt?.getTime() ?? 0;
        return dateB - dateA;
      })
      .slice(0, 10);

    return {
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      totalValue,
      recentMovements,
    };
  }
}

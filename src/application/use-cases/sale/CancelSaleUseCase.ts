// ============================================================================
// USE CASE: CANCELAR VENDA
// ============================================================================
// 
// Cancelar uma venda envolve reverter todas as operações:
// - Estornar estoque (devolver as quantidades)
// - Estornar débito do cliente (se era fiado)
// - Registrar movimentações de devolução
// 
// ============================================================================

import { Sale, PaymentMethod, PaymentStatus } from '../../../domain/entities/Sale';
import { StockMovement, MovementType } from '../../../domain/entities/StockMovement';
import { 
  ISaleRepository, 
  IProductRepository, 
  IClientRepository,
  IStockMovementRepository 
} from '../../../domain/ports';
import { 
  EntityNotFoundError,
  InvalidEntityStateError 
} from '../../../domain/errors';

/**
 * Use Case: Cancelar uma venda
 * 
 * @description
 * Cancela a venda e reverte todas as operações:
 * - Devolve estoque
 * - Estorna débito do cliente (se fiado)
 * - Registra movimentações de devolução
 */
export class CancelSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
    private stockMovementRepository: IStockMovementRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(saleId: string): Promise<Sale> {
    // =========================================================================
    // PASSO 1: Buscar e validar a venda
    // =========================================================================
    const sale = await this.saleRepository.findById(saleId);
    
    if (!sale) {
      throw new EntityNotFoundError('Venda', saleId);
    }

    // Não pode cancelar venda já cancelada
    if (sale.paymentStatus === PaymentStatus.CANCELLED) {
      throw new InvalidEntityStateError(
        'Venda',
        'cancelar',
        'A venda já está cancelada'
      );
    }

    // =========================================================================
    // PASSO 2: Estornar estoque de cada item
    // =========================================================================
    for (const item of sale.items) {
      const product = await this.productRepository.findById(item.productId);
      
      if (product) {
        // Devolver a quantidade ao estoque
        const newQuantity = product.quantity + item.quantity;
        await this.productRepository.updateQuantity(item.productId, newQuantity);

        // Registrar movimentação de devolução
        const movement = new StockMovement({
          productId: item.productId,
          type: MovementType.RETURN,
          quantity: item.quantity,
          reason: `Cancelamento da venda #${sale.id}`,
          unitPrice: item.unitPrice,
          totalPrice: item.total,
        });
        
        await this.stockMovementRepository.create(movement);
      }
    }

    // =========================================================================
    // PASSO 3: Estornar débito do cliente (se era fiado)
    // =========================================================================
    if (sale.clientId && sale.paymentMethod === PaymentMethod.FIADO) {
      const client = await this.clientRepository.findById(sale.clientId);
      
      if (client) {
        // Subtrai o valor da venda do débito
        // Math.max evita débito negativo
        const newDebt = Math.max(0, client.currentDebt - sale.total);
        await this.clientRepository.updateDebt(sale.clientId, newDebt);
      }
    }

    // =========================================================================
    // PASSO 4: Marcar venda como cancelada
    // =========================================================================
    return this.saleRepository.cancel(saleId);
  }
}

// ============================================================================
// USE CASE: CRIAR VENDA
// ============================================================================
// 
// Este é um dos Use Cases mais complexos do sistema.
// Uma venda envolve múltiplas operações atômicas.
// 
// FLUXO COMPLETO:
// 1. Validar cliente (se fiado)
// 2. Validar cada produto (existência, estoque, status)
// 3. Calcular totais
// 4. Criar a venda
// 5. Baixar estoque de cada item
// 6. Atualizar débito do cliente (se fiado)
// 
// CONCEITO: Transação
// ====================
// Idealmente, todas essas operações deveriam ser uma transação.
// Se qualquer passo falhar, tudo deve ser desfeito (rollback).
// 
// ============================================================================

import { Sale, PaymentMethod, PaymentStatus } from '../../../domain/entities/Sale';
import { SaleItem } from '../../../domain/entities/SaleItem';
import { StockMovement, MovementType } from '../../../domain/entities/StockMovement';
import { 
  ISaleRepository, 
  IProductRepository, 
  IClientRepository,
  IStockMovementRepository 
} from '../../../domain/ports';
import { CreateSaleDTO } from '../../dtos';
import { 
  EntityNotFoundError,
  InsufficientStockError,
  InactiveProductError,
  CreditLimitExceededError 
} from '../../../domain/errors';

/**
 * Use Case: Criar uma nova venda
 * 
 * @description
 * Registra uma venda no sistema, baixa estoque automaticamente
 * e atualiza débitos do cliente quando for venda fiado.
 * 
 * @example
 * ```typescript
 * const useCase = new CreateSaleUseCase(
 *   saleRepository,
 *   productRepository,
 *   clientRepository,
 *   stockMovementRepository
 * );
 * 
 * const sale = await useCase.execute({
 *   userId: 'uuid-operador',
 *   items: [
 *     { productId: 'uuid-produto-1', quantity: 2 },
 *     { productId: 'uuid-produto-2', quantity: 1 }
 *   ],
 *   paymentMethod: PaymentMethod.PIX
 * });
 * ```
 */
export class CreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
    private clientRepository: IClientRepository,
    private stockMovementRepository: IStockMovementRepository
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    // =========================================================================
    // PASSO 1: Validar cliente (obrigatório para fiado)
    // =========================================================================
    let client = null;
    
    if (data.clientId) {
      client = await this.clientRepository.findById(data.clientId);
      if (!client) {
        throw new EntityNotFoundError('Cliente', data.clientId);
      }
    }

    // Se for fiado, cliente é obrigatório
    if (data.paymentMethod === PaymentMethod.FIADO && !client) {
      throw new Error('Venda fiado requer cliente cadastrado');
    }

    // =========================================================================
    // PASSO 2: Validar produtos e calcular totais
    // =========================================================================
    const saleItems: SaleItem[] = [];
    let subtotal = 0;

    for (const itemData of data.items) {
      // Buscar produto
      const product = await this.productRepository.findById(itemData.productId);
      
      if (!product) {
        throw new EntityNotFoundError('Produto', itemData.productId);
      }

      // Verificar se está ativo
      if (!product.isActive) {
        throw new InactiveProductError(product.name);
      }

      // Verificar estoque
      if (product.quantity < itemData.quantity) {
        throw new InsufficientStockError(
          product.name,
          product.quantity,
          itemData.quantity
        );
      }

      // Calcular total do item
      const itemDiscount = itemData.discount ?? 0;
      const itemTotal = (product.salePrice * itemData.quantity) - itemDiscount;
      subtotal += itemTotal;

      // Criar item da venda
      saleItems.push(new SaleItem({
        productId: itemData.productId,
        productName: product.name,
        quantity: itemData.quantity,
        unitPrice: product.salePrice,
        discount: itemDiscount,
        total: itemTotal,
      }));
    }

    // =========================================================================
    // PASSO 3: Calcular total final
    // =========================================================================
    const saleDiscount = data.discount ?? 0;
    const totalAmount = subtotal - saleDiscount;

    // =========================================================================
    // PASSO 4: Verificar limite de crédito (se fiado)
    // =========================================================================
    if (data.paymentMethod === PaymentMethod.FIADO && client) {
      const newDebt = client.currentDebt + totalAmount;
      
      if (newDebt > client.creditLimit) {
        throw new CreditLimitExceededError(
          client.name,
          client.creditLimit,
          newDebt
        );
      }
    }

    // =========================================================================
    // PASSO 5: Definir status de pagamento
    // =========================================================================
    // Fiado = pendente de pagamento
    // Outros = pago imediatamente
    const paymentStatus = data.paymentMethod === PaymentMethod.FIADO
      ? PaymentStatus.PENDING
      : PaymentStatus.PAID;

    // =========================================================================
    // PASSO 6: Criar a entidade Venda
    // =========================================================================
    const sale = new Sale({
      clientId: data.clientId,
      userId: data.userId,
      subtotal,
      discount: saleDiscount,
      total: totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      notes: data.notes,
      items: saleItems,
    });

    // =========================================================================
    // PASSO 7: Salvar a venda
    // =========================================================================
    const createdSale = await this.saleRepository.create(sale);

    // =========================================================================
    // PASSO 8: Baixar estoque e registrar movimentações
    // =========================================================================
    for (const item of saleItems) {
      const product = await this.productRepository.findById(item.productId);
      
      if (product) {
        // Baixar quantidade
        const newQuantity = product.quantity - item.quantity;
        await this.productRepository.updateQuantity(item.productId, newQuantity);

        // Registrar movimentação de saída (para histórico)
        const movement = new StockMovement({
          productId: item.productId,
          type: MovementType.EXIT,
          quantity: item.quantity,
          reason: `Venda #${createdSale.id}`,
          unitPrice: item.unitPrice,
          totalPrice: item.total,
        });
        
        await this.stockMovementRepository.create(movement);
      }
    }

    // =========================================================================
    // PASSO 9: Atualizar débito do cliente (se fiado)
    // =========================================================================
    if (data.paymentMethod === PaymentMethod.FIADO && data.clientId && client) {
      const newDebt = client.currentDebt + totalAmount;
      await this.clientRepository.updateDebt(data.clientId, newDebt);
    }

    return createdSale;
  }
}

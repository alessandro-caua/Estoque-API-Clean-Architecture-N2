// ============================================================================
// USE CASES: SALE (VENDA)
// ============================================================================
// Casos de uso para operações com vendas.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// Requisitos atendidos:
// - RF06: Registro de vendas
// - RF07: Baixa automática no estoque
// - RF08: Histórico de movimentações
// - RF09: Emissão de comprovantes
// ============================================================================

import { Sale, PaymentMethod, PaymentStatus } from '../../domain/entities/Sale';
import { SaleItem } from '../../domain/entities/SaleItem';
import { StockMovement, MovementType } from '../../domain/entities/StockMovement';
import { ISaleRepository, SaleFilters, SalesSummary } from '../../domain/repositories/ISaleRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { IStockMovementRepository } from '../../domain/repositories/IStockMovementRepository';

// ==================== DTOs ====================

/**
 * DTO para item da venda
 */
export interface SaleItemDTO {
  productId: string;
  quantity: number;
  discount?: number;
}

/**
 * DTO para criação de venda
 */
export interface CreateSaleDTO {
  clientId?: string;
  userId: string;
  items: SaleItemDTO[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Venda
 */
export class CreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
    private clientRepository: IClientRepository,
    private stockMovementRepository: IStockMovementRepository
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    // Validar cliente se informado
    if (data.clientId) {
      const client = await this.clientRepository.findById(data.clientId);
      if (!client) {
        throw new Error('Cliente não encontrado');
      }
    }

    // Validar produtos e montar itens da venda
    const saleItems: SaleItem[] = [];
    let subtotal = 0;

    for (const itemData of data.items) {
      const product = await this.productRepository.findById(itemData.productId);
      if (!product) {
        throw new Error(`Produto não encontrado: ${itemData.productId}`);
      }
      if (!product.isActive) {
        throw new Error(`Produto inativo: ${product.name}`);
      }
      if (product.quantity < itemData.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
      }

      const itemTotal = (product.salePrice * itemData.quantity) - (itemData.discount ?? 0);
      subtotal += itemTotal;

      saleItems.push(new SaleItem({
        productId: itemData.productId,
        productName: product.name,
        quantity: itemData.quantity,
        unitPrice: product.salePrice,
        discount: itemData.discount ?? 0,
        total: itemTotal,
      }));
    }

    // Calcular total
    const totalDiscount = data.discount ?? 0;
    const totalAmount = subtotal - totalDiscount;

    // Definir status de pagamento
    const paymentStatus = data.paymentMethod === PaymentMethod.FIADO
      ? PaymentStatus.PENDING
      : PaymentStatus.PAID;

    // Criar a venda
    const sale = new Sale({
      clientId: data.clientId,
      userId: data.userId,
      subtotal,
      discount: totalDiscount,
      total: totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      notes: data.notes,
      items: saleItems,
    });

    const createdSale = await this.saleRepository.create(sale);

    // Baixar estoque e registrar movimentações
    for (const item of saleItems) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        const newQuantity = product.quantity - item.quantity;
        await this.productRepository.updateQuantity(item.productId, newQuantity);

        // Criar movimentação de saída
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

    // Atualizar débito do cliente se for fiado
    if (data.paymentMethod === PaymentMethod.FIADO && data.clientId) {
      const client = await this.clientRepository.findById(data.clientId);
      if (client) {
        const newDebt = client.currentDebt + totalAmount;
        await this.clientRepository.updateDebt(data.clientId, newDebt);
      }
    }

    return createdSale;
  }
}

/**
 * Caso de Uso: Buscar Venda por ID
 */
export class GetSaleByIdUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(id: string): Promise<Sale | null> {
    return this.saleRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Vendas com Filtros
 */
export class GetPaginatedSalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(filters?: SaleFilters): Promise<Sale[]> {
    return this.saleRepository.findAll(filters);
  }
}

/**
 * Caso de Uso: Cancelar Venda
 */
export class CancelSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
    private stockMovementRepository: IStockMovementRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(saleId: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new Error('Venda não encontrada');
    }

    if (sale.paymentStatus === PaymentStatus.CANCELLED) {
      throw new Error('Venda já foi cancelada');
    }

    // Estornar estoque
    for (const item of sale.items) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        const newQuantity = product.quantity + item.quantity;
        await this.productRepository.updateQuantity(item.productId, newQuantity);

        // Criar movimentação de entrada (estorno)
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

    // Estornar débito do cliente se for fiado
    if (sale.clientId && sale.paymentMethod === PaymentMethod.FIADO) {
      const client = await this.clientRepository.findById(sale.clientId);
      if (client) {
        const newDebt = Math.max(0, client.currentDebt - sale.total);
        await this.clientRepository.updateDebt(sale.clientId, newDebt);
      }
    }

    // Cancelar a venda
    return this.saleRepository.cancel(saleId);
  }
}

/**
 * Caso de Uso: Vendas do Dia
 */
export class GetTodaySalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(): Promise<Sale[]> {
    return this.saleRepository.findToday();
  }
}

/**
 * Caso de Uso: Resumo de Vendas
 */
export class GetSalesSummaryUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<SalesSummary> {
    return this.saleRepository.getSummary(startDate, endDate);
  }
}

/**
 * Caso de Uso: Vendas por Período
 */
export class GetSalesByDateRangeUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.saleRepository.findByPeriod(startDate, endDate);
  }
}

/**
 * Caso de Uso: Vendas de um Cliente
 */
export class GetSalesByClientUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(clientId: string): Promise<Sale[]> {
    return this.saleRepository.findByClient(clientId);
  }
}

/**
 * Caso de Uso: Vendas Pendentes de um Cliente
 */
export class GetPendingSalesByClientUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(clientId: string): Promise<Sale[]> {
    return this.saleRepository.findPendingByClient(clientId);
  }
}

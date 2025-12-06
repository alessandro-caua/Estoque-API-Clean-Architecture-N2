/**
 * EVENT HANDLERS - Handlers de exemplo
 * 
 * Handlers que reagem aos eventos de domínio.
 */

import { IEventHandler } from './IEventDispatcher';
import { DomainEvent } from '../../domain/events/DomainEvent';
import {
  ProductCreatedEvent,
  LowStockDetectedEvent,
  SaleCreatedEvent,
  StockMovementRegisteredEvent,
} from '../../domain/events';
import { logger } from '../logging/logger';

/**
 * Handler: Log de produto criado
 */
export class LogProductCreatedHandler implements IEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof ProductCreatedEvent) {
      logger.info('📦 Produto criado', {
        productId: event.aggregateId,
        productName: event.productName,
        salePrice: event.salePrice,
      });
    }
  }
}

/**
 * Handler: Alerta de estoque baixo
 */
export class LowStockAlertHandler implements IEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof LowStockDetectedEvent) {
      logger.warn('⚠️  ALERTA: Estoque Baixo!', {
        productId: event.aggregateId,
        productName: event.productName,
        currentQuantity: event.currentQuantity,
        minQuantity: event.minQuantity,
      });

      // Aqui você poderia enviar email, SMS, notificação push, etc.
      // Por enquanto apenas loga
    }
  }
}

/**
 * Handler: Log de venda criada
 */
export class LogSaleCreatedHandler implements IEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof SaleCreatedEvent) {
      logger.info('💰 Venda criada', {
        saleId: event.aggregateId,
        total: event.total,
        paymentMethod: event.paymentMethod,
        itemCount: event.itemCount,
      });
    }
  }
}

/**
 * Handler: Log de movimentação de estoque
 */
export class LogStockMovementHandler implements IEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof StockMovementRegisteredEvent) {
      const emoji = event.type === 'ENTRY' ? '📥' : '📤';
      logger.info(`${emoji} Movimentação de estoque`, {
        movementId: event.aggregateId,
        productId: event.productId,
        type: event.type,
        quantity: event.quantity,
      });
    }
  }
}

/**
 * Handler: Atualizar estatísticas (exemplo)
 */
export class UpdateStatisticsHandler implements IEventHandler {
  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof SaleCreatedEvent) {
      // Aqui você poderia atualizar um cache de estatísticas
      // ou enviar para um serviço de analytics
      logger.debug('Atualizando estatísticas de venda');
    }
  }
}

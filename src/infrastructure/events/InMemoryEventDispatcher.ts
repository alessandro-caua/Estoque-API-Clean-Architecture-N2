/**
 * EVENT DISPATCHER - Implementação In-Memory
 * 
 * Implementação simples de dispatcher de eventos em memória.
 * Para produção, considere usar message broker (RabbitMQ, Kafka, etc.)
 */

import { DomainEvent } from '../../domain/events/DomainEvent';
import { IEventDispatcher, IEventHandler } from './IEventDispatcher';
import { logger, logDomainEvent } from '../logging/logger';
import { injectable } from 'tsyringe';

@injectable()
export class InMemoryEventDispatcher implements IEventDispatcher {
  private handlers: Map<string, IEventHandler[]> = new Map();

  /**
   * Registra um handler para um evento
   */
  register(eventName: string, handler: IEventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
    
    logger.debug(`Event handler registered for: ${eventName}`);
  }

  /**
   * Dispara um evento
   */
  async dispatch(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName();
    const handlers = this.handlers.get(eventName) || [];

    if (handlers.length === 0) {
      logger.debug(`No handlers registered for event: ${eventName}`);
      return;
    }

    // Log do evento
    logDomainEvent(eventName, event.getData());

    // Executa todos os handlers
    const promises = handlers.map(handler => {
      try {
        return Promise.resolve(handler.handle(event));
      } catch (error) {
        logger.error(`Error handling event ${eventName}`, { error });
        return Promise.resolve(); // Não quebra se um handler falhar
      }
    });

    await Promise.all(promises);
  }

  /**
   * Dispara múltiplos eventos
   */
  async dispatchAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }

  /**
   * Remove todos os handlers (útil para testes)
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Retorna quantidade de handlers registrados
   */
  getHandlerCount(eventName: string): number {
    return this.handlers.get(eventName)?.length || 0;
  }
}

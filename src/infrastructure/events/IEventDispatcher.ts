/**
 * EVENT DISPATCHER - Interface
 * 
 * Define o contrato para disparo de eventos de domínio.
 */

import { DomainEvent } from '../../domain/events/DomainEvent';

export interface IEventHandler {
  handle(event: DomainEvent): Promise<void> | void;
}

export interface IEventDispatcher {
  /**
   * Registra um handler para um evento específico
   */
  register(eventName: string, handler: IEventHandler): void;

  /**
   * Dispara um evento para todos os handlers registrados
   */
  dispatch(event: DomainEvent): Promise<void>;

  /**
   * Dispara múltiplos eventos
   */
  dispatchAll(events: DomainEvent[]): Promise<void>;
}

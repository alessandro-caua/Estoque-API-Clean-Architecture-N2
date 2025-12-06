/**
 * DOMAIN EVENT - Base
 * 
 * Classe base para todos os eventos de domínio.
 * Permite comunicação desacoplada entre módulos.
 */

export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }

  /**
   * Retorna o nome do evento (ex: "product.created")
   */
  abstract getEventName(): string;

  /**
   * Retorna os dados do evento para serialização
   */
  abstract getData(): Record<string, any>;
}

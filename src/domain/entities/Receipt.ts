// ============================================================================
// ENTIDADE: RECEIPT (COMPROVANTE/RECIBO)
// ============================================================================
// Representa um comprovante de venda emitido após uma transação.
// Pode ser cupom fiscal, nota fiscal ou recibo simples.
// 
// Requisitos atendidos:
// - RF09: Emissão de comprovante de venda
// ============================================================================

import { Sale } from './Sale';

/**
 * Tipos de comprovante
 */
export enum ReceiptType {
  /** Cupom fiscal (ECF) */
  FISCAL_COUPON = 'FISCAL_COUPON',
  /** Nota Fiscal de Consumidor Eletrônica */
  NFCE = 'NFCE',
  /** Nota Fiscal Eletrônica */
  NFE = 'NFE',
  /** Recibo simples (não fiscal) */
  SIMPLE_RECEIPT = 'SIMPLE_RECEIPT',
}

/**
 * Status do comprovante
 */
export enum ReceiptStatus {
  /** Comprovante emitido com sucesso */
  ISSUED = 'ISSUED',
  /** Comprovante cancelado */
  CANCELLED = 'CANCELLED',
  /** Pendente de emissão */
  PENDING = 'PENDING',
  /** Erro na emissão */
  ERROR = 'ERROR',
}

/**
 * Interface de propriedades do comprovante
 * @description Define a estrutura de dados para criar/atualizar um comprovante
 */
export interface ReceiptProps {
  /** Identificador único do comprovante (UUID) */
  id?: string;
  /** ID da venda */
  saleId: string;
  /** Tipo do comprovante */
  type: ReceiptType;
  /** Número do comprovante */
  receiptNumber: string;
  /** Status do comprovante */
  status?: ReceiptStatus;
  /** Conteúdo ou dados do comprovante (JSON) */
  content?: string | null;
  /** Chave de acesso (para NF-e/NFC-e) */
  accessKey?: string | null;
  /** URL de consulta do comprovante */
  consultUrl?: string | null;
  /** Data/hora de emissão */
  issuedAt?: Date;
  /** Data/hora de cancelamento */
  cancelledAt?: Date | null;
  /** Motivo do cancelamento */
  cancellationReason?: string | null;
  /** Data de criação do registro */
  createdAt?: Date;
  /** Objeto da venda (para relacionamentos) */
  sale?: Sale;
}

/**
 * Entidade Receipt - Camada de Domínio
 * @description Representa um comprovante de venda com suas regras de negócio.
 *              Comprovantes são emitidos após a conclusão de uma venda
 *              e servem como prova da transação.
 * @example
 * ```typescript
 * const receipt = new Receipt({
 *   saleId: 'venda-uuid',
 *   type: ReceiptType.NFCE,
 *   receiptNumber: '000000001',
 *   accessKey: '35240112345678000190650010000000011234567890'
 * });
 * ```
 */
export class Receipt {
  private _id?: string;
  private _saleId: string;
  private _type: ReceiptType;
  private _receiptNumber: string;
  private _status: ReceiptStatus;
  private _content?: string | null;
  private _accessKey?: string | null;
  private _consultUrl?: string | null;
  private _issuedAt?: Date;
  private _cancelledAt?: Date | null;
  private _cancellationReason?: string | null;
  private _createdAt?: Date;
  private _sale?: Sale;

  /**
   * Construtor da entidade Receipt
   * @param props - Propriedades iniciais do comprovante
   * @throws Error se os dados não passarem na validação
   */
  constructor(props: ReceiptProps) {
    this._id = props.id;
    this._saleId = props.saleId;
    this._type = props.type;
    this._receiptNumber = props.receiptNumber;
    this._status = props.status ?? ReceiptStatus.PENDING;
    this._content = props.content;
    this._accessKey = props.accessKey;
    this._consultUrl = props.consultUrl;
    this._issuedAt = props.issuedAt;
    this._cancelledAt = props.cancelledAt;
    this._cancellationReason = props.cancellationReason;
    this._createdAt = props.createdAt;
    this._sale = props.sale;

    this.validate();
  }

  // ==================== VALIDAÇÕES ====================

  /**
   * Valida os dados do comprovante
   * @private
   * @throws Error se algum dado for inválido
   */
  private validate(): void {
    if (!this._saleId) {
      throw new Error('Venda é obrigatória para emitir um comprovante');
    }

    if (!this._receiptNumber || this._receiptNumber.trim().length === 0) {
      throw new Error('Número do comprovante é obrigatório');
    }

    if (!Object.values(ReceiptType).includes(this._type)) {
      throw new Error('Tipo de comprovante inválido');
    }

    // Valida chave de acesso para NF-e/NFC-e
    if (this.requiresAccessKey() && this._status === ReceiptStatus.ISSUED) {
      if (!this._accessKey || this._accessKey.length !== 44) {
        throw new Error('Chave de acesso é obrigatória para NF-e/NFC-e e deve ter 44 caracteres');
      }
    }
  }

  /**
   * Verifica se o tipo de comprovante requer chave de acesso
   * @private
   */
  private requiresAccessKey(): boolean {
    return this._type === ReceiptType.NFE || this._type === ReceiptType.NFCE;
  }

  // ==================== GETTERS ====================

  /**
   * Identificador único do comprovante
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * ID da venda
   */
  get saleId(): string {
    return this._saleId;
  }

  /**
   * Tipo do comprovante
   */
  get type(): ReceiptType {
    return this._type;
  }

  /**
   * Número do comprovante
   */
  get receiptNumber(): string {
    return this._receiptNumber;
  }

  /**
   * Status do comprovante
   */
  get status(): ReceiptStatus {
    return this._status;
  }

  /**
   * Conteúdo do comprovante
   */
  get content(): string | null | undefined {
    return this._content;
  }

  /**
   * Chave de acesso (NF-e/NFC-e)
   */
  get accessKey(): string | null | undefined {
    return this._accessKey;
  }

  /**
   * URL de consulta
   */
  get consultUrl(): string | null | undefined {
    return this._consultUrl;
  }

  /**
   * Data/hora de emissão
   */
  get issuedAt(): Date | undefined {
    return this._issuedAt;
  }

  /**
   * Data/hora de cancelamento
   */
  get cancelledAt(): Date | null | undefined {
    return this._cancelledAt;
  }

  /**
   * Motivo do cancelamento
   */
  get cancellationReason(): string | null | undefined {
    return this._cancellationReason;
  }

  /**
   * Data de criação
   */
  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  /**
   * Objeto da venda
   */
  get sale(): Sale | undefined {
    return this._sale;
  }

  // ==================== SETTERS ====================

  /**
   * Define o conteúdo do comprovante
   * @param value - Conteúdo em formato JSON
   */
  set content(value: string | null | undefined) {
    this._content = value;
  }

  /**
   * Define a chave de acesso
   * @param value - Chave de acesso (44 caracteres)
   */
  set accessKey(value: string | null | undefined) {
    this._accessKey = value;
  }

  /**
   * Define a URL de consulta
   * @param value - URL de consulta
   */
  set consultUrl(value: string | null | undefined) {
    this._consultUrl = value;
  }

  // ==================== MÉTODOS DE NEGÓCIO ====================

  /**
   * Marca o comprovante como emitido
   * @throws Error se já estiver emitido ou cancelado
   */
  markAsIssued(): void {
    if (this._status === ReceiptStatus.ISSUED) {
      throw new Error('Comprovante já foi emitido');
    }
    if (this._status === ReceiptStatus.CANCELLED) {
      throw new Error('Comprovante cancelado não pode ser emitido');
    }
    this._status = ReceiptStatus.ISSUED;
    this._issuedAt = new Date();
  }

  /**
   * Cancela o comprovante
   * @param reason - Motivo do cancelamento
   * @throws Error se já estiver cancelado ou não emitido
   */
  cancel(reason: string): void {
    if (this._status === ReceiptStatus.CANCELLED) {
      throw new Error('Comprovante já está cancelado');
    }
    if (this._status !== ReceiptStatus.ISSUED) {
      throw new Error('Apenas comprovantes emitidos podem ser cancelados');
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error('Motivo do cancelamento é obrigatório');
    }

    this._status = ReceiptStatus.CANCELLED;
    this._cancelledAt = new Date();
    this._cancellationReason = reason;
  }

  /**
   * Marca o comprovante como erro
   * @param errorMessage - Mensagem de erro (opcional)
   */
  markAsError(errorMessage?: string): void {
    this._status = ReceiptStatus.ERROR;
    if (errorMessage) {
      this._content = JSON.stringify({ error: errorMessage });
    }
  }

  /**
   * Verifica se é um documento fiscal
   * @returns true se for cupom fiscal, NF-e ou NFC-e
   */
  isFiscalDocument(): boolean {
    return this._type !== ReceiptType.SIMPLE_RECEIPT;
  }

  /**
   * Verifica se é um documento eletrônico
   * @returns true se for NF-e ou NFC-e
   */
  isElectronicDocument(): boolean {
    return this._type === ReceiptType.NFE || this._type === ReceiptType.NFCE;
  }

  /**
   * Verifica se está emitido
   */
  isIssued(): boolean {
    return this._status === ReceiptStatus.ISSUED;
  }

  /**
   * Verifica se está cancelado
   */
  isCancelled(): boolean {
    return this._status === ReceiptStatus.CANCELLED;
  }

  /**
   * Verifica se está pendente
   */
  isPending(): boolean {
    return this._status === ReceiptStatus.PENDING;
  }

  /**
   * Verifica se teve erro
   */
  hasError(): boolean {
    return this._status === ReceiptStatus.ERROR;
  }

  /**
   * Retorna a descrição do tipo em português
   */
  getTypeDescription(): string {
    const descriptions: Record<ReceiptType, string> = {
      [ReceiptType.FISCAL_COUPON]: 'Cupom Fiscal',
      [ReceiptType.NFCE]: 'NFC-e',
      [ReceiptType.NFE]: 'NF-e',
      [ReceiptType.SIMPLE_RECEIPT]: 'Recibo Simples',
    };
    return descriptions[this._type] || this._type;
  }

  /**
   * Retorna a descrição do status em português
   */
  getStatusDescription(): string {
    const descriptions: Record<ReceiptStatus, string> = {
      [ReceiptStatus.ISSUED]: 'Emitido',
      [ReceiptStatus.CANCELLED]: 'Cancelado',
      [ReceiptStatus.PENDING]: 'Pendente',
      [ReceiptStatus.ERROR]: 'Erro',
    };
    return descriptions[this._status] || this._status;
  }

  /**
   * Verifica se pode ser cancelado
   * @returns true se o comprovante puder ser cancelado
   */
  canBeCancelled(): boolean {
    if (this._status !== ReceiptStatus.ISSUED) return false;
    
    // Regra de negócio: NF-e/NFC-e só podem ser canceladas em até 24h
    if (this.isElectronicDocument() && this._issuedAt) {
      const hoursSinceIssued = 
        (new Date().getTime() - this._issuedAt.getTime()) / (1000 * 60 * 60);
      return hoursSinceIssued <= 24;
    }
    
    return true;
  }

  /**
   * Formata a chave de acesso para exibição
   * @returns Chave formatada em grupos de 4
   */
  getFormattedAccessKey(): string | null {
    if (!this._accessKey) return null;
    return this._accessKey.replace(/(\d{4})/g, '$1 ').trim();
  }

  /**
   * Converte a entidade para objeto JSON
   * @returns Objeto serializado com os dados do comprovante
   */
  toJSON() {
    return {
      id: this._id,
      saleId: this._saleId,
      type: this._type,
      typeDescription: this.getTypeDescription(),
      receiptNumber: this._receiptNumber,
      status: this._status,
      statusDescription: this.getStatusDescription(),
      content: this._content,
      accessKey: this._accessKey,
      accessKeyFormatted: this.getFormattedAccessKey(),
      consultUrl: this._consultUrl,
      issuedAt: this._issuedAt,
      cancelledAt: this._cancelledAt,
      cancellationReason: this._cancellationReason,
      // Campos calculados
      isFiscalDocument: this.isFiscalDocument(),
      isElectronicDocument: this.isElectronicDocument(),
      canBeCancelled: this.canBeCancelled(),
      createdAt: this._createdAt,
      sale: this._sale?.toJSON(),
    };
  }
}

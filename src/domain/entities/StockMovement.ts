// Entidade StockMovement - Camada de Domínio
import { Product } from './Product';

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  ADJUSTMENT = 'ADJUSTMENT',
  LOSS = 'LOSS',
  RETURN = 'RETURN',
}

export interface StockMovementProps {
  id?: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  createdAt?: Date;
  product?: Product;
}

export class StockMovement {
  private _id?: string;
  private _productId: string;
  private _type: MovementType;
  private _quantity: number;
  private _reason?: string | null;
  private _unitPrice?: number | null;
  private _totalPrice?: number | null;
  private _createdAt?: Date;
  private _product?: Product;

  constructor(props: StockMovementProps) {
    this._id = props.id;
    this._productId = props.productId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._reason = props.reason;
    this._unitPrice = props.unitPrice;
    this._totalPrice = props.totalPrice;
    this._createdAt = props.createdAt;
    this._product = props.product;

    this.validate();
  }

  private validate(): void {
    if (this._quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get type(): MovementType {
    return this._type;
  }

  get quantity(): number {
    return this._quantity;
  }

  get reason(): string | null | undefined {
    return this._reason;
  }

  get unitPrice(): number | null | undefined {
    return this._unitPrice;
  }

  get totalPrice(): number | null | undefined {
    return this._totalPrice;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get product(): Product | undefined {
    return this._product;
  }

  // Métodos de negócio
  isEntry(): boolean {
    return this._type === MovementType.ENTRY || this._type === MovementType.RETURN;
  }

  isExit(): boolean {
    return this._type === MovementType.EXIT || this._type === MovementType.LOSS;
  }

  getStockImpact(): number {
    if (this.isEntry()) {
      return this._quantity;
    } else if (this.isExit()) {
      return -this._quantity;
    }
    return 0; // ADJUSTMENT pode ser positivo ou negativo dependendo da implementação
  }

  toJSON() {
    return {
      id: this._id,
      productId: this._productId,
      type: this._type,
      quantity: this._quantity,
      reason: this._reason,
      unitPrice: this._unitPrice,
      totalPrice: this._totalPrice,
      createdAt: this._createdAt,
      product: this._product?.toJSON(),
    };
  }
}

// Entidade Product - Camada de Domínio
import { Category } from './Category';
import { Supplier } from './Supplier';

export interface ProductProps {
  id?: string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  price: number;
  costPrice: number;
  quantity?: number;
  minQuantity?: number;
  unit?: string;
  categoryId: string;
  supplierId?: string | null;
  isActive?: boolean;
  expirationDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  category?: Category;
  supplier?: Supplier | null;
}

export class Product {
  private _id?: string;
  private _name: string;
  private _description?: string | null;
  private _barcode?: string | null;
  private _price: number;
  private _costPrice: number;
  private _quantity: number;
  private _minQuantity: number;
  private _unit: string;
  private _categoryId: string;
  private _supplierId?: string | null;
  private _isActive: boolean;
  private _expirationDate?: Date | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _category?: Category;
  private _supplier?: Supplier | null;

  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._barcode = props.barcode;
    this._price = props.price;
    this._costPrice = props.costPrice;
    this._quantity = props.quantity ?? 0;
    this._minQuantity = props.minQuantity ?? 10;
    this._unit = props.unit ?? 'UN';
    this._categoryId = props.categoryId;
    this._supplierId = props.supplierId;
    this._isActive = props.isActive ?? true;
    this._expirationDate = props.expirationDate;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._category = props.category;
    this._supplier = props.supplier;
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null | undefined {
    return this._description;
  }

  get barcode(): string | null | undefined {
    return this._barcode;
  }

  get price(): number {
    return this._price;
  }

  get costPrice(): number {
    return this._costPrice;
  }

  get quantity(): number {
    return this._quantity;
  }

  get minQuantity(): number {
    return this._minQuantity;
  }

  get unit(): string {
    return this._unit;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get supplierId(): string | null | undefined {
    return this._supplierId;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get expirationDate(): Date | null | undefined {
    return this._expirationDate;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get category(): Category | undefined {
    return this._category;
  }

  get supplier(): Supplier | null | undefined {
    return this._supplier;
  }

  // Setters
  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Nome do produto é obrigatório');
    }
    this._name = value;
  }

  set price(value: number) {
    if (value < 0) {
      throw new Error('Preço não pode ser negativo');
    }
    this._price = value;
  }

  set costPrice(value: number) {
    if (value < 0) {
      throw new Error('Preço de custo não pode ser negativo');
    }
    this._costPrice = value;
  }

  set quantity(value: number) {
    if (value < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }
    this._quantity = value;
  }

  // Métodos de negócio
  isLowStock(): boolean {
    return this._quantity <= this._minQuantity;
  }

  isExpired(): boolean {
    if (!this._expirationDate) return false;
    return new Date() > this._expirationDate;
  }

  getProfitMargin(): number {
    if (this._costPrice === 0) return 0;
    return ((this._price - this._costPrice) / this._costPrice) * 100;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      barcode: this._barcode,
      price: this._price,
      costPrice: this._costPrice,
      quantity: this._quantity,
      minQuantity: this._minQuantity,
      unit: this._unit,
      categoryId: this._categoryId,
      supplierId: this._supplierId,
      isActive: this._isActive,
      expirationDate: this._expirationDate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      category: this._category?.toJSON(),
      supplier: this._supplier?.toJSON(),
    };
  }
}

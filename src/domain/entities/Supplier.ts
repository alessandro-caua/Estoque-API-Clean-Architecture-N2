// Entidade Supplier - Camada de Domínio
export interface SupplierProps {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  cnpj?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Supplier {
  private _id?: string;
  private _name: string;
  private _email?: string | null;
  private _phone?: string | null;
  private _address?: string | null;
  private _cnpj?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: SupplierProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._cnpj = props.cnpj;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string | null | undefined {
    return this._email;
  }

  get phone(): string | null | undefined {
    return this._phone;
  }

  get address(): string | null | undefined {
    return this._address;
  }

  get cnpj(): string | null | undefined {
    return this._cnpj;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Nome do fornecedor é obrigatório');
    }
    this._name = value;
  }

  set email(value: string | null | undefined) {
    this._email = value;
  }

  set phone(value: string | null | undefined) {
    this._phone = value;
  }

  set address(value: string | null | undefined) {
    this._address = value;
  }

  set cnpj(value: string | null | undefined) {
    this._cnpj = value;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      address: this._address,
      cnpj: this._cnpj,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

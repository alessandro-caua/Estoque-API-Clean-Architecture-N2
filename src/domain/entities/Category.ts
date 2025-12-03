// Entidade Category - Camada de Domínio
export interface CategoryProps {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private _id?: string;
  private _name: string;
  private _description?: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null | undefined {
    return this._description;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Nome da categoria é obrigatório');
    }
    this._name = value;
  }

  set description(value: string | null | undefined) {
    this._description = value;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

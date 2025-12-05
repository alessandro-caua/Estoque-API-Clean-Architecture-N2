# 📁 Camada de Domínio (Domain Layer)

Esta é a camada mais **central e importante** da Clean Architecture.
Contém as regras de negócio fundamentais que definem o sistema.

---

## 🎯 Responsabilidades

A camada de domínio é responsável por:

1. **Definir as Entidades de Negócio**
   - Product (Produto)
   - Category (Categoria)
   - Sale (Venda)
   - Client (Cliente)
   - etc.

2. **Conter Regras de Negócio Universais**
   - Preço não pode ser negativo
   - Quantidade em estoque não pode ser negativa
   - Nome do produto deve ter pelo menos 2 caracteres

3. **Definir Contratos (Interfaces)**
   - IProductRepository
   - ISaleRepository
   - Esses contratos são implementados na camada de infraestrutura

---

## 📂 Estrutura

```
domain/
├── entities/           # Entidades de negócio
│   ├── Product.ts     # Produto com suas regras
│   ├── Category.ts    # Categoria de produtos
│   ├── Sale.ts        # Venda
│   ├── Client.ts      # Cliente
│   └── ...
│
├── errors/            # Erros de domínio personalizados
│   ├── DomainError.ts         # Erro base
│   ├── EntityErrors.ts        # Erros de entidade
│   ├── ValidationErrors.ts    # Erros de validação
│   ├── BusinessErrors.ts      # Erros de negócio
│   └── index.ts
│
├── ports/             # Interfaces/Contratos
│   └── index.ts       # Exporta todas interfaces de repositórios
│
└── repositories/      # Interfaces de repositórios
    ├── IProductRepository.ts
    ├── ICategoryRepository.ts
    └── ...
```

---

## ⚡ Regra de Ouro

> **O domínio NÃO DEVE depender de nenhuma outra camada!**

A camada de domínio:
- ❌ NÃO conhece Express ou HTTP
- ❌ NÃO conhece Prisma ou SQL
- ❌ NÃO conhece React ou interfaces
- ✅ Conhece apenas TypeScript puro

---

## 💡 Por Que Isso Importa?

Se amanhã você precisar:
- Trocar Express por Fastify → O domínio NÃO muda
- Trocar Prisma por TypeORM → O domínio NÃO muda
- Trocar REST por GraphQL → O domínio NÃO muda

As regras de negócio são estáveis e independentes de tecnologia!

---

## 📖 Exemplo: Entidade Product

```typescript
export class Product {
  private _name: string;
  private _salePrice: number;
  private _quantity: number;

  constructor(props: ProductProps) {
    this._name = props.name;
    this._salePrice = props.salePrice;
    this._quantity = props.quantity ?? 0;

    // Regra de negócio: valida dados
    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    if (this._salePrice < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }

  // Regra de negócio: verifica se precisa repor
  public isLowStock(): boolean {
    return this._quantity <= this._minQuantity;
  }

  // Regra de negócio: calcula margem de lucro
  public getProfitMargin(): number {
    return ((this._salePrice - this._costPrice) / this._costPrice) * 100;
  }
}
```

Note que a entidade:
- Valida seus próprios dados
- Contém regras de negócio (isLowStock, getProfitMargin)
- Não sabe nada sobre banco de dados ou HTTP

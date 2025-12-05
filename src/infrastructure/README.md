# 📁 Camada de Infraestrutura (Infrastructure Layer)

Esta é a camada mais **externa** da Clean Architecture.
Contém implementações concretas que dependem de tecnologias específicas.

---

## 🎯 Responsabilidades

A camada de infraestrutura é responsável por:

1. **Implementar os Repositórios**
   - PrismaProductRepository (implementa IProductRepository)
   - PrismaSaleRepository (implementa ISaleRepository)

2. **Configurar Banco de Dados**
   - Conexão com PostgreSQL/MySQL/SQLite
   - Client do Prisma

3. **Integrações Externas** (se houver)
   - APIs de terceiros
   - Serviços de email
   - Serviços de pagamento

---

## 📂 Estrutura

```
infrastructure/
├── database/
│   └── prisma-client.ts       # Configuração do Prisma
│
└── repositories/              # Implementações dos repositórios
    ├── PrismaProductRepository.ts
    ├── PrismaCategoryRepository.ts
    ├── PrismaSaleRepository.ts
    └── index.ts
```

---

## ⚡ Conceito: Inversão de Dependência

Este é o coração da Clean Architecture!

```
┌─────────────────────────────────────────────────────────┐
│                      DOMÍNIO                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │           interface IProductRepository           │   │
│  │  - create(product): Promise<Product>             │   │
│  │  - findById(id): Promise<Product | null>         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ implementa
                           │
┌─────────────────────────────────────────────────────────┐
│                   INFRAESTRUTURA                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │         class PrismaProductRepository            │   │
│  │  implements IProductRepository                   │   │
│  │                                                  │   │
│  │  create(product) {                               │   │
│  │    return this.prisma.product.create({...})      │   │
│  │  }                                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**A interface (contrato) fica no DOMÍNIO.**
**A implementação (código real) fica na INFRAESTRUTURA.**

Isso permite trocar de banco de dados sem alterar o domínio!

---

## 💡 Exemplo: PrismaProductRepository

```typescript
import { PrismaClient } from '@prisma/client';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

// Esta classe IMPLEMENTA a interface do domínio
export class PrismaProductRepository implements IProductRepository {
  
  // Recebe o client do Prisma
  constructor(private prisma: PrismaClient) {}

  // Implementação concreta usando Prisma
  async create(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name,
        salePrice: product.salePrice,
        costPrice: product.costPrice,
        quantity: product.quantity,
        categoryId: product.categoryId,
      },
      include: {
        category: true,  // Traz a categoria junto
      },
    });

    // Converte o resultado do Prisma para entidade de domínio
    return this.mapToProduct(created);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) return null;
    
    return this.mapToProduct(product);
  }

  // Método auxiliar para converter dados do Prisma para Entidade
  private mapToProduct(data: any): Product {
    return new Product({
      id: data.id,
      name: data.name,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      quantity: data.quantity,
      categoryId: data.categoryId,
      // ... outros campos
    });
  }
}
```

---

## 🔄 Por Que Essa Separação?

### Cenário 1: Trocar Prisma por TypeORM

Sem Clean Architecture:
```
❌ Alterar todos os arquivos que usam Prisma
❌ Alto risco de quebrar o sistema
❌ Muito trabalho
```

Com Clean Architecture:
```
✅ Criar MongoProductRepository implements IProductRepository
✅ Alterar apenas a injeção no app.ts
✅ Zero alteração no domínio e use cases
```

### Cenário 2: Adicionar Cache (Redis)

```typescript
// Novo repositório com cache
class CachedProductRepository implements IProductRepository {
  constructor(
    private prismaRepo: PrismaProductRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string) {
    // Tenta buscar do cache primeiro
    const cached = await this.redis.get(`product:${id}`);
    if (cached) return JSON.parse(cached);

    // Se não estiver em cache, busca do banco
    const product = await this.prismaRepo.findById(id);
    
    // Salva em cache para próxima vez
    await this.redis.set(`product:${id}`, JSON.stringify(product));
    
    return product;
  }
}
```

O domínio e os use cases nem sabem que existe cache!

---

## 📖 Resumo

| Aspecto | Domínio | Infraestrutura |
|---------|---------|----------------|
| O que contém | Interfaces (contratos) | Implementações (código real) |
| Conhece tecnologia? | ❌ Não | ✅ Sim (Prisma, Redis, etc) |
| Muda frequentemente? | ❌ Raramente | ✅ Às vezes |
| Exemplo | IProductRepository | PrismaProductRepository |

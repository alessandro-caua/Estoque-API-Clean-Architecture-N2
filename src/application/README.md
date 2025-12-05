# 📁 Camada de Aplicação (Application Layer)

Esta camada contém os **Casos de Uso** (Use Cases) da aplicação.
Orquestra o fluxo de dados entre as entidades e os repositórios.

---

## 🎯 Responsabilidades

A camada de aplicação é responsável por:

1. **Implementar Casos de Uso**
   - Criar Produto
   - Registrar Venda
   - Cancelar Pedido
   - etc.

2. **Orquestrar o Fluxo de Dados**
   - Recebe dados do Controller (DTO)
   - Valida regras de negócio do contexto
   - Chama entidades e repositórios
   - Retorna resultado

3. **Definir DTOs (Data Transfer Objects)**
   - CreateProductDTO
   - UpdateCategoryDTO
   - Definem exatamente quais dados entram/saem

---

## 📂 Estrutura

```
application/
├── dtos/                      # Objetos de Transferência de Dados
│   ├── CategoryDTO.ts
│   ├── ProductDTO.ts
│   ├── SaleDTO.ts
│   └── index.ts
│
└── use-cases/                 # Casos de Uso organizados por entidade
    ├── category/
    │   ├── CreateCategoryUseCase.ts
    │   ├── GetCategoryByIdUseCase.ts
    │   ├── UpdateCategoryUseCase.ts
    │   ├── DeleteCategoryUseCase.ts
    │   └── index.ts
    │
    ├── product/
    │   ├── CreateProductUseCase.ts
    │   ├── GetProductUseCases.ts
    │   └── ...
    │
    ├── sale/
    │   ├── CreateSaleUseCase.ts
    │   ├── CancelSaleUseCase.ts
    │   └── ...
    │
    └── index.ts               # Exporta todos os use cases
```

---

## ⚡ Regras Importantes

### 1. Use Case = UMA Ação
Cada Use Case faz exatamente UMA coisa:
- ✅ `CreateProductUseCase` - Cria produto
- ✅ `UpdateProductUseCase` - Atualiza produto
- ❌ `ProductUseCase` - Faz tudo (ruim!)

### 2. Depende de Abstrações
Use Cases dependem de INTERFACES, não implementações:
```typescript
// ✅ CORRETO
constructor(private productRepository: IProductRepository) {}

// ❌ ERRADO
constructor(private productRepository: PrismaProductRepository) {}
```

### 3. Não Conhece HTTP
O Use Case NÃO sabe se está sendo chamado por:
- API REST
- GraphQL
- CLI
- Teste automatizado

---

## 💡 Exemplo: CreateProductUseCase

```typescript
export class CreateProductUseCase {
  // Injeção de dependência via construtor
  constructor(
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    // 1. Validar regras de negócio
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new EntityNotFoundError('Categoria', data.categoryId);
    }

    // 2. Criar entidade (validação interna)
    const product = new Product({
      name: data.name,
      salePrice: data.salePrice,
      costPrice: data.costPrice,
      categoryId: data.categoryId,
    });

    // 3. Persistir via repositório
    return this.productRepository.create(product);
  }
}
```

---

## 📖 O que são DTOs?

**DTO = Data Transfer Object**

DTOs são objetos que definem o formato dos dados que entram ou saem.

```typescript
// Dados para CRIAR produto
interface CreateProductDTO {
  name: string;          // Obrigatório
  salePrice: number;     // Obrigatório
  description?: string;  // Opcional
}

// Dados para ATUALIZAR produto
interface UpdateProductDTO {
  name?: string;         // Tudo opcional
  salePrice?: number;    // (atualização parcial)
}
```

**Por que usar DTOs?**
1. **Segurança**: Define exatamente o que é aceito
2. **Documentação**: Deixa claro o contrato
3. **Desacoplamento**: API pode mudar sem afetar entidade

---

## 🔄 Fluxo de uma Requisição

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Controller  │────▶│   Use Case   │────▶│  Repository  │
│ (HTTP/JSON)  │     │   (Lógica)   │     │   (Banco)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
    Request            CreateDTO              Entity
      Body            ProductDTO              Product
       │                    │                    │
       └────────────────────┴────────────────────┘
                            │
                       Response
```

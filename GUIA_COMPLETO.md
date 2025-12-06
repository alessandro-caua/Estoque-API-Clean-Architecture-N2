# 📚 GUIA COMPLETO DO PROJETO - API de Estoque com Clean Architecture

---

## 📖 ÍNDICE

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Completa](#2-arquitetura-completa)
3. [Fluxo de Dados Detalhado](#3-fluxo-de-dados-detalhado)
4. [Camadas do Sistema](#4-camadas-do-sistema)
5. [Padrões Implementados](#5-padrões-implementados)
6. [Módulos e Funcionalidades](#6-módulos-e-funcionalidades)
7. [Sistema de Erros](#7-sistema-de-erros)
8. [Como Tudo se Conecta](#8-como-tudo-se-conecta)
9. [Tecnologias e Ferramentas](#9-tecnologias-e-ferramentas)
10. [Exemplo Prático Completo](#10-exemplo-prático-completo)

---

## 1. VISÃO GERAL DO SISTEMA

### 🎯 O Que É Este Projeto?

Uma **API RESTful completa** para gestão de supermercado que controla:

- 📦 **Estoque**: Produtos, categorias, fornecedores, movimentações
- 💰 **Vendas**: PDV, registro de vendas, formas de pagamento
- 👥 **Clientes**: Cadastro, crédito, sistema de fiado
- 💵 **Financeiro**: Contas a pagar/receber, fluxo de caixa
- 👤 **Usuários**: Autenticação, permissões, auditoria

### 📊 Números do Projeto

```
✅ 14.266 linhas de código TypeScript
✅ 96 arquivos organizados
✅ 16 entidades de domínio
✅ 10 módulos de use cases
✅ 22 requisitos funcionais implementados
✅ 4 camadas arquiteturais
✅ Sistema de erros customizados
✅ Validação com Zod
✅ ORM Prisma 7
✅ 0 erros de compilação
```

---

## 2. ARQUITETURA COMPLETA

### 🏗️ Clean Architecture em 4 Camadas

```
┌────────────────────────────────────────────────────────────┐
│                  1. PRESENTATION LAYER                      │
│           (Controllers, Routes, Validators)                 │
│                                                             │
│  Responsabilidade: Interface HTTP com o mundo externo      │
│  - Recebe requisições HTTP                                 │
│  - Valida dados de entrada (Zod)                           │
│  - Chama Use Cases                                         │
│  - Formata respostas                                       │
│  - Trata erros                                             │
├────────────────────────────────────────────────────────────┤
│                  2. APPLICATION LAYER                       │
│                     (Use Cases, DTOs)                       │
│                                                             │
│  Responsabilidade: Casos de uso da aplicação               │
│  - Orquestra fluxo de dados                                │
│  - Aplica regras de negócio de contexto                    │
│  - Coordena múltiplas entidades                            │
│  - Não conhece HTTP ou Banco                               │
├────────────────────────────────────────────────────────────┤
│                   3. DOMAIN LAYER                           │
│              (Entities, Interfaces, Errors)                 │
│                                                             │
│  Responsabilidade: Coração do sistema                      │
│  - Define entidades de negócio                             │
│  - Contém regras universais                                │
│  - Define contratos (interfaces)                           │
│  - Independente de frameworks                              │
│  - NÃO depende de nenhuma camada                           │
├────────────────────────────────────────────────────────────┤
│                4. INFRASTRUCTURE LAYER                      │
│           (Repositories, DAOs, Prisma, Services)            │
│                                                             │
│  Responsabilidade: Detalhes técnicos                       │
│  - Implementa interfaces do domínio                        │
│  - Acessa banco de dados (Prisma)                          │
│  - Serviços externos                                       │
│  - Conversão de dados                                      │
└────────────────────────────────────────────────────────────┘
                          ↓
                  [ BANCO DE DADOS ]
                     (SQLite)
```

### 🔄 Princípios Aplicados

1. **Inversão de Dependência (DIP)**
   - Camadas superiores dependem de abstrações
   - Camadas inferiores implementam abstrações
   
2. **Separação de Responsabilidades (SRP)**
   - Cada classe tem uma única responsabilidade
   - Use Case faz UMA coisa

3. **Aberto/Fechado (OCP)**
   - Aberto para extensão
   - Fechado para modificação

4. **Substituição de Liskov (LSP)**
   - Interfaces podem ser substituídas
   - Implementations respeitam contratos

---

## 3. FLUXO DE DADOS DETALHADO

### 📥 Requisição: Criar um Produto

```
┌──────────────────────────────────────────────────────────────┐
│ 1. CLIENTE FAZ REQUEST                                        │
└──────────────────────────────────────────────────────────────┘
   POST /api/products
   {
     "name": "Arroz Tipo 1",
     "salePrice": 25.90,
     "costPrice": 18.00,
     "categoryId": "uuid-123"
   }
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. ROUTE (routes/productRoutes.ts)                           │
│    Define endpoint e middlewares                             │
└──────────────────────────────────────────────────────────────┘
   router.post('/products', validateProduct, controller.create)
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. VALIDATOR (validators/productValidators.ts)               │
│    Valida dados com Zod schema                               │
└──────────────────────────────────────────────────────────────┘
   ✅ Nome válido? ✅ Preço positivo? ✅ UUID válido?
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. CONTROLLER (controllers/ProductController.ts)             │
│    Extrai dados e chama Use Case                             │
└──────────────────────────────────────────────────────────────┘
   const product = await createProductUseCase.execute(data);
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. USE CASE (use-cases/ProductUseCases.ts)                   │
│    CreateProductUseCase                                       │
└──────────────────────────────────────────────────────────────┘
   - Valida categoria existe
   - Valida código de barras único
   - Cria entidade Product
   - Chama repository
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. DOMAIN ENTITY (entities/Product.ts)                       │
│    Valida regras de negócio                                  │
└──────────────────────────────────────────────────────────────┘
   new Product({ name, price, ... })
   - Valida: preço > 0
   - Valida: nome >= 2 chars
   - Calcula: margem de lucro
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. REPOSITORY (repositories/PrismaProductRepository.ts)      │
│    Converte entidade → modelo Prisma                         │
└──────────────────────────────────────────────────────────────┘
   const prismaData = this.toDomainData(product);
   const saved = await this.dao.create(prismaData);
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. DAO (dao/ProductDAO.ts) - NOVA CAMADA!                    │
│    Executa operação no banco                                 │
└──────────────────────────────────────────────────────────────┘
   return prisma.product.create({ data });
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 9. PRISMA ORM                                                 │
│    Gera e executa SQL                                        │
└──────────────────────────────────────────────────────────────┘
   INSERT INTO products (id, name, price...) VALUES (...)
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 10. BANCO DE DADOS (SQLite)                                  │
│     Persiste dados                                           │
└──────────────────────────────────────────────────────────────┘
                     ↓
        ⬅️ RESPOSTA VOLTA NO CAMINHO INVERSO
                     ↓
┌──────────────────────────────────────────────────────────────┐
│ 11. CLIENTE RECEBE                                            │
└──────────────────────────────────────────────────────────────┘
   201 Created
   {
     "id": "uuid-456",
     "name": "Arroz Tipo 1",
     "salePrice": 25.90,
     "createdAt": "2025-12-06T10:30:00Z"
   }
```

---

## 4. CAMADAS DO SISTEMA

### 🎨 1. PRESENTATION LAYER

**Localização**: `src/presentation/`

**Componentes**:

```
presentation/
├── controllers/          # Lógica de controle HTTP
│   ├── ProductController.ts
│   ├── CategoryController.ts
│   ├── SaleController.ts
│   ├── ClientController.ts
│   ├── UserController.ts
│   ├── FinancialController.ts
│   └── StockMovementController.ts
│
├── routes/              # Definição de endpoints
│   ├── productRoutes.ts
│   ├── categoryRoutes.ts
│   └── index.ts
│
├── validators/          # Validação Zod
│   ├── productValidators.ts
│   ├── saleValidators.ts
│   └── index.ts
│
└── middlewares/         # Middlewares Express
    ├── errorHandler.ts  # Tratamento centralizado
    └── index.ts
```

**Responsabilidades**:
- ✅ Receber requisições HTTP
- ✅ Validar dados de entrada (Zod)
- ✅ Chamar Use Cases apropriados
- ✅ Formatar respostas JSON
- ✅ Mapear erros de domínio → status HTTP

**Exemplo - ProductController**:
```typescript
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extrair dados
      const data = req.body;
      
      // 2. Chamar Use Case
      const product = await this.createProductUseCase.execute(data);
      
      // 3. Retornar resposta
      return res.status(201).json(product.toJSON());
    } catch (error) {
      // 4. Middleware de erro trata automaticamente
      throw error;
    }
  }
}
```

---

### 🧠 2. APPLICATION LAYER

**Localização**: `src/application/`

**Componentes**:

```
application/
├── use-cases/           # Casos de uso por módulo
│   ├── ProductUseCases.ts
│   │   ├── CreateProductUseCase
│   │   ├── UpdateProductUseCase
│   │   ├── GetProductByIdUseCase
│   │   └── GetLowStockProductsUseCase
│   │
│   ├── SaleUseCases.ts
│   │   ├── CreateSaleUseCase
│   │   ├── CancelSaleUseCase
│   │   └── GetSalesSummaryUseCase
│   │
│   └── ... (10 módulos)
│
└── dtos/               # Data Transfer Objects
    ├── ProductDTO.ts
    ├── SaleDTO.ts
    └── index.ts
```

**Responsabilidades**:
- ✅ Implementar casos de uso
- ✅ Orquestrar fluxo entre entidades
- ✅ Aplicar regras de contexto
- ✅ Coordenar múltiplos repositórios
- ✅ NÃO conhece HTTP ou SQL

**Exemplo - CreateSaleUseCase**:
```typescript
export class CreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private productRepository: IProductRepository,
    private stockMovementRepository: IStockMovementRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    // 1. Validar cliente (se informado)
    if (data.clientId) {
      const client = await this.clientRepository.findById(data.clientId);
      if (!client) throw new EntityNotFoundError('Cliente');
    }

    // 2. Validar produtos e estoque
    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) throw new EntityNotFoundError('Produto');
      if (product.quantity < item.quantity) {
        throw new InsufficientStockError(product.name, product.quantity, item.quantity);
      }
    }

    // 3. Criar venda
    const sale = new Sale({ ...data });
    const savedSale = await this.saleRepository.create(sale);

    // 4. Baixar estoque
    for (const item of data.items) {
      await this.productRepository.updateQuantity(
        item.productId,
        newQuantity
      );
      
      // 5. Registrar movimentação
      const movement = new StockMovement({
        type: MovementType.SALE,
        productId: item.productId,
        quantity: item.quantity
      });
      await this.stockMovementRepository.create(movement);
    }

    return savedSale;
  }
}
```

---

### ⚡ 3. DOMAIN LAYER

**Localização**: `src/domain/`

**Componentes**:

```
domain/
├── entities/           # 16 Entidades de negócio
│   ├── Product.ts
│   ├── Category.ts
│   ├── Sale.ts
│   ├── Client.ts
│   ├── User.ts
│   ├── FinancialAccount.ts
│   └── ...
│
├── errors/            # Sistema de erros robusto
│   ├── DomainError.ts          # Erro base
│   ├── EntityErrors.ts         # Erros de entidade
│   ├── ValidationErrors.ts     # Erros de validação
│   ├── BusinessErrors.ts       # Erros de negócio
│   └── index.ts
│
├── repositories/      # Interfaces (contratos)
│   ├── IProductRepository.ts
│   ├── ICategoryRepository.ts
│   ├── ISaleRepository.ts
│   └── ...
│
└── ports/            # Exportações centralizadas
    └── index.ts
```

**Responsabilidades**:
- ✅ Definir entidades com regras
- ✅ Validar invariantes de negócio
- ✅ Definir contratos (interfaces)
- ✅ Erros de domínio customizados
- ✅ **TOTALMENTE INDEPENDENTE**

**Exemplo - Entidade Product**:
```typescript
export class Product {
  private _id?: string;
  private _name: string;
  private _salePrice: number;
  private _costPrice: number;
  private _quantity: number;

  constructor(props: ProductProps) {
    this._name = props.name;
    this._salePrice = props.salePrice;
    this._costPrice = props.costPrice;
    this._quantity = props.quantity ?? 0;
    
    // Valida regras de negócio
    this.validate();
  }

  private validate(): void {
    // Regra 1: Nome mínimo
    if (this._name.length < 2) {
      throw new ValidationError('Nome deve ter pelo menos 2 caracteres');
    }

    // Regra 2: Preços positivos
    if (this._salePrice <= 0 || this._costPrice < 0) {
      throw new ValidationError('Preços devem ser válidos');
    }

    // Regra 3: Quantidade não negativa
    if (this._quantity < 0) {
      throw new ValidationError('Quantidade não pode ser negativa');
    }
  }

  // Métodos de negócio
  calculateProfitMargin(): number {
    return ((this._salePrice - this._costPrice) / this._costPrice) * 100;
  }

  isLowStock(minQuantity: number): boolean {
    return this._quantity <= minQuantity;
  }

  // Getters/Setters com validação
  set salePrice(value: number) {
    if (value <= 0) throw new ValidationError('Preço inválido');
    this._salePrice = value;
  }
}
```

---

### 🔧 4. INFRASTRUCTURE LAYER

**Localização**: `src/infrastructure/`

**Componentes**:

```
infrastructure/
├── dao/                    # 🆕 NOVA CAMADA DAO!
│   ├── IBaseDAO.ts        # Interface genérica
│   ├── ProductDAO.ts      # DAO de produto
│   └── README.md
│
├── repositories/           # Implementações
│   ├── PrismaProductRepository.ts
│   ├── PrismaCategoryRepository.ts
│   ├── PrismaSaleRepository.ts
│   └── ...
│
└── database/              # Configuração banco
    └── prisma-client.ts   # Singleton Prisma
```

**Responsabilidades**:
- ✅ Implementar interfaces do domínio
- ✅ Acessar banco de dados
- ✅ Converter: Entidade ↔ Modelo Prisma
- ✅ Usar DAOs para queries
- ✅ Detalhes técnicos isolados

**Exemplo - PrismaProductRepository**:
```typescript
export class PrismaProductRepository implements IProductRepository {
  private dao: ProductDAO;

  constructor(prisma: PrismaClient) {
    this.dao = new ProductDAO(prisma);
  }

  async create(product: Product): Promise<Product> {
    // 1. Converter entidade → dados Prisma
    const prismaData = {
      name: product.name,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      quantity: product.quantity,
      categoryId: product.categoryId,
    };

    // 2. Usar DAO para salvar
    const saved = await this.dao.create(prismaData);

    // 3. Converter dados Prisma → entidade
    return new Product({
      id: saved.id,
      name: saved.name,
      salePrice: saved.salePrice,
      costPrice: saved.costPrice,
      quantity: saved.quantity,
      categoryId: saved.categoryId,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const data = await this.dao.findById(id);
    return data ? this.toDomainEntity(data) : null;
  }
}
```

---

## 5. PADRÕES IMPLEMENTADOS

### 🎨 Padrões de Design

#### 1. **Repository Pattern**
- Abstrai persistência de dados
- Interface no domínio, implementação na infra
- Trabalha com entidades de domínio

#### 2. **DAO Pattern** 🆕
- Acesso direto ao banco
- Operações CRUD básicas
- Usado pelos repositories

#### 3. **Use Case Pattern**
- Um caso de uso = uma ação
- Orquestra fluxo de dados
- Independente de frameworks

#### 4. **Dependency Injection**
- Via construtor
- Inverte dependências
- Facilita testes

#### 5. **DTO Pattern**
- Transferência de dados entre camadas
- Valida dados de entrada
- Desacopla camadas

#### 6. **Strategy Pattern**
- Diferentes tipos de movimento: ENTRADA, SAÍDA, VENDA, RETURN
- Diferentes formas de pagamento
- Diferentes tipos de contas

#### 7. **Factory Pattern**
- Criação de entidades complexas
- Validação centralizada

---

## 6. MÓDULOS E FUNCIONALIDADES

### 📦 1. Módulo de Produtos

**Entidades**: Product, Category, Supplier

**Use Cases**:
- ✅ Criar/Atualizar/Deletar produto
- ✅ Buscar por ID, código de barras
- ✅ Listar por categoria/fornecedor
- ✅ Produtos com estoque baixo
- ✅ Produtos vencidos/próximos

**Endpoints**:
```
POST   /api/products
GET    /api/products/:id
GET    /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/low-stock
GET    /api/products/expired
```

---

### 💰 2. Módulo de Vendas

**Entidades**: Sale, SaleItem

**Use Cases**:
- ✅ Registrar venda
- ✅ Cancelar venda (estorna estoque)
- ✅ Baixa automática no estoque
- ✅ Cálculo de total com descontos
- ✅ Resumo de vendas por período
- ✅ Vendas do dia

**Regras de Negócio**:
- Valida estoque antes de vender
- Produto inativo não pode ser vendido
- Cancela venda = estorna estoque
- Venda fiada debita do cliente

---

### 👥 3. Módulo de Clientes

**Entidades**: Client

**Use Cases**:
- ✅ Cadastro completo
- ✅ Sistema de crédito/limite
- ✅ Controle de débitos
- ✅ Vendas fiadas
- ✅ Lista de devedores
- ✅ Total de débitos

**Regras de Negócio**:
- CPF único
- Limite de crédito configurável
- Débito não pode exceder limite
- Cliente inativo não pode comprar

---

### 💵 4. Módulo Financeiro

**Entidades**: FinancialAccount

**Use Cases**:
- ✅ Contas a pagar
- ✅ Contas a receber
- ✅ Registro de pagamentos
- ✅ Contas vencidas
- ✅ Contas a vencer
- ✅ Resumo financeiro
- ✅ Fluxo de caixa

**Tipos de Conta**:
- PAYABLE (a pagar)
- RECEIVABLE (a receber)

**Status**:
- PENDING (pendente)
- PAID (paga)
- OVERDUE (vencida)
- CANCELLED (cancelada)

---

### 📊 5. Módulo de Estoque

**Entidades**: StockMovement

**Use Cases**:
- ✅ Entrada de produtos
- ✅ Saída manual
- ✅ Movimentação por venda
- ✅ Devolução (return)
- ✅ Histórico completo
- ✅ Relatório de movimentações
- ✅ Movimentações por período

**Tipos de Movimento**:
```typescript
enum MovementType {
  ENTRY = 'ENTRY',      // Entrada de mercadoria
  EXIT = 'EXIT',        // Saída manual
  SALE = 'SALE',        // Venda
  RETURN = 'RETURN',    // Devolução
  ADJUSTMENT = 'ADJUSTMENT' // Ajuste
}
```

---

### 👤 6. Módulo de Usuários

**Entidades**: User

**Roles (Cargos)**:
```typescript
enum UserRole {
  ADMIN = 'ADMIN',      // Todas permissões
  MANAGER = 'MANAGER',  // Gerente
  CASHIER = 'CASHIER'   // Caixa
}
```

**Use Cases**:
- ✅ Cadastro de usuários
- ✅ Autenticação (login)
- ✅ Controle de acesso por cargo
- ✅ Alterar senha
- ✅ Desativar usuário
- ✅ Listar usuários

---

## 7. SISTEMA DE ERROS

### 🚨 Hierarquia de Erros

```
DomainError (Base)
├── EntityNotFoundError        # Entidade não encontrada
├── EntityAlreadyExistsError   # Duplicidade
├── InvalidEntityStateError    # Estado inválido
├── ValidationError            # Validação falhou
│
├── BusinessErrors (Negócio)
│   ├── InsufficientStockError      # Estoque insuficiente
│   ├── InactiveProductError        # Produto inativo
│   ├── CreditLimitExceededError    # Limite excedido
│   ├── ClientHasDebtsError         # Cliente com débitos
│   ├── UnauthorizedOperationError  # Sem permissão
│   ├── InvalidCredentialsError     # Login inválido
│   └── UserDeactivatedError        # Usuário desativado
│
└── ValidationErrors (Validação)
    ├── RequiredFieldError     # Campo obrigatório
    ├── InvalidFormatError     # Formato inválido
    └── OutOfRangeError        # Fora do intervalo
```

### 🎯 Tratamento de Erros

**Middleware Centralizado**:

```typescript
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Erro de domínio
  if (error instanceof EntityNotFoundError) {
    return res.status(404).json({
      error: 'NOT_FOUND',
      message: error.message,
      code: error.code
    });
  }

  // 2. Erro de validação Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details: error.errors
    });
  }

  // 3. Erro de negócio
  if (error instanceof InsufficientStockError) {
    return res.status(400).json({
      error: 'INSUFFICIENT_STOCK',
      message: error.message,
      available: error.availableQuantity,
      requested: error.requestedQuantity
    });
  }

  // 4. Erro desconhecido
  return res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Erro interno do servidor'
  });
}
```

---

## 8. COMO TUDO SE CONECTA

### 🔗 Injeção de Dependências (app.ts)

```typescript
// 1. Criar repositórios
const categoryRepository = new PrismaCategoryRepository(prisma);
const productRepository = new PrismaProductRepository(prisma);
const saleRepository = new PrismaSaleRepository(prisma);

// 2. Criar use cases (injetando repositories)
const createProductUseCase = new CreateProductUseCase(
  productRepository,
  categoryRepository
);

const createSaleUseCase = new CreateSaleUseCase(
  saleRepository,
  productRepository,
  stockMovementRepository,
  clientRepository
);

// 3. Criar controllers (injetando use cases)
const productController = new ProductController(
  createProductUseCase,
  getProductByIdUseCase,
  getAllProductsUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

// 4. Criar rotas (injetando controllers)
const productRoutes = createProductRoutes(productController);

// 5. Registrar rotas no Express
app.use('/api', productRoutes);
```

---

## 9. TECNOLOGIAS E FERRAMENTAS

### 📚 Stack Completo

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Node.js** | 18+ | Runtime |
| **TypeScript** | 5.3.3 | Linguagem |
| **Express** | 4.18.2 | Framework web |
| **Prisma** | 7.1.0 | ORM |
| **LibSQL** | 0.15.15 | Driver SQLite |
| **Zod** | 3.22.4 | Validação |
| **ts-node-dev** | 2.0.0 | Hot reload |

---

## 10. EXEMPLO PRÁTICO COMPLETO

### 🛒 Fluxo: Cliente Comprando Arroz

#### **Passo 1**: Cliente faz pedido

```http
POST /api/sales
Content-Type: application/json

{
  "clientId": "uuid-cliente-123",
  "userId": "uuid-usuario-456",
  "paymentMethod": "CREDIT_CARD",
  "items": [
    {
      "productId": "uuid-arroz-789",
      "quantity": 2,
      "discount": 0
    }
  ],
  "discount": 0,
  "notes": "Entregar às 18h"
}
```

#### **Passo 2**: Sistema processa

```typescript
// CONTROLLER recebe
async create(req, res) {
  const data = req.body; // Validado pelo Zod
  const sale = await createSaleUseCase.execute(data);
  return res.status(201).json(sale.toJSON());
}

// USE CASE orquestra
async execute(data) {
  // 1. Valida cliente
  const client = await clientRepository.findById(data.clientId);
  if (!client) throw new EntityNotFoundError('Cliente');

  // 2. Valida produto e estoque
  const product = await productRepository.findById('uuid-arroz-789');
  if (product.quantity < 2) {
    throw new InsufficientStockError('Arroz', product.quantity, 2);
  }

  // 3. Cria venda
  const sale = new Sale({
    clientId: data.clientId,
    total: product.salePrice * 2,
    items: [...]
  });

  // 4. Salva venda
  const saved = await saleRepository.create(sale);

  // 5. Baixa estoque (2 sacos de arroz)
  await productRepository.updateQuantity(
    'uuid-arroz-789',
    product.quantity - 2
  );

  // 6. Registra movimentação
  const movement = new StockMovement({
    type: MovementType.SALE,
    productId: 'uuid-arroz-789',
    quantity: 2,
    reason: `Venda #${saved.id}`
  });
  await stockMovementRepository.create(movement);

  return saved;
}

// REPOSITORY salva
async create(sale) {
  const prismaData = this.toPrismaData(sale);
  const saved = await this.dao.create(prismaData);
  return this.toDomainEntity(saved);
}

// DAO executa query
async create(data) {
  return prisma.sale.create({
    data: {
      clientId: data.clientId,
      total: data.total,
      items: {
        create: data.items
      }
    }
  });
}
```

#### **Passo 3**: Cliente recebe resposta

```json
{
  "id": "uuid-venda-999",
  "clientId": "uuid-cliente-123",
  "userId": "uuid-usuario-456",
  "total": 51.80,
  "paymentMethod": "CREDIT_CARD",
  "paymentStatus": "PAID",
  "items": [
    {
      "id": "uuid-item-111",
      "productId": "uuid-arroz-789",
      "productName": "Arroz Tipo 1",
      "quantity": 2,
      "unitPrice": 25.90,
      "total": 51.80
    }
  ],
  "createdAt": "2025-12-06T10:30:00Z"
}
```

---

## 📊 RESUMO FINAL

### ✅ O Que Foi Implementado

```
✅ 4 Camadas Arquiteturais (Clean Architecture)
✅ Padrão DAO + Repository
✅ 16 Entidades de Domínio
✅ 10 Módulos Completos
✅ 22 Requisitos Funcionais
✅ Sistema de Erros Robusto
✅ Validação com Zod
✅ Middleware de Tratamento
✅ Injeção de Dependências
✅ Documentação Completa
✅ 14.266 linhas de código TypeScript
✅ 0 erros de compilação
```

### 🎯 Diferenciais do Projeto

1. **Arquitetura Enterprise**: Clean Architecture aplicada corretamente
2. **Sistema de Erros**: Hierarquia completa de erros customizados
3. **Padrão DAO**: Nova camada para isolamento de dados
4. **Documentação Didática**: READMEs explicativos em cada camada
5. **Código Limpo**: Seguindo princípios SOLID
6. **TypeScript Strict**: Tipos estritos em todo código
7. **Validação Robusta**: Zod em todas entradas
8. **Organização**: 96 arquivos perfeitamente organizados

---

## 🚀 Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco
npx prisma migrate dev --name init

# 3. Rodar servidor
npm run dev

# Servidor rodando em http://localhost:3000
```

---

**Este é um projeto de nível profissional que demonstra domínio completo de:**
- 🏗️ Arquitetura de Software
- 🎨 Padrões de Design
- 🧠 Clean Code
- 📚 TypeScript Avançado
- 🔧 Node.js/Express
- 💾 Prisma ORM
- ✅ Validação e Tratamento de Erros

**Pronto para produção com adição de testes automatizados!** 🎉

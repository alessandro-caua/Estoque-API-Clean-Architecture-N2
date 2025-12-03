# 📦 API de Estoque - Sistema de Gestão para Supermercado

API RESTful completa para gerenciamento de estoque, vendas, clientes e finanças de supermercado, desenvolvida com **Clean Architecture** em **TypeScript**.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Endpoints da API](#endpoints-da-api)
- [Módulos](#módulos)
- [Regras de Negócio](#regras-de-negócio)

---

## 🎯 Visão Geral

Sistema completo de gestão mercantil que abrange:

- **Controle de Estoque**: Categorias, fornecedores, produtos e movimentações
- **Gestão de Vendas**: PDV, registro de vendas, múltiplas formas de pagamento
- **Cadastro de Clientes**: Clientes, limite de crédito, sistema de fiado
- **Gestão Financeira**: Contas a pagar/receber, fluxo de caixa
- **Controle de Usuários**: Autenticação, permissões por cargo
- **Auditoria**: Registro de todas as ações do sistema

---

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.x | Superset JavaScript tipado |
| Express | 4.18 | Framework web |
| Prisma | 5.22 | ORM e migrations |
| SQLite | 3.x | Banco de dados |
| UUID | 9.x | Geração de IDs únicos |

---

## 🏗 Arquitetura

O projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa):

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (Controllers, Routes, DTOs)                     │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│                      (Use Cases)                             │
├─────────────────────────────────────────────────────────────┤
│                     DOMAIN LAYER                             │
│            (Entities, Repository Interfaces)                 │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                        │
│         (Prisma Repositories, Database, Services)            │
└─────────────────────────────────────────────────────────────┘
```

### Camadas

1. **Domain Layer** (Camada de Domínio)
   - Entidades de negócio
   - Interfaces de repositórios
   - Regras de negócio centrais
   - Independente de frameworks

2. **Application Layer** (Camada de Aplicação)
   - Casos de uso
   - Orquestração de fluxos
   - DTOs de entrada/saída

3. **Infrastructure Layer** (Camada de Infraestrutura)
   - Implementação dos repositórios
   - Prisma Client
   - Serviços externos

4. **Presentation Layer** (Camada de Apresentação)
   - Controllers HTTP
   - Rotas Express
   - Validação de entrada

---

## 📁 Estrutura do Projeto

```
src/
├── domain/                     # Camada de Domínio
│   ├── entities/              # Entidades de negócio
│   │   ├── Category.ts
│   │   ├── Supplier.ts
│   │   ├── Product.ts
│   │   ├── StockMovement.ts
│   │   ├── User.ts
│   │   ├── Client.ts
│   │   ├── Sale.ts
│   │   ├── SaleItem.ts
│   │   ├── FinancialAccount.ts
│   │   ├── CashFlow.ts
│   │   ├── AuditLog.ts
│   │   ├── Promotion.ts
│   │   ├── PurchaseOrder.ts
│   │   ├── PurchaseItem.ts
│   │   └── Receipt.ts
│   └── repositories/          # Interfaces de repositórios
│       ├── ICategoryRepository.ts
│       ├── ISupplierRepository.ts
│       ├── IProductRepository.ts
│       ├── IStockMovementRepository.ts
│       ├── IUserRepository.ts
│       ├── IClientRepository.ts
│       ├── ISaleRepository.ts
│       ├── IFinancialAccountRepository.ts
│       ├── ICashFlowRepository.ts
│       ├── IAuditLogRepository.ts
│       ├── IPromotionRepository.ts
│       └── IPurchaseOrderRepository.ts
│
├── application/               # Camada de Aplicação
│   └── use-cases/            # Casos de uso
│       ├── CategoryUseCases.ts
│       ├── SupplierUseCases.ts
│       ├── ProductUseCases.ts
│       ├── StockMovementUseCases.ts
│       ├── UserUseCases.ts
│       ├── ClientUseCases.ts
│       ├── SaleUseCases.ts
│       ├── FinancialUseCases.ts
│       ├── ReportUseCases.ts
│       ├── AuditLogUseCases.ts
│       ├── PromotionUseCases.ts
│       └── PurchaseOrderUseCases.ts
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── database/
│   │   └── prisma-client.ts
│   └── repositories/         # Implementações Prisma
│       ├── PrismaCategoryRepository.ts
│       ├── PrismaSupplierRepository.ts
│       ├── PrismaProductRepository.ts
│       ├── PrismaStockMovementRepository.ts
│       ├── PrismaUserRepository.ts
│       ├── PrismaClientRepository.ts
│       ├── PrismaSaleRepository.ts
│       ├── PrismaFinancialAccountRepository.ts
│       ├── PrismaCashFlowRepository.ts
│       ├── PrismaAuditLogRepository.ts
│       ├── PrismaPromotionRepository.ts
│       └── PrismaPurchaseOrderRepository.ts
│
├── presentation/              # Camada de Apresentação
│   ├── controllers/          # Controllers HTTP
│   │   ├── CategoryController.ts
│   │   ├── SupplierController.ts
│   │   ├── ProductController.ts
│   │   ├── StockMovementController.ts
│   │   ├── UserController.ts
│   │   ├── ClientController.ts
│   │   ├── SaleController.ts
│   │   └── FinancialController.ts
│   └── routes/               # Rotas Express
│       ├── categoryRoutes.ts
│       ├── supplierRoutes.ts
│       ├── productRoutes.ts
│       ├── stockMovementRoutes.ts
│       ├── userRoutes.ts
│       ├── clientRoutes.ts
│       ├── saleRoutes.ts
│       └── financialRoutes.ts
│
├── app.ts                    # Configuração Express
├── server.ts                 # Ponto de entrada
│
prisma/
├── schema.prisma             # Schema do banco de dados
└── migrations/               # Migrations do Prisma
```

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd Estoque-API-Clean-Architecture-N2

# Instale as dependências
npm install

# Gere o Prisma Client
npx prisma generate

# Execute as migrations
npx prisma migrate dev

# (Opcional) Abra o Prisma Studio
npx prisma studio
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Servidor
PORT=3000
NODE_ENV=development
```

---

## ▶️ Execução

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## 📡 Endpoints da API

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Status da API e lista de módulos |

### 📦 Módulo de Categorias (`/api/categories`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/categories` | Criar categoria |
| GET | `/api/categories` | Listar categorias |
| GET | `/api/categories/:id` | Buscar por ID |
| PUT | `/api/categories/:id` | Atualizar categoria |
| DELETE | `/api/categories/:id` | Excluir categoria |

### 🏭 Módulo de Fornecedores (`/api/suppliers`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/suppliers` | Criar fornecedor |
| GET | `/api/suppliers` | Listar fornecedores |
| GET | `/api/suppliers/:id` | Buscar por ID |
| PUT | `/api/suppliers/:id` | Atualizar fornecedor |
| DELETE | `/api/suppliers/:id` | Excluir fornecedor |

### 📦 Módulo de Produtos (`/api/products`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/products` | Criar produto |
| GET | `/api/products` | Listar produtos |
| GET | `/api/products/:id` | Buscar por ID |
| GET | `/api/products/barcode/:barcode` | Buscar por código de barras |
| GET | `/api/products/low-stock` | Produtos com estoque baixo |
| GET | `/api/products/expired` | Produtos vencidos |
| GET | `/api/products/category/:categoryId` | Produtos por categoria |
| GET | `/api/products/supplier/:supplierId` | Produtos por fornecedor |
| PUT | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Excluir produto |

### 📊 Módulo de Movimentações (`/api/stock-movements`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/stock-movements` | Registrar movimentação |
| GET | `/api/stock-movements` | Listar movimentações |
| GET | `/api/stock-movements/:id` | Buscar por ID |
| GET | `/api/stock-movements/product/:productId` | Por produto |
| GET | `/api/stock-movements/type/:type` | Por tipo |
| GET | `/api/stock-movements/date-range` | Por período |
| GET | `/api/stock-movements/report` | Relatório de estoque |

### 👤 Módulo de Usuários (`/api/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users` | Criar usuário |
| POST | `/api/users/login` | Autenticar |
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar por ID |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Desativar usuário |
| PATCH | `/api/users/:id/password` | Alterar senha |

### 👥 Módulo de Clientes (`/api/clients`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/clients` | Cadastrar cliente |
| GET | `/api/clients` | Listar clientes |
| GET | `/api/clients/debtors` | Clientes devedores |
| GET | `/api/clients/:id` | Buscar por ID |
| PUT | `/api/clients/:id` | Atualizar cliente |
| DELETE | `/api/clients/:id` | Excluir cliente |

### 🛒 Módulo de Vendas (`/api/sales`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/sales` | Registrar venda |
| GET | `/api/sales` | Listar vendas |
| GET | `/api/sales/period` | Vendas por período |
| GET | `/api/sales/daily` | Vendas do dia |
| GET | `/api/sales/summary` | Resumo de vendas |
| GET | `/api/sales/:id` | Buscar por ID |
| POST | `/api/sales/:id/cancel` | Cancelar venda |

### 💰 Módulo Financeiro (`/api/financial`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/financial/accounts` | Criar conta |
| GET | `/api/financial/accounts` | Listar contas |
| GET | `/api/financial/accounts/overdue` | Contas vencidas |
| GET | `/api/financial/accounts/:id` | Buscar por ID |
| POST | `/api/financial/accounts/:id/pay` | Pagar conta |
| POST | `/api/financial/accounts/:id/cancel` | Cancelar conta |
| GET | `/api/financial/summary` | Resumo financeiro |

---

## 📦 Módulos

### 1. Estoque
- Gestão de categorias de produtos
- Cadastro de fornecedores
- Controle de produtos com código de barras
- Movimentações de entrada/saída
- Alertas de estoque baixo
- Controle de validade

### 2. Vendas (PDV)
- Registro de vendas com múltiplos itens
- Desconto por item ou total
- Múltiplas formas de pagamento
- Venda no fiado (crédito cliente)
- Cancelamento com estorno automático

### 3. Clientes
- Cadastro completo com CPF
- Sistema de crédito/fiado
- Limite de crédito configurável
- Histórico de compras
- Gestão de débitos

### 4. Financeiro
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Controle de vencimentos
- Resumo financeiro

### 5. Usuários
- Autenticação
- Níveis de acesso (Admin, Gerente, Caixa, Estoquista)
- Alteração de senha
- Ativação/desativação

---

## 📜 Regras de Negócio

### Estoque
- Produto não pode ter quantidade negativa
- Alerta automático quando estoque ≤ estoque mínimo
- Movimentação de saída reduz estoque automaticamente
- Movimentação de entrada aumenta estoque automaticamente

### Vendas
- Venda requer pelo menos um item
- Forma de pagamento obrigatória
- Venda no fiado adiciona ao débito do cliente
- Cancelamento reverte movimentação de estoque

### Clientes
- CPF único no sistema
- Débito não pode ultrapassar limite de crédito
- Pagamento reduz débito pendente

### Financeiro
- Conta vencida muda status automaticamente
- Pagamento parcial atualiza valor pendente
- Conta cancelada não afeta saldo

---

## 📄 Exemplos de Uso

### Criar Categoria
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Bebidas", "description": "Bebidas em geral"}'
```

### Criar Produto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coca-Cola 2L",
    "barcode": "7894900010015",
    "categoryId": "uuid-categoria",
    "supplierId": "uuid-fornecedor",
    "purchasePrice": 5.50,
    "salePrice": 8.99,
    "quantity": 100,
    "minimumStock": 20
  }'
```

### Registrar Venda
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "uuid-usuario",
    "clientId": "uuid-cliente",
    "paymentMethod": "CREDIT_CARD",
    "items": [
      {"productId": "uuid-produto", "quantity": 2, "unitPrice": 8.99}
    ]
  }'
```

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 👥 Autores

Desenvolvido como projeto acadêmico para demonstração de Clean Architecture em TypeScript.

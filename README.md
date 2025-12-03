# API de Estoque - Supermercado

API RESTful para gerenciamento de estoque de supermercado desenvolvida com **Clean Architecture**, **TypeScript**, **Express** e **Prisma**.

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture**:

```
src/
├── domain/                    # Camada de Domínio (Regras de Negócio)
│   ├── entities/              # Entidades do domínio
│   │   ├── Category.ts
│   │   ├── Supplier.ts
│   │   ├── Product.ts
│   │   └── StockMovement.ts
│   └── repositories/          # Interfaces dos repositórios
│       ├── ICategoryRepository.ts
│       ├── ISupplierRepository.ts
│       ├── IProductRepository.ts
│       └── IStockMovementRepository.ts
│
├── application/               # Camada de Aplicação (Casos de Uso)
│   └── use-cases/
│       ├── CategoryUseCases.ts
│       ├── SupplierUseCases.ts
│       ├── ProductUseCases.ts
│       └── StockMovementUseCases.ts
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── database/
│   │   └── prisma-client.ts
│   └── repositories/          # Implementações dos repositórios
│       ├── PrismaCategoryRepository.ts
│       ├── PrismaSupplierRepository.ts
│       ├── PrismaProductRepository.ts
│       └── PrismaStockMovementRepository.ts
│
├── presentation/              # Camada de Apresentação
│   ├── controllers/
│   │   ├── CategoryController.ts
│   │   ├── SupplierController.ts
│   │   ├── ProductController.ts
│   │   └── StockMovementController.ts
│   └── routes/
│       ├── categoryRoutes.ts
│       ├── supplierRoutes.ts
│       ├── productRoutes.ts
│       └── stockMovementRoutes.ts
│
├── app.ts                     # Configuração do Express
└── server.ts                  # Ponto de entrada
```

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **SQLite** - Banco de dados (pode ser facilmente alterado para PostgreSQL, MySQL, etc.)
- **Zod** - Validação de schemas

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd estoque-api-clean-architecture
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Inicie o servidor:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 🔗 Endpoints da API

### Categorias (`/api/categories`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Listar todas as categorias |
| GET | `/api/categories/:id` | Buscar categoria por ID |
| POST | `/api/categories` | Criar nova categoria |
| PUT | `/api/categories/:id` | Atualizar categoria |
| DELETE | `/api/categories/:id` | Remover categoria |

**Exemplo de body (POST/PUT):**
```json
{
  "name": "Bebidas",
  "description": "Bebidas em geral"
}
```

### Fornecedores (`/api/suppliers`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/suppliers` | Listar todos os fornecedores |
| GET | `/api/suppliers/:id` | Buscar fornecedor por ID |
| POST | `/api/suppliers` | Criar novo fornecedor |
| PUT | `/api/suppliers/:id` | Atualizar fornecedor |
| DELETE | `/api/suppliers/:id` | Remover fornecedor |

**Exemplo de body (POST/PUT):**
```json
{
  "name": "Distribuidora ABC",
  "email": "contato@abc.com",
  "phone": "(11) 99999-9999",
  "address": "Rua das Flores, 123",
  "cnpj": "12.345.678/0001-90"
}
```

### Produtos (`/api/products`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Listar todos os produtos |
| GET | `/api/products/:id` | Buscar produto por ID |
| GET | `/api/products/barcode/:barcode` | Buscar produto por código de barras |
| GET | `/api/products/low-stock` | Listar produtos com estoque baixo |
| GET | `/api/products/expired` | Listar produtos vencidos |
| GET | `/api/products/category/:categoryId` | Listar produtos por categoria |
| GET | `/api/products/supplier/:supplierId` | Listar produtos por fornecedor |
| POST | `/api/products` | Criar novo produto |
| PUT | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Remover produto |

**Query params para filtragem (GET /api/products):**
- `categoryId` - Filtrar por categoria
- `supplierId` - Filtrar por fornecedor
- `isActive` - Filtrar por status (true/false)
- `search` - Buscar por nome, descrição ou código de barras

**Exemplo de body (POST/PUT):**
```json
{
  "name": "Coca-Cola 2L",
  "description": "Refrigerante Coca-Cola 2 litros",
  "barcode": "7894900011517",
  "price": 8.99,
  "costPrice": 6.50,
  "quantity": 100,
  "minQuantity": 20,
  "unit": "UN",
  "categoryId": "uuid-da-categoria",
  "supplierId": "uuid-do-fornecedor",
  "isActive": true,
  "expirationDate": "2024-12-31"
}
```

### Movimentações de Estoque (`/api/stock-movements`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/stock-movements` | Listar todas as movimentações |
| GET | `/api/stock-movements/:id` | Buscar movimentação por ID |
| GET | `/api/stock-movements/report` | Relatório geral do estoque |
| GET | `/api/stock-movements/product/:productId` | Movimentações por produto |
| GET | `/api/stock-movements/type/:type` | Movimentações por tipo |
| GET | `/api/stock-movements/date-range` | Movimentações por período |
| POST | `/api/stock-movements` | Criar nova movimentação |

**Tipos de movimentação:**
- `ENTRY` - Entrada de produtos
- `EXIT` - Saída de produtos (venda)
- `ADJUSTMENT` - Ajuste de estoque
- `LOSS` - Perda/avaria
- `RETURN` - Devolução

**Query params para filtragem (GET /api/stock-movements):**
- `productId` - Filtrar por produto
- `type` - Filtrar por tipo
- `startDate` - Data inicial
- `endDate` - Data final

**Exemplo de body (POST):**
```json
{
  "productId": "uuid-do-produto",
  "type": "ENTRY",
  "quantity": 50,
  "reason": "Compra do fornecedor ABC",
  "unitPrice": 6.50
}
```

## 📊 Relatório de Estoque

O endpoint `GET /api/stock-movements/report` retorna:

```json
{
  "totalProducts": 150,
  "lowStockProducts": 12,
  "totalValue": 45680.50,
  "recentMovements": [...]
}
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor em modo desenvolvimento
npm run build        # Compila o TypeScript
npm start            # Inicia o servidor em produção
npm run prisma:generate  # Gera o cliente Prisma
npm run prisma:migrate   # Executa as migrações
npm run prisma:studio    # Abre o Prisma Studio (interface visual do banco)
```

## 🧪 Testando com Thunder Client

1. Instale a extensão **Thunder Client** no VS Code
2. Crie uma nova requisição
3. Use as rotas documentadas acima
4. Para requisições POST/PUT, adicione o body em formato JSON

## 📝 Exemplos de Uso

### Criar uma categoria
```http
POST http://localhost:3000/api/categories
Content-Type: application/json

{
  "name": "Laticínios",
  "description": "Produtos derivados do leite"
}
```

### Criar um produto
```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Leite Integral 1L",
  "barcode": "7891234567890",
  "price": 5.99,
  "costPrice": 4.50,
  "quantity": 200,
  "minQuantity": 50,
  "categoryId": "ID_DA_CATEGORIA"
}
```

### Registrar entrada de estoque
```http
POST http://localhost:3000/api/stock-movements
Content-Type: application/json

{
  "productId": "ID_DO_PRODUTO",
  "type": "ENTRY",
  "quantity": 100,
  "reason": "Reposição de estoque"
}
```

### Registrar saída de estoque (venda)
```http
POST http://localhost:3000/api/stock-movements
Content-Type: application/json

{
  "productId": "ID_DO_PRODUTO",
  "type": "EXIT",
  "quantity": 5,
  "reason": "Venda"
}
```

## 📄 Licença

ISC

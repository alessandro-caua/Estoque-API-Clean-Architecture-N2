# 🏪 API de Estoque - Clean Architecture

API REST para gerenciamento de estoque de supermercado, construída com Clean Architecture e TypeScript.

## 📦 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM com SQLite
- **Zod** - Validação de dados
- **Clean Architecture** - Arquitetura em camadas

## 🏗️ Arquitetura

```
src/
├── domain/            # Entidades e regras de negócio
│   ├── entities/      # Product, Sale, Client, etc.
│   ├── repositories/  # Interfaces dos repositórios
│   └── errors/        # Erros de domínio
│
├── application/       # Casos de uso
│   ├── use-cases/     # Lógica de aplicação
│   └── dtos/          # DTOs de entrada/saída
│
├── infrastructure/    # Implementações técnicas
│   ├── database/      # Prisma client
│   └── repositories/  # Implementações Prisma
│
└── presentation/      # Controllers e rotas
    ├── controllers/   # HTTP controllers
    ├── routes/        # Rotas Express
    ├── middlewares/   # Middlewares
    └── validators/    # Validadores Zod
```

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📡 Endpoints

### Produtos
- `GET /api/v1/products` - Listar produtos
- `POST /api/v1/products` - Criar produto
- `GET /api/v1/products/:id` - Buscar produto
- `PUT /api/v1/products/:id` - Atualizar produto
- `DELETE /api/v1/products/:id` - Deletar produto

### Categorias
- `GET /api/v1/categories` - Listar categorias
- `POST /api/v1/categories` - Criar categoria

### Fornecedores
- `GET /api/v1/suppliers` - Listar fornecedores
- `POST /api/v1/suppliers` - Criar fornecedor

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Criar cliente

### Usuários
- `GET /api/v1/users` - Listar usuários
- `POST /api/v1/users` - Criar usuário
- `POST /api/v1/users/login` - Autenticar

### Movimentações de Estoque
- `GET /api/v1/stock-movements` - Listar movimentações
- `POST /api/v1/stock-movements` - Criar movimentação

### Vendas
- `GET /api/v1/sales` - Listar vendas
- `POST /api/v1/sales` - Criar venda
- `POST /api/v1/sales/:id/cancel` - Cancelar venda

### Financeiro
- `GET /api/v1/financial` - Listar contas
- `POST /api/v1/financial/payable` - Criar conta a pagar
- `POST /api/v1/financial/receivable` - Criar conta a receber

## 🔍 Exemplos

### Criar Produto
```bash
POST /api/v1/products
Content-Type: application/json

{
  "name": "Arroz 5kg",
  "barcode": "7891234567890",
  "salePrice": 25.90,
  "costPrice": 18.50,
  "quantity": 100,
  "minQuantity": 20,
  "unit": "UNIDADE",
  "categoryId": "uuid-categoria",
  "supplierId": "uuid-fornecedor"
}
```

### Criar Venda
```bash
POST /api/v1/sales
Content-Type: application/json

{
  "clientId": "uuid-cliente",
  "userId": "uuid-usuario",
  "paymentMethod": "DINHEIRO",
  "items": [
    {
      "productId": "uuid-produto",
      "quantity": 2,
      "discount": 0
    }
  ],
  "discount": 0,
  "notes": "Venda via app"
}
```

## 📊 Features

✅ CRUD completo de produtos, categorias, fornecedores, clientes e usuários  
✅ Controle de estoque com movimentações (entrada, saída, ajuste)  
✅ Sistema de vendas com baixa automática de estoque  
✅ Gestão de clientes com controle de débitos (fiado)  
✅ Contas financeiras (a pagar/receber)  
✅ Validação robusta com Zod  
✅ Arquitetura limpa e testável  
✅ Tratamento centralizado de erros  

## 🛠️ Scripts

```bash
npm run dev           # Desenvolvimento com hot-reload
npm run build         # Build TypeScript
npm start             # Produção
npm run prisma:studio # Interface visual do banco
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env`:

```env
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
```

## 🎯 Princípios SOLID

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas por contexto
- **D**ependency Inversion: Dependências via abstrações

## 📚 Camadas

1. **Domain**: Regras de negócio puras (independente de frameworks)
2. **Application**: Casos de uso (orquestra o domínio)
3. **Infrastructure**: Implementações técnicas (Prisma, etc)
4. **Presentation**: Interface HTTP (Express)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT

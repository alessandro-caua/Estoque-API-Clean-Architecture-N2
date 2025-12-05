# 📁 Camada de Apresentação (Presentation Layer)

Esta camada lida com a **interface com o mundo externo**.
Recebe requisições HTTP e retorna respostas JSON.

---

## 🎯 Responsabilidades

A camada de apresentação é responsável por:

1. **Receber Requisições HTTP**
   - Extrair dados do body, params, query

2. **Validar Formato de Entrada**
   - Campos obrigatórios presentes?
   - Tipos corretos?

3. **Chamar os Use Cases**
   - Delegar a lógica de negócio

4. **Formatar Respostas**
   - Converter entidades para JSON
   - Definir status HTTP corretos

5. **Tratar Erros**
   - Converter erros de domínio em respostas HTTP

---

## 📂 Estrutura

```
presentation/
├── controllers/              # Lógica de requisição/resposta
│   ├── ProductController.ts
│   ├── CategoryController.ts
│   ├── SaleController.ts
│   └── index.ts
│
└── routes/                   # Definição de rotas HTTP
    ├── productRoutes.ts
    ├── categoryRoutes.ts
    ├── saleRoutes.ts
    └── index.ts
```

---

## ⚡ O Controller NÃO contém lógica de negócio!

```typescript
// ❌ ERRADO - Lógica de negócio no controller
class ProductController {
  async create(req: Request, res: Response) {
    const { categoryId } = req.body;
    
    // NÃO FAÇA ISSO AQUI!
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    // Isso deveria estar no Use Case!
    const product = await this.productRepo.create(data);
    // ...
  }
}
```

```typescript
// ✅ CORRETO - Controller apenas delega
class ProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async create(req: Request, res: Response) {
    try {
      // 1. Extrai dados da requisição
      const { name, salePrice, costPrice, categoryId } = req.body;

      // 2. Valida formato (não regra de negócio)
      if (!name || salePrice === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      // 3. Chama o Use Case (que contém a lógica)
      const product = await this.createProductUseCase.execute({
        name,
        salePrice,
        costPrice,
        categoryId,
      });

      // 4. Retorna resposta formatada
      return res.status(201).json(product.toJSON());

    } catch (error: any) {
      // 5. Trata erros
      return res.status(400).json({ error: error.message });
    }
  }
}
```

---

## 💡 Exemplo Completo: ProductController

```typescript
import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases';

export class ProductController {
  // Use Cases são injetados via construtor
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    // ... outros use cases
  ) {}

  /**
   * POST /api/products
   * Cria um novo produto
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      // Extrair dados do body
      const data = req.body;

      // Validar campos obrigatórios (formato, não negócio)
      if (!data.name || !data.categoryId) {
        return res.status(400).json({
          error: 'Nome e categoria são obrigatórios'
        });
      }

      // Executar Use Case
      const product = await this.createProductUseCase.execute(data);

      // Retornar sucesso (201 = Created)
      return res.status(201).json(product.toJSON());

    } catch (error: any) {
      // Tratar erros específicos
      if (error.code === 'ENTITY_NOT_FOUND') {
        return res.status(404).json({ error: error.message });
      }
      if (error.code === 'ENTITY_ALREADY_EXISTS') {
        return res.status(409).json({ error: error.message });
      }
      
      // Erro genérico
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /api/products/:id
   * Busca produto por ID
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const product = await this.getProductByIdUseCase.execute(id);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product.toJSON());

    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}
```

---

## 📖 Exemplo: Rotas

```typescript
import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

// Função factory que cria as rotas
export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  // Rotas CRUD básicas
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.findAll(req, res));
  router.get('/:id', (req, res) => controller.findById(req, res));
  router.put('/:id', (req, res) => controller.update(req, res));
  router.delete('/:id', (req, res) => controller.delete(req, res));

  // Rotas especiais
  router.get('/low-stock', (req, res) => controller.findLowStock(req, res));
  router.get('/expired', (req, res) => controller.findExpired(req, res));
  router.get('/barcode/:barcode', (req, res) => controller.findByBarcode(req, res));

  return router;
};
```

---

## 🔄 Mapeamento de Erros para HTTP

| Erro de Domínio | Status HTTP | Quando usar |
|-----------------|-------------|-------------|
| EntityNotFoundError | 404 Not Found | Recurso não existe |
| EntityAlreadyExistsError | 409 Conflict | Duplicidade |
| ValidationError | 400 Bad Request | Dados inválidos |
| InvalidCredentialsError | 401 Unauthorized | Login falhou |
| UnauthorizedOperationError | 403 Forbidden | Sem permissão |
| InsufficientStockError | 400 ou 422 | Regra de negócio |

---

## 🎨 Padrão de Resposta

```typescript
// Sucesso
{
  "id": "uuid-123",
  "name": "Coca-Cola 2L",
  "salePrice": 8.99,
  "quantity": 100
}

// Erro
{
  "error": "Mensagem do erro",
  "code": "ENTITY_NOT_FOUND",  // Opcional
  "details": { ... }          // Opcional
}

// Lista
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

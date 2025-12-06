# 🔍 ANÁLISE COMPLETA DE ARQUITETURA E MELHORIAS

## 📊 RESUMO EXECUTIVO

**Status Geral**: ✅ **8.5/10** - Arquitetura sólida com oportunidades de melhoria

**Pontos Fortes**:
- ✅ Clean Architecture bem implementada
- ✅ Separação clara de responsabilidades
- ✅ Padrão DAO implementado corretamente
- ✅ Sistema robusto de erros
- ✅ Validação com Zod
- ✅ TypeScript strict mode

**Oportunidades de Melhoria**:
- ⚠️ Injeção de dependências manual (pode usar container)
- ⚠️ Controllers com muita lógica de validação
- ⚠️ Falta de testes automatizados
- ⚠️ Configurações hardcoded
- ⚠️ Falta de logging estruturado
- ⚠️ Ausência de autenticação/autorização

---

## 📈 ESTATÍSTICAS DO PROJETO

### Distribuição de Linhas por Camada

```
┌─────────────────────────────────────────────────────────┐
│ CAMADA                    │ LINHAS  │ % DO TOTAL        │
├─────────────────────────────────────────────────────────┤
│ Domain (Entities)         │ 4.315   │ 27.9%  ████████  │
│ Infrastructure (Repos)    │ 1.728   │ 11.2%  ████      │
│ Infrastructure (DAOs)     │ 1.747   │ 11.3%  ████      │
│ Application (Use Cases)   │ 1.701   │ 11.0%  ████      │
│ Application (DTOs)        │ 1.360   │ 8.8%   ███       │
│ Domain (Repositories)     │ 1.337   │ 8.7%   ███       │
│ Presentation (Controllers)│ 1.236   │ 8.0%   ███       │
│ Presentation (Validators) │   719   │ 4.7%   ██        │
│ Domain (Errors)           │   574   │ 3.7%   ██        │
│ Presentation (Routes)     │   457   │ 3.0%   █         │
│ App Configuration         │   433   │ 2.8%   █         │
│ Presentation (Middlewares)│   311   │ 2.0%   █         │
│ Domain (Ports)            │    79   │ 0.5%   █         │
│ Infrastructure (Database) │    16   │ 0.1%   █         │
├─────────────────────────────────────────────────────────┤
│ TOTAL                     │ 15.413  │ 100%             │
└─────────────────────────────────────────────────────────┘
```

### Análise da Distribuição

✅ **BOM**: Domain Layer é a maior (27.9%) - demonstra foco em regras de negócio
✅ **BOM**: Infrastructure bem separada (22.5% total: Repos + DAOs)
⚠️ **ATENÇÃO**: Controllers têm bastante código (1.236 linhas) - podem ter lógica demais

---

## 🏗️ ANÁLISE POR CAMADA

### 1. DOMAIN LAYER (41.7% do código)

#### ✅ Pontos Fortes

**Entidades Ricas** (4.315 linhas):
```typescript
// Entidades com métodos de negócio, não apenas getters/setters
class Product {
  calculateProfitMargin(): number { ... }
  isLowStock(minQuantity: number): boolean { ... }
  canBeSold(): boolean { ... }
}
```

**Sistema de Erros Robusto** (574 linhas):
- Hierarquia bem definida (DomainError → BusinessErrors)
- Erros semânticos específicos
- Facilita debugging e tratamento

**Interfaces de Repository** (1.337 linhas):
- Contratos bem definidos
- Inversão de dependência correta

#### ⚠️ Oportunidades de Melhoria

**1. Separar Entidades em Agregados**

**PROBLEMA**: Entidades grandes com muita responsabilidade

**SOLUÇÃO**: Criar Agregados (Aggregate Roots) seguindo DDD

```
domain/
├── aggregates/
│   ├── Product/
│   │   ├── Product.ts (root)
│   │   ├── ProductCategory.ts (value object)
│   │   └── ProductPrice.ts (value object)
│   ├── Sale/
│   │   ├── Sale.ts (root)
│   │   ├── SaleItem.ts
│   │   └── SalePayment.ts (value object)
│   └── Client/
│       ├── Client.ts (root)
│       ├── ClientCredit.ts (value object)
│       └── ClientAddress.ts (value object)
├── value-objects/
│   ├── Money.ts
│   ├── Email.ts
│   ├── CPF.ts
│   └── Barcode.ts
└── services/
    ├── PriceCalculator.ts
    └── StockValidator.ts
```

**BENEFÍCIO**: 
- Encapsulamento melhor
- Validações em Value Objects
- Reutilização de código
- Facilita testes

**2. Adicionar Domain Events**

**SOLUÇÃO**: Implementar eventos de domínio

```typescript
// domain/events/DomainEvent.ts
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }

  abstract getEventName(): string;
}

// domain/events/ProductCreatedEvent.ts
export class ProductCreatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly productName: string
  ) {
    super(productId);
  }

  getEventName(): string {
    return 'product.created';
  }
}

// Nas entidades
class Product {
  private events: DomainEvent[] = [];

  create(): void {
    // lógica...
    this.events.push(new ProductCreatedEvent(this.id!, this.name));
  }

  getDomainEvents(): DomainEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }
}
```

**BENEFÍCIO**:
- Desacoplamento entre módulos
- Auditoria automática
- Possibilita Event Sourcing futuro
- Facilita integrações

**3. Adicionar Specifications Pattern**

```typescript
// domain/specifications/ProductSpecification.ts
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
}

// domain/specifications/LowStockSpecification.ts
export class LowStockSpecification implements Specification<Product> {
  isSatisfiedBy(product: Product): boolean {
    return product.quantity <= product.minQuantity;
  }
}

// domain/specifications/ExpiredProductSpecification.ts
export class ExpiredProductSpecification implements Specification<Product> {
  isSatisfiedBy(product: Product): boolean {
    if (!product.expirationDate) return false;
    return product.expirationDate < new Date();
  }
}

// Uso
const lowStockSpec = new LowStockSpecification();
const expiredSpec = new ExpiredProductSpecification();
const criticalSpec = lowStockSpec.and(expiredSpec);

if (criticalSpec.isSatisfiedBy(product)) {
  // produto crítico!
}
```

---

### 2. APPLICATION LAYER (19.8% do código)

#### ✅ Pontos Fortes

**Use Cases bem definidos** (1.701 linhas):
- Um caso de uso = uma ação
- Orquestração clara

**DTOs completos** (1.360 linhas):
- Validação centralizada
- Desacoplamento entre camadas

#### ⚠️ Oportunidades de Melhoria

**1. Criar Application Services**

**PROBLEMA**: Use Cases às vezes têm lógica duplicada

**SOLUÇÃO**: Extrair serviços de aplicação

```
application/
├── services/
│   ├── StockService.ts          # Lógica comum de estoque
│   ├── PaymentService.ts        # Processamento de pagamentos
│   ├── NotificationService.ts   # Envio de notificações
│   └── ReportService.ts         # Geração de relatórios
├── use-cases/
│   └── (mantém use cases simples)
└── dtos/
```

**Exemplo - StockService.ts**:
```typescript
export class StockService {
  constructor(
    private productRepo: IProductRepository,
    private stockMovementRepo: IStockMovementRepository,
    private eventDispatcher: IEventDispatcher
  ) {}

  async updateStock(
    productId: string,
    quantity: number,
    type: MovementType,
    reason?: string
  ): Promise<void> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new EntityNotFoundError('Product');

    // Atualiza quantidade
    const newQuantity = type === 'ENTRY' 
      ? product.quantity + quantity 
      : product.quantity - quantity;

    if (newQuantity < 0) {
      throw new InsufficientStockError(product.name, product.quantity, quantity);
    }

    await this.productRepo.updateQuantity(productId, newQuantity);

    // Registra movimentação
    const movement = new StockMovement({ type, productId, quantity, reason });
    await this.stockMovementRepo.create(movement);

    // Dispara evento
    if (newQuantity <= product.minQuantity) {
      this.eventDispatcher.dispatch(new LowStockEvent(productId, newQuantity));
    }
  }
}
```

**USO nos Use Cases**:
```typescript
export class CreateSaleUseCase {
  constructor(
    private saleRepo: ISaleRepository,
    private stockService: StockService  // ← Injeta serviço
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    // ... validações

    // Usa serviço reutilizável
    for (const item of data.items) {
      await this.stockService.updateStock(
        item.productId,
        item.quantity,
        'SALE',
        `Sale #${sale.id}`
      );
    }

    return this.saleRepo.create(sale);
  }
}
```

**2. Implementar Command/Query Separation (CQRS Light)**

**SOLUÇÃO**: Separar comandos de consultas

```
application/
├── commands/                    # Operações que MODIFICAM
│   ├── CreateProductCommand.ts
│   ├── UpdateProductCommand.ts
│   └── handlers/
│       ├── CreateProductHandler.ts
│       └── UpdateProductHandler.ts
├── queries/                     # Operações que LEEM
│   ├── GetProductByIdQuery.ts
│   ├── GetLowStockProductsQuery.ts
│   └── handlers/
│       ├── GetProductByIdHandler.ts
│       └── GetLowStockProductsHandler.ts
└── dtos/
```

**Exemplo**:
```typescript
// application/commands/CreateProductCommand.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly salePrice: number,
    public readonly costPrice: number,
    public readonly categoryId: string
  ) {}
}

// application/commands/handlers/CreateProductHandler.ts
export class CreateProductHandler {
  constructor(
    private productRepo: IProductRepository,
    private categoryRepo: ICategoryRepository
  ) {}

  async handle(command: CreateProductCommand): Promise<string> {
    // Validações
    const category = await this.categoryRepo.findById(command.categoryId);
    if (!category) throw new EntityNotFoundError('Category');

    // Criar entidade
    const product = new Product({
      name: command.name,
      salePrice: command.salePrice,
      costPrice: command.costPrice,
      categoryId: command.categoryId
    });

    // Salvar
    const saved = await this.productRepo.create(product);
    
    return saved.id!;
  }
}

// application/queries/GetProductByIdQuery.ts
export class GetProductByIdQuery {
  constructor(public readonly productId: string) {}
}

// application/queries/handlers/GetProductByIdHandler.ts
export class GetProductByIdHandler {
  constructor(private productRepo: IProductRepository) {}

  async handle(query: GetProductByIdQuery): Promise<ProductDTO | null> {
    const product = await this.productRepo.findById(query.productId);
    return product ? this.toDTO(product) : null;
  }

  private toDTO(product: Product): ProductDTO {
    return {
      id: product.id!,
      name: product.name,
      salePrice: product.salePrice,
      // ...
    };
  }
}
```

**BENEFÍCIO**:
- Separação clara de responsabilidades
- Queries podem ter repositórios otimizados
- Facilita cache em queries
- Escalabilidade (pode ter bancos separados futuramente)

**3. Adicionar Validadores de Negócio**

```typescript
// application/validators/SaleValidator.ts
export class SaleValidator {
  constructor(
    private productRepo: IProductRepository,
    private clientRepo: IClientRepository
  ) {}

  async validate(data: CreateSaleDTO): Promise<ValidationResult> {
    const errors: string[] = [];

    // Valida cliente
    if (data.clientId) {
      const client = await this.clientRepo.findById(data.clientId);
      if (!client) {
        errors.push('Cliente não encontrado');
      } else if (!client.isActive) {
        errors.push('Cliente inativo não pode comprar');
      } else if (data.paymentMethod === 'FIADO') {
        const availableCredit = client.creditLimit - client.currentDebt;
        if (data.total > availableCredit) {
          errors.push(`Crédito insuficiente. Disponível: R$ ${availableCredit}`);
        }
      }
    }

    // Valida produtos
    for (const item of data.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) {
        errors.push(`Produto ${item.productId} não encontrado`);
      } else if (!product.isActive) {
        errors.push(`Produto ${product.name} está inativo`);
      } else if (product.quantity < item.quantity) {
        errors.push(
          `Estoque insuficiente para ${product.name}. ` +
          `Disponível: ${product.quantity}, Solicitado: ${item.quantity}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

---

### 3. INFRASTRUCTURE LAYER (33.8% do código)

#### ✅ Pontos Fortes

**DAOs implementados** (1.747 linhas):
- Separação clara: Repository vs DAO
- Queries especializadas

**Repositories** (1.728 linhas):
- Implementam interfaces do domínio
- Conversão entidade ↔ modelo

#### ⚠️ Oportunidades de Melhoria

**1. Implementar Repository com DAOs**

**PROBLEMA**: Repositories ainda não usam os DAOs criados

**SOLUÇÃO**: Refatorar repositories para usar DAOs

```typescript
// infrastructure/repositories/PrismaProductRepository.ts
export class PrismaProductRepository implements IProductRepository {
  private dao: ProductDAO;  // ← Usar DAO

  constructor(prisma: PrismaClient) {
    this.dao = new ProductDAO(prisma);  // ← Injetar DAO
  }

  async create(product: Product): Promise<Product> {
    // 1. Converter entidade → dados DAO
    const data = {
      name: product.name,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      quantity: product.quantity,
      categoryId: product.categoryId,
    };

    // 2. Usar DAO para persistir
    const saved = await this.dao.create(data);

    // 3. Converter dados → entidade
    return new Product({
      id: saved.id,
      name: saved.name,
      salePrice: saved.salePrice,
      costPrice: saved.costPrice,
      quantity: saved.quantity,
      categoryId: saved.categoryId,
    });
  }

  async findLowStock(minQuantity: number): Promise<Product[]> {
    // Usa método especializado do DAO
    const results = await this.dao.findLowStock(minQuantity);
    return results.map(r => this.toDomain(r));
  }
}
```

**2. Adicionar Unit of Work Pattern**

**SOLUÇÃO**: Gerenciar transações de forma elegante

```typescript
// infrastructure/database/UnitOfWork.ts
export class UnitOfWork {
  constructor(private prisma: PrismaClient) {}

  async execute<T>(work: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return await work(tx);
    });
  }
}

// Uso em Use Case
export class CreateSaleUseCase {
  constructor(
    private unitOfWork: UnitOfWork,
    private saleRepo: ISaleRepository,
    private productRepo: IProductRepository,
    private stockMovementRepo: IStockMovementRepository
  ) {}

  async execute(data: CreateSaleDTO): Promise<Sale> {
    return this.unitOfWork.execute(async (tx) => {
      // Todas operações na mesma transação
      const sale = await this.saleRepo.create(saleData, tx);
      
      for (const item of data.items) {
        await this.productRepo.updateQuantity(
          item.productId, 
          newQuantity,
          tx
        );
        await this.stockMovementRepo.create(movement, tx);
      }

      return sale;
    });
  }
}
```

**3. Adicionar Cache Layer**

```typescript
// infrastructure/cache/CacheProvider.ts
export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// infrastructure/cache/RedisCacheProvider.ts
export class RedisCacheProvider implements ICacheProvider {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
}

// infrastructure/repositories/CachedProductRepository.ts
export class CachedProductRepository implements IProductRepository {
  constructor(
    private baseRepo: PrismaProductRepository,
    private cache: ICacheProvider
  ) {}

  async findById(id: string): Promise<Product | null> {
    // Tenta cache primeiro
    const cached = await this.cache.get<Product>(`product:${id}`);
    if (cached) return cached;

    // Busca no banco
    const product = await this.baseRepo.findById(id);
    
    // Salva em cache
    if (product) {
      await this.cache.set(`product:${id}`, product, 300); // 5 minutos
    }

    return product;
  }

  async create(product: Product): Promise<Product> {
    const saved = await this.baseRepo.create(product);
    
    // Invalida cache relacionado
    await this.cache.delete(`products:all`);
    await this.cache.delete(`category:${product.categoryId}:products`);
    
    return saved;
  }
}
```

---

### 4. PRESENTATION LAYER (17.9% do código)

#### ✅ Pontos Fortes

**Controllers organizados** (1.236 linhas)
**Validators com Zod** (719 linhas)
**Error Handler centralizado** (311 linhas)

#### ⚠️ Oportunidades de Melhoria

**1. Extrair Validações dos Controllers**

**PROBLEMA**: Controllers têm validações inline

```typescript
// ❌ ANTES - Controller com validação
async create(req: Request, res: Response): Promise<Response> {
  const { name, salePrice, costPrice, categoryId } = req.body;

  // Validação manual no controller
  if (!name || !categoryId || salePrice === undefined) {
    return res.status(400).json({
      error: 'Nome, categoria e preço são obrigatórios'
    });
  }

  const product = await this.createProductUseCase.execute({...});
  return res.status(201).json(product);
}
```

**SOLUÇÃO**: Usar middleware de validação

```typescript
// ✅ DEPOIS - Middleware de validação
// presentation/middlewares/validateRequest.ts
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
};

// presentation/routes/productRoutes.ts
router.post(
  '/products',
  validateRequest(createProductSchema),  // ← Middleware
  (req, res) => controller.create(req, res)
);

// Controller limpo
async create(req: Request, res: Response): Promise<Response> {
  // req.body já está validado!
  const product = await this.createProductUseCase.execute(req.body);
  return res.status(201).json(product);
}
```

**2. Implementar Request/Response DTOs**

```typescript
// presentation/dtos/requests/CreateProductRequest.ts
export class CreateProductRequest {
  @IsString()
  @Length(2, 200)
  name!: string;

  @IsNumber()
  @Min(0.01)
  salePrice!: number;

  @IsNumber()
  @Min(0)
  costPrice!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;
}

// presentation/dtos/responses/ProductResponse.ts
export class ProductResponse {
  id!: string;
  name!: string;
  salePrice!: number;
  costPrice!: number;
  profitMargin!: number;
  isLowStock!: boolean;
  category!: {
    id: string;
    name: string;
  };

  static fromDomain(product: Product): ProductResponse {
    return {
      id: product.id!,
      name: product.name,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      profitMargin: product.calculateProfitMargin(),
      isLowStock: product.isLowStock(product.minQuantity),
      category: {
        id: product.category?.id!,
        name: product.category?.name!
      }
    };
  }
}
```

**3. Adicionar Rate Limiting e Autenticação**

```typescript
// presentation/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de requisições
  message: 'Muitas requisições, tente novamente mais tarde'
});

// presentation/middlewares/authentication.ts
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// presentation/middlewares/authorization.ts
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    next();
  };
};

// Uso nas rotas
router.post(
  '/products',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  validateRequest(createProductSchema),
  (req, res) => controller.create(req, res)
);
```

---

## 🔧 MELHORIAS GERAIS

### 1. Container de Injeção de Dependências

**PROBLEMA**: app.ts tem 462 linhas criando dependências manualmente

**SOLUÇÃO**: Usar container (TSyringe, InversifyJS)

```typescript
// infrastructure/di/container.ts
import { container } from 'tsyringe';

// Registrar dependências
export function setupContainer() {
  // Prisma
  container.registerSingleton('PrismaClient', () => prisma);

  // DAOs
  container.register('ProductDAO', {
    useFactory: (c) => new ProductDAO(c.resolve('PrismaClient'))
  });

  // Repositories
  container.register<IProductRepository>('IProductRepository', {
    useFactory: (c) => new PrismaProductRepository(
      c.resolve('PrismaClient')
    )
  });

  // Use Cases
  container.register('CreateProductUseCase', {
    useFactory: (c) => new CreateProductUseCase(
      c.resolve('IProductRepository'),
      c.resolve('ICategoryRepository'),
      c.resolve('ISupplierRepository')
    )
  });

  // Controllers
  container.register('ProductController', {
    useFactory: (c) => new ProductController(
      c.resolve('CreateProductUseCase'),
      c.resolve('GetProductByIdUseCase'),
      // ...
    )
  });
}

// app.ts (simplificado!)
export function createApp(): Application {
  setupContainer();
  
  const app = express();
  app.use(express.json());

  // Resolve controllers do container
  const productController = container.resolve<ProductController>('ProductController');
  
  app.use('/api/products', createProductRoutes(productController));

  return app;
}
```

### 2. Configuração Centralizada

```typescript
// config/index.ts
export const config = {
  app: {
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    name: 'Estoque API',
    version: '2.0.0'
  },
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  }
};
```

### 3. Logging Estruturado

```typescript
// infrastructure/logging/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Uso nos Use Cases
export class CreateProductUseCase {
  async execute(data: CreateProductDTO): Promise<Product> {
    logger.info('Creating product', { name: data.name, categoryId: data.categoryId });
    
    try {
      const product = await this.productRepo.create(productEntity);
      logger.info('Product created successfully', { productId: product.id });
      return product;
    } catch (error) {
      logger.error('Failed to create product', { error, data });
      throw error;
    }
  }
}
```

### 4. Health Checks

```typescript
// presentation/routes/healthRoutes.ts
import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {
      database: 'OK',
      redis: 'OK'
    }
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    health.checks.database = 'ERROR';
    health.status = 'DEGRADED';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

healthRoutes.get('/health/live', (req, res) => {
  res.json({ status: 'OK' });
});

healthRoutes.get('/health/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'READY' });
  } catch {
    res.status(503).json({ status: 'NOT_READY' });
  }
});
```

---

## 📋 PLANO DE AÇÃO PRIORITIZADO

### 🔥 PRIORIDADE ALTA (Fazer AGORA)

1. **Implementar Autenticação/Autorização** (Segurança)
   - JWT tokens
   - Middleware de autenticação
   - Controle de permissões por role

2. **Integrar DAOs nos Repositories** (Já criado, falta usar)
   - Refatorar repositories para usar DAOs
   - Benefício imediato: código mais limpo

3. **Adicionar Testes Unitários** (Qualidade)
   - Testar entidades
   - Testar use cases
   - Testar repositories

### ⚡ PRIORIDADE MÉDIA (Próximos passos)

4. **Container de DI** (Manutenibilidade)
   - TSyringe ou InversifyJS
   - Simplifica app.ts drasticamente

5. **Logging Estruturado** (Observabilidade)
   - Winston ou Pino
   - Facilita debugging em produção

6. **Configuração Centralizada** (Organização)
   - Variáveis de ambiente
   - Diferentes ambientes (dev/prod)

7. **Domain Events** (Desacoplamento)
   - Separar módulos via eventos
   - Facilita auditoria

### 🎯 PRIORIDADE BAIXA (Melhorias futuras)

8. **Value Objects** (DDD)
   - Money, Email, CPF, etc.
   - Melhor encapsulamento

9. **CQRS Light** (Escalabilidade)
   - Separar commands/queries
   - Otimizar leituras

10. **Cache Layer** (Performance)
    - Redis para queries frequentes
    - Invalidação inteligente

11. **Specification Pattern** (Queries complexas)
    - Queries reutilizáveis
    - Combináveis

12. **API Documentation** (Developer Experience)
    - Swagger/OpenAPI
    - Facilita integração

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS DAS MELHORIAS

### Estrutura Atual
```
src/
├── domain/              (41.7%)
├── application/         (19.8%)
├── infrastructure/      (33.8%)
└── presentation/        (17.9%)
```

### Estrutura Proposta
```
src/
├── domain/
│   ├── aggregates/          # ⭐ NOVO
│   ├── value-objects/       # ⭐ NOVO
│   ├── services/            # ⭐ NOVO
│   ├── events/              # ⭐ NOVO
│   ├── specifications/      # ⭐ NOVO
│   ├── errors/
│   └── repositories/
├── application/
│   ├── commands/            # ⭐ NOVO (CQRS)
│   ├── queries/             # ⭐ NOVO (CQRS)
│   ├── services/            # ⭐ NOVO
│   ├── validators/          # ⭐ NOVO
│   └── dtos/
├── infrastructure/
│   ├── persistence/
│   │   ├── daos/
│   │   ├── repositories/
│   │   └── uow/             # ⭐ NOVO (Unit of Work)
│   ├── cache/               # ⭐ NOVO
│   ├── logging/             # ⭐ NOVO
│   ├── events/              # ⭐ NOVO (Event Bus)
│   └── di/                  # ⭐ NOVO (DI Container)
├── presentation/
│   ├── controllers/
│   ├── middlewares/
│   │   ├── auth.ts          # ⭐ NOVO
│   │   ├── rateLimiter.ts   # ⭐ NOVO
│   │   └── validate.ts      # ⭐ NOVO
│   ├── routes/
│   ├── validators/
│   └── dtos/                # ⭐ NOVO (Request/Response)
├── config/                  # ⭐ NOVO
└── tests/                   # ⭐ NOVO
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## ✅ CONCLUSÃO

### Status Atual: 8.5/10

Seu projeto está **MUITO BOM**! A arquitetura Clean Architecture está bem implementada e o código é organizado. Os principais pontos são:

**Excelente**:
- ✅ Separação clara de camadas
- ✅ Domain-driven design bem aplicado
- ✅ Padrão DAO implementado
- ✅ Sistema de erros robusto
- ✅ TypeScript strict

**Pode Melhorar**:
- ⚠️ Falta autenticação (crítico para produção)
- ⚠️ Falta testes (qualidade)
- ⚠️ Container DI manual (manutenibilidade)
- ⚠️ Sem logging estruturado (observabilidade)
- ⚠️ Configurações hardcoded

### Recomendação Final

**Para colocar em PRODUÇÃO**:
1. Implementar autenticação/autorização (OBRIGATÓRIO)
2. Adicionar testes (mínimo 70% coverage)
3. Logging estruturado
4. Health checks
5. Variáveis de ambiente

**Para melhorar ARQUITETURA**:
1. Domain Events
2. CQRS Light
3. Value Objects
4. Container DI
5. Cache layer

O projeto tem uma **base sólida** e com as melhorias sugeridas chegaria facilmente a **9.5/10** e estaria pronto para produção enterprise-level! 🚀

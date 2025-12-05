# 🏗️ Clean Architecture - Guia de Estudo

## Visão Geral

Este projeto implementa a **Clean Architecture** (Arquitetura Limpa),
criada por Robert C. Martin (Uncle Bob).

---

## 🎯 Diagrama das Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRAMEWORKS & DRIVERS                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  INTERFACE ADAPTERS                        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              APPLICATION BUSINESS RULES              │  │  │
│  │  │  ┌─────────────────────────────────────────────┐    │  │  │
│  │  │  │         ENTERPRISE BUSINESS RULES            │    │  │  │
│  │  │  │                                              │    │  │  │
│  │  │  │              🎯 ENTITIES                     │    │  │  │
│  │  │  │         (Product, Sale, Client)              │    │  │  │
│  │  │  │                                              │    │  │  │
│  │  │  └─────────────────────────────────────────────┘    │  │  │
│  │  │                                                      │  │  │
│  │  │                  📋 USE CASES                        │  │  │
│  │  │         (CreateProduct, RegisterSale)                │  │  │
│  │  │                                                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │    🔌 CONTROLLERS          🗄️ REPOSITORIES                │  │
│  │    (ProductController)     (PrismaProductRepository)       │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│    🌐 EXPRESS       🗃️ PRISMA       📱 REACT (se houver)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
src/
├── domain/                 # 🎯 NÚCLEO - Regras de Negócio
│   ├── entities/          # Entidades (Product, Sale, Client)
│   ├── errors/            # Erros de domínio personalizados
│   ├── ports/             # Índice de interfaces
│   └── repositories/      # Interfaces (contratos)
│
├── application/            # 📋 CASOS DE USO
│   ├── dtos/              # Data Transfer Objects
│   └── use-cases/         # Casos de uso por entidade
│       ├── category/
│       ├── product/
│       └── sale/
│
├── infrastructure/         # 🗄️ IMPLEMENTAÇÕES EXTERNAS
│   ├── database/          # Conexão com banco (Prisma)
│   └── repositories/      # Repositórios concretos
│
├── presentation/           # 🔌 INTERFACE WEB
│   ├── controllers/       # Controladores HTTP
│   └── routes/            # Definição de rotas
│
├── app.ts                  # Composição/Injeção de Dependências
└── server.ts              # Ponto de entrada
```

---

## ⚡ A Regra de Dependência

> **As dependências devem apontar SEMPRE para dentro!**

```
Frameworks → Controllers → Use Cases → Entities
    ↑            ↑            ↑           ↑
  BORDA        BORDA       NÚCLEO      NÚCLEO
```

- ✅ Controller pode usar Use Case
- ✅ Use Case pode usar Entity
- ❌ Entity NÃO pode usar Controller
- ❌ Use Case NÃO pode usar Express

---

## 🔄 Fluxo de uma Requisição

```
1. [HTTP Request]
      │
      ▼
2. [Route] ────────────────► Define qual controller chamar
      │
      ▼
3. [Controller] ───────────► Extrai dados, valida formato
      │
      ▼
4. [Use Case] ─────────────► Aplica regras de negócio
      │
      ▼
5. [Repository] ───────────► Acessa banco de dados
      │
      ▼
6. [Database] ─────────────► Persiste/Busca dados
      │
      ▼
7. [Response] ◄────────────── Retorna ao cliente
```

---

## 💡 Princípios Aplicados

### 1. Inversão de Dependência (DIP)
```typescript
// ✅ Use Case depende de INTERFACE (abstração)
class CreateProductUseCase {
  constructor(private productRepo: IProductRepository) {}
}

// ❌ NÃO depender de implementação concreta
class CreateProductUseCase {
  constructor(private productRepo: PrismaProductRepository) {}
}
```

### 2. Responsabilidade Única (SRP)
```typescript
// ✅ Um Use Case = Uma Ação
class CreateProductUseCase { ... }
class UpdateProductUseCase { ... }
class DeleteProductUseCase { ... }

// ❌ Tudo junto
class ProductUseCase {
  create() { }
  update() { }
  delete() { }
}
```

### 3. Separação de Preocupações
```
Controller → Só lida com HTTP
Use Case   → Só lida com lógica de negócio  
Repository → Só lida com banco de dados
Entity     → Só lida com regras fundamentais
```

---

## 📖 Benefícios Dessa Arquitetura

| Benefício | Explicação |
|-----------|------------|
| **Testabilidade** | Cada camada pode ser testada isoladamente |
| **Manutenibilidade** | Fácil encontrar onde alterar código |
| **Flexibilidade** | Trocar tecnologia sem afetar o núcleo |
| **Escalabilidade** | Adicionar funcionalidades sem quebrar as existentes |
| **Organização** | Código previsível e bem estruturado |

---

## 🔧 Onde Colocar o Quê?

| Situação | Camada |
|----------|--------|
| Validar se preço é positivo | Entity (domínio) |
| Verificar se categoria existe antes de criar produto | Use Case (aplicação) |
| Converter Product para JSON | Controller (apresentação) |
| Fazer query no PostgreSQL | Repository (infraestrutura) |
| Verificar campos obrigatórios no request | Controller (apresentação) |
| Calcular margem de lucro | Entity (domínio) |
| Decidir status HTTP da resposta | Controller (apresentação) |

---

## 🚀 Como Testar Cada Camada

### Entities (Domínio)
```typescript
test('Product - preço não pode ser negativo', () => {
  expect(() => {
    new Product({ name: 'Teste', salePrice: -10 });
  }).toThrow('Preço não pode ser negativo');
});
```

### Use Cases (Aplicação)
```typescript
test('CreateProduct - categoria deve existir', async () => {
  // Mock do repositório
  const mockCategoryRepo = {
    findById: jest.fn().mockResolvedValue(null),
  };

  const useCase = new CreateProductUseCase(
    mockProductRepo,
    mockCategoryRepo,
  );

  await expect(useCase.execute({ categoryId: 'inexistente' }))
    .rejects.toThrow('Categoria não encontrada');
});
```

### Controllers (Apresentação)
```typescript
test('POST /products - retorna 400 se nome faltando', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({ salePrice: 10 }); // Sem nome

  expect(response.status).toBe(400);
  expect(response.body.error).toContain('obrigatório');
});
```

---

## 📚 Leitura Recomendada

1. **Clean Architecture** - Robert C. Martin (Uncle Bob)
2. **Domain-Driven Design** - Eric Evans
3. **Implementing DDD** - Vaughn Vernon

---

## 🎓 Resumo para Prova

1. **Entidades** = Regras de negócio mais fundamentais
2. **Use Cases** = Orquestram o fluxo de dados
3. **Controllers** = Lidam com HTTP/JSON
4. **Repositories** = Acessam banco de dados
5. **Dependências** = Sempre apontam para DENTRO
6. **Interfaces** = Ficam no DOMÍNIO, implementações na INFRAESTRUTURA

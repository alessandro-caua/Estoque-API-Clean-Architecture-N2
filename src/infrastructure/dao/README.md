// ============================================================================
// DAO README - EXPLICAÇÃO DA CAMADA DAO
// ============================================================================

# 📁 Camada DAO (Data Access Object)

Camada responsável por **acesso direto ao banco de dados**.

---

## 🎯 O que é DAO?

**DAO (Data Access Object)** é um padrão que:
- Isola operações de banco de dados
- Fornece interface para CRUD básico
- Trabalha com modelos do Prisma
- É usado pelos Repositories

---

## 🔄 Fluxo de Dados

```
Controller → Use Case → Repository → DAO → Prisma → Banco
   ↓            ↓           ↓          ↓       ↓
 HTTP         Lógica    Entidade    Queries  SQLite
Request      Negócio   Domínio     SQL/ORM
```

---

## 📊 DAO vs Repository

| Aspecto | DAO | Repository |
|---------|-----|------------|
| **Responsabilidade** | Acesso a dados | Gerenciar entidades |
| **Trabalha com** | Modelos Prisma | Entidades de Domínio |
| **Operações** | create, update, delete | save, find, remove |
| **Conhece** | Banco de dados | Lógica de negócio |
| **Camada** | Infraestrutura | Entre Domain e Infra |

---

## 💡 Exemplo Prático

### DAO (ProductDAO)
```typescript
class ProductDAO {
  async create(data: ProductCreateInput): Promise<PrismaProduct> {
    // Executa query no banco
    return this.prisma.product.create({ data });
  }
}
```

### Repository (PrismaProductRepository)
```typescript
class PrismaProductRepository {
  constructor(private dao: ProductDAO) {}

  async create(product: Product): Promise<Product> {
    // 1. Converte entidade de domínio → dados Prisma
    const prismaData = this.toPrismaData(product);
    
    // 2. Usa DAO para salvar no banco
    const saved = await this.dao.create(prismaData);
    
    // 3. Converte dados Prisma → entidade de domínio
    return this.toDomainEntity(saved);
  }
}
```

---

## 🏗 Benefícios

1. **Separação de Responsabilidades**
   - DAO: Como acessar o banco
   - Repository: O que fazer com os dados

2. **Facilita Testes**
   - Mock do DAO é mais simples
   - Testa lógica sem banco real

3. **Reutilização**
   - Múltiplos repositories podem usar o mesmo DAO
   - Operações comuns centralizadas

4. **Manutenção**
   - Mudança no banco? Altera só o DAO
   - Mudança na entidade? Altera só o Repository

---

## 📁 Estrutura

```
infrastructure/
└── dao/
    ├── IBaseDAO.ts         # Interface genérica
    ├── ProductDAO.ts       # DAO de Produto
    ├── CategoryDAO.ts      # DAO de Categoria
    └── index.ts            # Exportações
```

---

## 🎓 Quando Usar

**Use DAO quando:**
- ✅ Projeto médio/grande
- ✅ Múltiplas fontes de dados
- ✅ Necessita testes isolados
- ✅ Equipe grande

**Não precisa de DAO quando:**
- ❌ Projeto pequeno/simples
- ❌ Uma única fonte de dados
- ❌ Prototipagem rápida

---

## 🔗 Relacionamento com outras camadas

```
┌─────────────────────────────────────┐
│   PRESENTATION (Controllers)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   APPLICATION (Use Cases)           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   DOMAIN (Entities + Interfaces)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   REPOSITORY (Implementações)       │  ← Usa DAO
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   DAO (Acesso a Dados)             │  ← NOVO!
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   PRISMA (ORM)                      │
└─────────────────────────────────────┘
              ↓
         [ DATABASE ]
```

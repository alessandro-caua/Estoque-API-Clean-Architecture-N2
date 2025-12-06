// ============================================================================
// DAO (DATA ACCESS OBJECT) - INTERFACE BASE
// ============================================================================
// 
// CONCEITO: DAO (Data Access Object)
// ==================================
// 
// DAO é um padrão de design que fornece uma interface abstrata para
// operações de banco de dados, isolando os detalhes de acesso a dados
// da lógica de negócio.
// 
// DIFERENÇA: DAO vs REPOSITORY
// =============================
// 
// DAO (Data Access Object):
// - Foco em OPERAÇÕES DE BANCO DE DADOS
// - Trabalha com TABELAS e SQL/ORM
// - Mais próximo da camada de infraestrutura
// - Operações: insert, update, delete, select
// - Exemplo: "Executar query no banco"
// 
// REPOSITORY (Repositório):
// - Foco em COLEÇÕES DE OBJETOS DE DOMÍNIO
// - Trabalha com ENTIDADES do negócio
// - Mais próximo da camada de domínio
// - Operações: save, find, remove
// - Exemplo: "Buscar produto por ID"
// 
// ANALOGIA:
// Repository é como uma "estante de livros" (você pega/coloca livros)
// DAO é como o "mecanismo da estante" (parafusos, madeira, estrutura)
// 
// NESTE PROJETO:
// - DAO: Camada de acesso direto ao Prisma
// - Repository: Usa DAOs + lógica de mapeamento
// 
// ============================================================================

/**
 * Interface genérica para operações CRUD básicas de DAO
 * 
 * @template TModel - Tipo do modelo do Prisma (ex: Product, Category)
 * @template TCreateInput - Tipo de dados para criação
 * @template TUpdateInput - Tipo de dados para atualização
 * @template TWhereInput - Tipo de filtros de busca
 * 
 * @example
 * ```typescript
 * // Exemplo de DAO concreto
 * class ProductDAO implements IBaseDAO<Product, CreateProductInput, UpdateProductInput, WhereProductInput> {
 *   async create(data: CreateProductInput): Promise<Product> {
 *     return prisma.product.create({ data });
 *   }
 * }
 * ```
 */
export interface IBaseDAO<TModel, TCreateInput, TUpdateInput, TWhereInput> {
  /**
   * Cria um novo registro no banco
   * @param data - Dados para criação
   * @returns Promise com o registro criado
   */
  create(data: TCreateInput): Promise<TModel>;

  /**
   * Busca um único registro por ID
   * @param id - Identificador único
   * @returns Promise com o registro ou null
   */
  findById(id: string): Promise<TModel | null>;

  /**
   * Busca um único registro por filtros
   * @param where - Condições de busca
   * @returns Promise com o registro ou null
   */
  findOne(where: TWhereInput): Promise<TModel | null>;

  /**
   * Busca múltiplos registros com filtros
   * @param where - Condições de busca (opcional)
   * @returns Promise com array de registros
   */
  findMany(where?: TWhereInput): Promise<TModel[]>;

  /**
   * Atualiza um registro existente
   * @param id - Identificador do registro
   * @param data - Dados para atualização
   * @returns Promise com o registro atualizado
   */
  update(id: string, data: TUpdateInput): Promise<TModel>;

  /**
   * Remove um registro
   * @param id - Identificador do registro
   * @returns Promise void
   */
  delete(id: string): Promise<void>;

  /**
   * Conta registros com filtros
   * @param where - Condições de busca (opcional)
   * @returns Promise com o total de registros
   */
  count(where?: TWhereInput): Promise<number>;

  /**
   * Verifica se um registro existe
   * @param where - Condições de busca
   * @returns Promise com boolean
   */
  exists(where: TWhereInput): Promise<boolean>;
}

/**
 * Interface DAO com suporte a transações
 * 
 * @description
 * Alguns DAOs precisam executar múltiplas operações atomicamente.
 * Esta interface adiciona suporte a transações.
 * 
 * @example
 * ```typescript
 * await dao.transaction(async (tx) => {
 *   await tx.product.update(...);
 *   await tx.stock.create(...);
 *   // Se qualquer operação falhar, todas são revertidas
 * });
 * ```
 */
export interface ITransactionalDAO {
  /**
   * Executa operações dentro de uma transação
   * @param callback - Função com as operações transacionais
   * @returns Promise com o resultado
   */
  transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}

/**
 * Interface DAO com suporte a paginação
 */
export interface IPaginatableDAO {
  /**
   * Busca registros paginados
   * @param page - Número da página (inicia em 1)
   * @param limit - Quantidade por página
   * @param where - Filtros opcionais
   * @returns Promise com dados paginados
   */
  findPaginated<TModel, TWhereInput>(
    page: number,
    limit: number,
    where?: TWhereInput
  ): Promise<{
    data: TModel[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}

/**
 * Interface DAO com operações de busca avançada
 */
export interface ISearchableDAO<TModel> {
  /**
   * Busca por texto em múltiplos campos
   * @param searchTerm - Termo de busca
   * @param fields - Campos para buscar
   * @returns Promise com array de registros
   */
  search(searchTerm: string, fields: string[]): Promise<TModel[]>;
}

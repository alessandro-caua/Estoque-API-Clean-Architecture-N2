// ============================================================================
// USE CASE: CRIAR CATEGORIA
// ============================================================================
// 
// Este arquivo contém um único Use Case (Caso de Uso).
// 
// O QUE É UM USE CASE?
// ====================
// 
// Um Use Case representa UMA AÇÃO específica que o sistema executa.
// É uma "história" do ponto de vista do usuário.
// 
// Exemplo: "Eu, como gerente, quero criar uma categoria de produtos"
// 
// RESPONSABILIDADES DO USE CASE:
// 1. Receber dados de entrada (DTO)
// 2. Aplicar regras de negócio
// 3. Orquestrar entidades e repositórios
// 4. Retornar resultado
// 
// O QUE O USE CASE NÃO DEVE FAZER:
// - Não conhece HTTP, JSON, Express (isso é do Controller)
// - Não conhece Prisma, SQL, MongoDB (isso é do Repository)
// - Não valida formato de dados (isso é do DTO/Controller)
// 
// PRINCÍPIO: Single Responsibility (Responsabilidade Única)
// Cada Use Case faz UMA coisa. Isso facilita:
// - Entender o que o código faz
// - Testar isoladamente
// - Reutilizar em outros contextos
// 
// ============================================================================

// Importa a entidade Category da camada de DOMÍNIO
// A entidade contém as regras de negócio fundamentais
import { Category } from '../../../domain/entities/Category';

// Importa a INTERFACE do repositório (Port)
// Note que importamos a interface, não a implementação!
// Isso é a Inversão de Dependência em ação.
import { ICategoryRepository } from '../../../domain/ports';

// Importa o DTO (Data Transfer Object)
// DTOs definem exatamente quais dados este Use Case aceita
import { CreateCategoryDTO } from '../../dtos';

// Importa os erros de domínio personalizados
// Erros específicos são melhores que erros genéricos
import { EntityAlreadyExistsError } from '../../../domain/errors';

/**
 * Use Case: Criar uma nova categoria de produtos
 * 
 * @description
 * Este Use Case é responsável por criar categorias no sistema.
 * Categorias são usadas para organizar produtos (ex: Bebidas, Laticínios).
 * 
 * FLUXO DE EXECUÇÃO:
 * 1. Recebe dados do Controller via DTO
 * 2. Verifica se já existe categoria com mesmo nome
 * 3. Cria a entidade Category (validação automática)
 * 4. Persiste no repositório
 * 5. Retorna a categoria criada
 * 
 * REGRAS DE NEGÓCIO:
 * - Nome da categoria deve ser único
 * - Nome deve ter no mínimo 2 caracteres (validado na entidade)
 * 
 * @example
 * ```typescript
 * // No Controller ou teste:
 * const useCase = new CreateCategoryUseCase(categoryRepository);
 * 
 * const category = await useCase.execute({
 *   name: 'Bebidas',
 *   description: 'Refrigerantes, sucos e águas'
 * });
 * 
 * console.log(category.id); // UUID gerado
 * ```
 */
export class CreateCategoryUseCase {
  /**
   * Repositório injetado via construtor
   * 
   * CONCEITO: Dependency Injection (Injeção de Dependência)
   * ========================================================
   * 
   * Em vez de criar o repositório aqui dentro:
   *   ❌ this.repo = new PrismaCategoryRepository();
   * 
   * Recebemos ele pronto de fora:
   *   ✅ constructor(private categoryRepository: ICategoryRepository)
   * 
   * Benefícios:
   * 1. Fácil trocar implementação (Prisma -> MongoDB)
   * 2. Fácil criar mocks para testes
   * 3. Use Case não depende de tecnologia específica
   * 
   * Note que o tipo é ICategoryRepository (interface),
   * não PrismaCategoryRepository (implementação).
   */
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a criação da categoria
   * 
   * @param data - DTO com os dados da categoria
   * @returns Promise com a categoria criada
   * @throws EntityAlreadyExistsError se já existir categoria com mesmo nome
   * @throws Error se a validação da entidade falhar
   */
  async execute(data: CreateCategoryDTO): Promise<Category> {
    // =========================================================================
    // PASSO 1: Verificar regra de negócio (nome único)
    // =========================================================================
    // Antes de criar, verificamos se já existe.
    // Esta é uma regra de NEGÓCIO, não de validação de formato.
    
    const existingCategory = await this.categoryRepository.findByName(data.name);
    
    if (existingCategory) {
      // Lançamos erro específico de domínio
      // O Controller vai capturar e retornar HTTP 409 (Conflict)
      throw new EntityAlreadyExistsError('Categoria', 'nome', data.name);
    }

    // =========================================================================
    // PASSO 2: Criar a entidade
    // =========================================================================
    // A entidade Category valida os dados no construtor.
    // Se o nome for inválido (< 2 chars), vai lançar erro aqui.
    
    const category = new Category({
      name: data.name,
      description: data.description,
    });

    // =========================================================================
    // PASSO 3: Persistir no repositório
    // =========================================================================
    // O repositório cuida de salvar no banco de dados.
    // Não sabemos (e não queremos saber) se é SQL, Mongo, arquivo, etc.
    
    const savedCategory = await this.categoryRepository.create(category);

    // =========================================================================
    // PASSO 4: Retornar resultado
    // =========================================================================
    // Retornamos a entidade com ID gerado pelo banco
    
    return savedCategory;
  }
}

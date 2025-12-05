// ============================================================================
// USE CASES: CATEGORY (CATEGORIA)
// ============================================================================
// Casos de uso para operações com categorias de produtos.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// CONCEITO: Use Case (Caso de Uso)
// ================================
// Um Use Case representa uma ação que o usuário pode fazer no sistema.
// Ele orquestra entidades e repositórios para executar a lógica de negócio.
// 
// REGRA: Um Use Case deve fazer apenas UMA coisa (Single Responsibility)
// 
// Requisitos atendidos:
// - RF01: Cadastro de produtos (categorização)
// - RF02: Organização e classificação de produtos
// ============================================================================

import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

// Importando DTOs da pasta centralizada
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos';

// Importando erros de domínio específicos
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError 
} from '../../domain/errors';

// Re-exportando DTOs para manter compatibilidade com imports existentes
export { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos';

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Categoria
 * @description Cria uma nova categoria validando unicidade do nome
 * @example
 * ```typescript
 * const createCategory = new CreateCategoryUseCase(categoryRepository);
 * const category = await createCategory.execute({
 *   name: 'Bebidas',
 *   description: 'Refrigerantes, sucos e águas'
 * });
 * ```
 */
export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a criação da categoria
   * @param data - Dados da categoria a criar
   * @returns Promise com a categoria criada
   * @throws EntityAlreadyExistsError se já existir categoria com mesmo nome
   */
  async execute(data: CreateCategoryDTO): Promise<Category> {
    // Verifica se já existe categoria com este nome
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new EntityAlreadyExistsError('Categoria', 'nome', data.name);
    }

    // Cria a entidade (validação automática no construtor)
    const category = new Category({
      name: data.name,
      description: data.description,
    });

    // Persiste no banco
    return this.categoryRepository.create(category);
  }
}

/**
 * Caso de Uso: Buscar Categoria por ID
 * @description Busca uma categoria específica pelo seu identificador
 */
export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a busca
   * @param id - ID da categoria
   * @returns Promise com a categoria ou null se não encontrada
   */
  async execute(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Todas as Categorias
 * @description Retorna todas as categorias cadastradas
 */
export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a listagem
   * @returns Promise com array de categorias
   */
  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}

/**
 * Caso de Uso: Atualizar Categoria
 * @description Atualiza os dados de uma categoria existente
 */
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a atualização
   * @param id - ID da categoria a atualizar
   * @param data - Novos dados
   * @returns Promise com a categoria atualizada
   * @throws EntityNotFoundError se categoria não encontrada
   * @throws EntityAlreadyExistsError se nome duplicado
   */
  async execute(id: string, data: UpdateCategoryDTO): Promise<Category> {
    // Verifica se a categoria existe
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new EntityNotFoundError('Categoria', id);
    }

    // Se está alterando o nome, verifica duplicidade
    if (data.name && data.name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(data.name);
      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new EntityAlreadyExistsError('Categoria', 'nome', data.name);
      }
    }

    return this.categoryRepository.update(id, data);
  }
}

/**
 * Caso de Uso: Excluir Categoria
 * @description Remove uma categoria do sistema
 */
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Executa a exclusão
   * @param id - ID da categoria a excluir
   * @throws EntityNotFoundError se categoria não encontrada
   */
  async execute(id: string): Promise<void> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new EntityNotFoundError('Categoria', id);
    }

    return this.categoryRepository.delete(id);
  }
}

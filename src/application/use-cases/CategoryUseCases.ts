// Use Cases de Category - Camada de Aplicação
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';

// DTOs
export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

// Create Category Use Case
export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new Error('Já existe uma categoria com este nome');
    }

    const category = new Category({
      name: data.name,
      description: data.description,
    });

    return this.categoryRepository.create(category);
  }
}

// Get Category By Id Use Case
export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }
}

// Get All Categories Use Case
export class GetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}

// Update Category Use Case
export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Categoria não encontrada');
    }

    if (data.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(data.name);
      if (categoryWithSameName && categoryWithSameName.id !== id) {
        throw new Error('Já existe uma categoria com este nome');
      }
    }

    return this.categoryRepository.update(id, data);
  }
}

// Delete Category Use Case
export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Categoria não encontrada');
    }

    return this.categoryRepository.delete(id);
  }
}

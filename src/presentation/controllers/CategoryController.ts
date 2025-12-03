// Controller de Category - Camada de Apresentação
import { Request, Response } from 'express';
import {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '../../application/use-cases/CategoryUseCases';

export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const category = await this.createCategoryUseCase.execute({
        name,
        description,
      });

      return res.status(201).json(category.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const category = await this.getCategoryByIdUseCase.execute(id);

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      return res.json(category.toJSON());
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.getAllCategoriesUseCase.execute();

      return res.json(categories.map((c) => c.toJSON()));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await this.updateCategoryUseCase.execute(id, {
        name,
        description,
      });

      return res.json(category.toJSON());
    } catch (error: any) {
      if (error.message === 'Categoria não encontrada') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.deleteCategoryUseCase.execute(id);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Categoria não encontrada') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

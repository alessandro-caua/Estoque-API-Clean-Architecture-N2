// ============================================================================
// CONTROLLER: USER (USUÁRIO)
// ============================================================================
// Controller para gerenciamento de usuários.
// Camada de Apresentação - Recebe requisições HTTP e retorna respostas.
// ============================================================================

import { Request, Response } from 'express';
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
  GetUserByIdUseCase,
  GetPaginatedUsersUseCase,
  UpdateUserUseCase,
  DeactivateUserUseCase,
  ChangePasswordUseCase,
} from '../../application/use-cases/UserUseCases';
import { User, UserRole } from '../../domain/entities/User';

/**
 * Controller de Usuários
 * @description Gerencia requisições HTTP relacionadas a usuários
 */
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private getPaginatedUsersUseCase: GetPaginatedUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deactivateUserUseCase: DeactivateUserUseCase,
    private changePasswordUseCase: ChangePasswordUseCase
  ) {}

  /**
   * Cria um novo usuário
   * POST /users
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Nome, email e senha são obrigatórios',
        });
      }

      const user = await this.createUserUseCase.execute({
        name,
        email,
        password,
        role,
      });

      // Remove senha do retorno
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      return res.status(201).json(userResponse);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Autentica um usuário (login)
   * POST /users/login
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email e senha são obrigatórios',
        });
      }

      const user = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Login realizado com sucesso',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(401).json({ error: message });
    }
  }

  /**
   * Busca um usuário pelo ID
   * GET /users/:id
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await this.getUserByIdUseCase.execute(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista todos os usuários
   * GET /users
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { role, isActive, search } = req.query;

      const users = await this.getPaginatedUsersUseCase.execute({
        role: role ? (role as UserRole) : undefined,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        search: search as string,
      });

      return res.json({
        count: users.length,
        users: users.map((user: User) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        })),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Atualiza um usuário
   * PUT /users/:id
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await this.updateUserUseCase.execute(id, {
        name,
        email,
        role: role as UserRole,
      });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Altera a senha do usuário
   * PUT /users/:id/password
   */
  async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Senha atual e nova senha são obrigatórias',
        });
      }

      await this.changePasswordUseCase.execute({
        userId: id,
        currentPassword,
        newPassword,
      });

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Remove um usuário (soft delete/desativa)
   * DELETE /users/:id
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.deactivateUserUseCase.execute(id);

      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }
}

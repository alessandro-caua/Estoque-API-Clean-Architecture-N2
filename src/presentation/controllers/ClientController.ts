// ============================================================================
// CONTROLLER: CLIENT (CLIENTE)
// ============================================================================
// Controller para gerenciamento de clientes.
// Camada de Apresentação - Recebe requisições HTTP e retorna respostas.
// ============================================================================

import { Request, Response } from 'express';
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  GetPaginatedClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  GetClientsWithDebtsUseCase,
  GetTotalDebtsUseCase,
} from '../../application/use-cases/ClientUseCases';
import { Client } from '../../domain/entities/Client';

/**
 * Controller de Clientes
 * @description Gerencia requisições HTTP relacionadas a clientes
 */
export class ClientController {
  constructor(
    private createClientUseCase: CreateClientUseCase,
    private getClientByIdUseCase: GetClientByIdUseCase,
    private getPaginatedClientsUseCase: GetPaginatedClientsUseCase,
    private updateClientUseCase: UpdateClientUseCase,
    private deleteClientUseCase: DeleteClientUseCase,
    private getClientsWithDebtsUseCase: GetClientsWithDebtsUseCase,
    private getTotalDebtsUseCase: GetTotalDebtsUseCase
  ) {}

  /**
   * Cria um novo cliente
   * POST /clients
   */
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, cpf, email, phone, address, creditLimit } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'Nome é obrigatório',
        });
      }

      const client = await this.createClientUseCase.execute({
        name,
        cpf,
        email,
        phone,
        address,
        creditLimit,
      });

      return res.status(201).json(client.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Busca um cliente pelo ID
   * GET /clients/:id
   */
  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const client = await this.getClientByIdUseCase.execute(id);

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.json(client.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista todos os clientes
   * GET /clients
   */
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const { isActive, hasDebt, search } = req.query;

      const clients = await this.getPaginatedClientsUseCase.execute({
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        hasDebt: hasDebt === 'true',
        search: search as string,
      });

      return res.json({
        count: clients.length,
        clients: clients.map((client: Client) => client.toJSON()),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista clientes com débito (devedores)
   * GET /clients/debtors
   */
  async findDebtors(req: Request, res: Response): Promise<Response> {
    try {
      const debtors = await this.getClientsWithDebtsUseCase.execute();
      const totalDebt = await this.getTotalDebtsUseCase.execute();

      return res.json({
        count: debtors.length,
        totalDebt,
        clients: debtors.map((client: Client) => client.toJSON()),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Atualiza um cliente
   * PUT /clients/:id
   */
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, cpf, email, phone, address, creditLimit } = req.body;

      const client = await this.updateClientUseCase.execute(id, {
        name,
        cpf,
        email,
        phone,
        address,
        creditLimit,
      });

      return res.json(client.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Remove um cliente (soft delete)
   * DELETE /clients/:id
   */
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.deleteClientUseCase.execute(id);

      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }
}

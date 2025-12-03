// ============================================================================
// CONTROLLER: FINANCIAL (FINANCEIRO)
// ============================================================================
// Controller para gerenciamento de contas financeiras e fluxo de caixa.
// Camada de Apresentação - Recebe requisições HTTP e retorna respostas.
// ============================================================================

import { Request, Response } from 'express';
import {
  CreatePayableAccountUseCase,
  CreateReceivableAccountUseCase,
  GetAccountByIdUseCase,
  GetPaginatedAccountsUseCase,
  RegisterAccountPaymentUseCase,
  CancelAccountUseCase,
  GetOverdueAccountsUseCase,
  GetFinancialSummaryUseCase,
} from '../../application/use-cases/FinancialUseCases';
import { FinancialAccount, AccountType, AccountStatus, AccountCategory } from '../../domain/entities/FinancialAccount';

/**
 * Controller Financeiro
 * @description Gerencia requisições HTTP relacionadas a contas financeiras
 */
export class FinancialController {
  constructor(
    private createPayableUseCase: CreatePayableAccountUseCase,
    private createReceivableUseCase: CreateReceivableAccountUseCase,
    private getAccountByIdUseCase: GetAccountByIdUseCase,
    private getPaginatedAccountsUseCase: GetPaginatedAccountsUseCase,
    private registerPaymentUseCase: RegisterAccountPaymentUseCase,
    private cancelAccountUseCase: CancelAccountUseCase,
    private getOverdueAccountsUseCase: GetOverdueAccountsUseCase,
    private getFinancialSummaryUseCase: GetFinancialSummaryUseCase
  ) {}

  /**
   * Cria uma nova conta (a pagar ou a receber)
   * POST /financial/accounts
   */
  async createAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { type, description, amount, dueDate, category, referenceId, notes } = req.body;

      if (!type || !description || !amount || !dueDate) {
        return res.status(400).json({
          error: 'Tipo, descrição, valor e data de vencimento são obrigatórios',
        });
      }

      // Seleciona o use case correto baseado no tipo
      const useCase = type === 'PAYABLE' 
        ? this.createPayableUseCase 
        : this.createReceivableUseCase;

      const account = await useCase.execute({
        description,
        amount,
        dueDate: new Date(dueDate),
        category,
        referenceId,
        notes,
      });

      return res.status(201).json(account.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Busca uma conta pelo ID
   * GET /financial/accounts/:id
   */
  async findAccountById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const account = await this.getAccountByIdUseCase.execute(id);

      if (!account) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      return res.json(account.toJSON());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista todas as contas
   * GET /financial/accounts
   */
  async findAllAccounts(req: Request, res: Response): Promise<Response> {
    try {
      const { type, status, category, startDate, endDate } = req.query;

      const accounts = await this.getPaginatedAccountsUseCase.execute({
        type: type ? (type as AccountType) : undefined,
        status: status ? (status as AccountStatus) : undefined,
        category: category ? (category as AccountCategory) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      return res.json({
        count: accounts.length,
        accounts: accounts.map((account: FinancialAccount) => account.toJSON()),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Lista contas vencidas
   * GET /financial/accounts/overdue
   */
  async findOverdueAccounts(req: Request, res: Response): Promise<Response> {
    try {
      const accounts = await this.getOverdueAccountsUseCase.execute();

      return res.json({
        count: accounts.length,
        accounts: accounts.map((account: FinancialAccount) => account.toJSON()),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Registra pagamento de uma conta
   * POST /financial/accounts/:id/pay
   */
  async payAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { paidDate } = req.body;

      const account = await this.registerPaymentUseCase.execute({
        accountId: id,
        paidAt: paidDate ? new Date(paidDate) : new Date()
      });

      return res.json({
        message: 'Pagamento registrado com sucesso',
        account: account.toJSON(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Cancela uma conta
   * POST /financial/accounts/:id/cancel
   */
  async cancelAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const account = await this.cancelAccountUseCase.execute(id);

      return res.json({
        message: 'Conta cancelada com sucesso',
        account: account.toJSON(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }

  /**
   * Retorna resumo financeiro
   * GET /financial/summary
   */
  async getSummary(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'Data inicial e final são obrigatórias',
        });
      }

      const summary = await this.getFinancialSummaryUseCase.execute(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      return res.json(summary);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(400).json({ error: message });
    }
  }
}

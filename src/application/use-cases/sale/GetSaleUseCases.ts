// ============================================================================
// USE CASES DE CONSULTA DE VENDAS
// ============================================================================

import { Sale } from '../../../domain/entities/Sale';
import { ISaleRepository, SaleFilters, SalesSummary } from '../../../domain/ports';

/**
 * Use Case: Buscar venda por ID
 */
export class GetSaleByIdUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(id: string): Promise<Sale | null> {
    return this.saleRepository.findById(id);
  }
}

/**
 * Use Case: Listar vendas com filtros
 */
export class GetPaginatedSalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(filters?: SaleFilters): Promise<Sale[]> {
    return this.saleRepository.findAll(filters);
  }
}

/**
 * Use Case: Vendas do dia
 * 
 * @description
 * Retorna todas as vendas realizadas hoje.
 * Útil para fechamento de caixa.
 */
export class GetTodaySalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(): Promise<Sale[]> {
    return this.saleRepository.findToday();
  }
}

/**
 * Use Case: Resumo de vendas do período
 * 
 * @description
 * Retorna estatísticas consolidadas das vendas.
 * Útil para relatórios gerenciais.
 */
export class GetSalesSummaryUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<SalesSummary> {
    return this.saleRepository.getSummary(startDate, endDate);
  }
}

/**
 * Use Case: Vendas por período
 */
export class GetSalesByDateRangeUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.saleRepository.findByPeriod(startDate, endDate);
  }
}

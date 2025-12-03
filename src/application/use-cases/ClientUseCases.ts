// ============================================================================
// USE CASES: CLIENT (CLIENTE)
// ============================================================================
// Casos de uso para operações com clientes.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// Requisitos atendidos:
// - RF10: Cadastro de clientes
// - RF11: Registro de vendas fiadas
// - RF12: Consulta de débitos
// ============================================================================

import { Client } from '../../domain/entities/Client';
import { IClientRepository, ClientFilters } from '../../domain/repositories/IClientRepository';

// ==================== DTOs ====================

/**
 * DTO para criação de cliente
 */
export interface CreateClientDTO {
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit?: number;
}

/**
 * DTO para atualização de cliente
 */
export interface UpdateClientDTO {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit?: number;
}

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Cliente (RF10)
 */
export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: CreateClientDTO): Promise<Client> {
    // Verifica duplicidade de CPF
    if (data.cpf) {
      const existingByCpf = await this.clientRepository.findByCpf(data.cpf);
      if (existingByCpf) {
        throw new Error('Já existe um cliente com este CPF');
      }
    }

    // Verifica duplicidade de email
    if (data.email) {
      const existingByEmail = await this.clientRepository.findByEmail(data.email);
      if (existingByEmail) {
        throw new Error('Já existe um cliente com este email');
      }
    }

    const client = new Client({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      address: data.address,
      creditLimit: data.creditLimit ?? 0,
      currentDebt: 0,
      isActive: true,
    });

    return this.clientRepository.create(client);
  }
}

/**
 * Caso de Uso: Buscar Cliente por ID
 */
export class GetClientByIdUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Clientes com Filtros
 */
export class GetPaginatedClientsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(filters?: ClientFilters): Promise<Client[]> {
    return this.clientRepository.findAll(filters);
  }
}

/**
 * Caso de Uso: Listar Clientes com Débitos (RF12)
 */
export class GetClientsWithDebtsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findWithDebts();
  }
}

/**
 * Caso de Uso: Total de Débitos
 */
export class GetTotalDebtsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(): Promise<number> {
    return this.clientRepository.getTotalDebts();
  }
}

/**
 * Caso de Uso: Atualizar Cliente
 */
export class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string, data: UpdateClientDTO): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Verifica duplicidade de CPF
    if (data.cpf && data.cpf !== client.cpf) {
      const exists = await this.clientRepository.cpfExists(data.cpf, id);
      if (exists) {
        throw new Error('Já existe um cliente com este CPF');
      }
    }

    return this.clientRepository.update(id, data);
  }
}

/**
 * Caso de Uso: Excluir Cliente
 */
export class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    if (client.currentDebt > 0) {
      throw new Error('Não é possível excluir cliente com débitos pendentes');
    }

    return this.clientRepository.delete(id);
  }
}

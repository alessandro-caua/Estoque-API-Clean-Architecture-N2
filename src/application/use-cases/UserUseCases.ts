// ============================================================================
// USE CASES: USER (USUÁRIO)
// ============================================================================
// Casos de uso para operações com usuários e autenticação.
// Camada de Aplicação - Orquestra entidades e repositórios.
// 
// CONCEITO: Autenticação e Autorização
// ====================================
// - Autenticação: Verificar se o usuário É quem diz ser (login)
// - Autorização: Verificar se o usuário PODE fazer algo (permissões)
// 
// NOTA: Em produção, senhas devem ser criptografadas com bcrypt!
// 
// Requisitos atendidos:
// - RF20: Cadastro de usuários
// - RF21: Controle de acesso por perfis
// - RF22: Autenticação
// ============================================================================

import { User, UserRole } from '../../domain/entities/User';
import { IUserRepository, UserFilters } from '../../domain/repositories/IUserRepository';

// Importando DTOs da pasta centralizada
import { CreateUserDTO, UpdateUserDTO, LoginDTO, ChangePasswordDTO } from '../dtos';

// Importando erros de domínio específicos
import { 
  EntityNotFoundError, 
  EntityAlreadyExistsError,
  InvalidCredentialsError,
  UserDeactivatedError,
  ValidationError
} from '../../domain/errors';

// Re-exportando DTOs para manter compatibilidade
export { CreateUserDTO, UpdateUserDTO, LoginDTO, ChangePasswordDTO } from '../dtos';

// ==================== USE CASES ====================

/**
 * Caso de Uso: Criar Usuário (RF20)
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Verifica duplicidade de email
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new EntityAlreadyExistsError('Usuário', 'email', data.email);
    }

    // Valida senha mínima
    if (data.password.length < 6) {
      throw new ValidationError([{
        field: 'password',
        message: 'A senha deve ter pelo menos 6 caracteres'
      }]);
    }

    // Cria a entidade
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? UserRole.CAIXA,
      isActive: true,
    });

    return this.userRepository.create(user);
  }
}

/**
 * Caso de Uso: Autenticar Usuário (RF22)
 */
export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<User> {
    // Busca usuário pelo email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verifica se está ativo
    if (!user.isActive) {
      throw new UserDeactivatedError();
    }

    // Verifica senha (comparação simples - em produção usar bcrypt)
    if (user.password !== data.password) {
      throw new InvalidCredentialsError();
    }

    return user;
  }
}

/**
 * Caso de Uso: Buscar Usuário por ID
 */
export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

/**
 * Caso de Uso: Listar Usuários com Filtros
 */
export class GetPaginatedUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(filters?: UserFilters): Promise<User[]> {
    return this.userRepository.findAll(filters);
  }
}

/**
 * Caso de Uso: Atualizar Usuário
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundError('Usuário', id);
    }

    // Verifica duplicidade de email
    if (data.email && data.email !== user.email) {
      const exists = await this.userRepository.emailExists(data.email, id);
      if (exists) {
        throw new EntityAlreadyExistsError('Usuário', 'email', data.email);
      }
    }

    return this.userRepository.update(id, data);
  }
}

/**
 * Caso de Uso: Alterar Senha
 */
export class ChangePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ChangePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new EntityNotFoundError('Usuário', data.userId);
    }

    // Verifica senha atual (comparação simples - em produção usar bcrypt)
    if (user.password !== data.currentPassword) {
      throw new InvalidCredentialsError();
    }

    // Valida nova senha
    if (data.newPassword.length < 6) {
      throw new ValidationError([{
        field: 'newPassword',
        message: 'A nova senha deve ter pelo menos 6 caracteres'
      }]);
    }

    await this.userRepository.update(data.userId, { password: data.newPassword } as Partial<User>);
  }
}

/**
 * Caso de Uso: Desativar Usuário
 */
export class DeactivateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundError('Usuário', id);
    }

    await this.userRepository.delete(id);
  }
}

// ============================================================================
// ÍNDICE DE PORTS (CONTRATOS/INTERFACES)
// ============================================================================
// 
// CONCEITO: PORTS E ADAPTERS (Portas e Adaptadores)
// ==================================================
// 
// Na Clean Architecture (e especialmente em Hexagonal Architecture),
// usamos o conceito de "Ports and Adapters":
// 
// PORTS (Portas):
// - São INTERFACES que definem como o sistema se comunica
// - Ficam na camada de DOMÍNIO
// - Não sabem COMO as coisas são feitas, só O QUE precisa ser feito
// - Ex: IProductRepository define "preciso salvar produto"
// 
// ADAPTERS (Adaptadores):
// - São IMPLEMENTAÇÕES das interfaces
// - Ficam na camada de INFRAESTRUTURA
// - Sabem exatamente COMO fazer as coisas
// - Ex: PrismaProductRepository sabe salvar no banco usando Prisma
// 
// ANALOGIA:
// Pense em uma tomada elétrica (Port/Interface):
// - A tomada define o "contrato" (formato dos pinos)
// - Qualquer aparelho que siga esse contrato pode ser conectado
// - A tomada não sabe SE é um celular ou uma TV
// 
// O aparelho é o Adapter (Implementação):
// - O carregador do celular implementa o formato da tomada
// - O cabo da TV também implementa o mesmo formato
// - Cada um faz algo diferente, mas usa a mesma "interface"
// 
// BENEFÍCIOS:
// 1. Você pode trocar de banco de dados sem mudar o domínio
// 2. Pode criar implementações fake para testes
// 3. Domínio fica isolado de tecnologias externas
// 
// ============================================================================

// ============================================================================
// EXPORTAÇÃO DE INTERFACES DE REPOSITÓRIOS
// ============================================================================
// 
// Cada interface define o contrato para operações de persistência.
// A implementação concreta (ex: Prisma, MongoDB) fica em infrastructure.
// 
// ============================================================================

export { 
  ICategoryRepository 
} from '../repositories/ICategoryRepository';

export { 
  ISupplierRepository 
} from '../repositories/ISupplierRepository';

export { 
  IProductRepository,
  ProductFilters,
} from '../repositories/IProductRepository';

export { 
  IStockMovementRepository,
  StockMovementFilters,
} from '../repositories/IStockMovementRepository';

export { 
  IUserRepository,
  UserFilters,
} from '../repositories/IUserRepository';

export { 
  IClientRepository,
  ClientFilters,
} from '../repositories/IClientRepository';

export { 
  ISaleRepository,
  SaleFilters,
  SalesSummary,
} from '../repositories/ISaleRepository';

export { 
  IFinancialAccountRepository,
  FinancialAccountFilters,
  FinancialSummary,
} from '../repositories/IFinancialAccountRepository';

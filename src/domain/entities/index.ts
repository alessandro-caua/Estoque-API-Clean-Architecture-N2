// ============================================================================
// ÍNDICE DE ENTIDADES DO DOMÍNIO
// ============================================================================
// 
// CONCEITO: O QUE SÃO ENTIDADES?
// ==============================
// 
// Na Clean Architecture, Entidades são a camada mais central.
// São os "objetos de negócio" que representam conceitos do mundo real.
// 
// CARACTERÍSTICAS DAS ENTIDADES:
// 
// 1. INDEPENDENTES DE TECNOLOGIA
//    - Não conhecem banco de dados, HTTP, frameworks
//    - Funcionariam igual em qualquer contexto
// 
// 2. CONTÊM REGRAS DE NEGÓCIO
//    - Validações (preço não pode ser negativo)
//    - Cálculos (margem de lucro = venda - custo)
//    - Estados (produto ativo/inativo)
// 
// 3. MENOS PROPENSAS A MUDAR
//    - A tecnologia muda (Angular → React → Vue)
//    - O negócio permanece (produto sempre terá preço)
// 
// ANALOGIA:
// ---------
// Pense em uma loja física (sem computador):
// - Produtos existem (com preço, nome, quantidade)
// - Clientes existem (com nome, débito, limite)
// - Vendas acontecem (itens, total, pagamento)
// 
// Essas são as entidades! Existiriam mesmo sem sistema.
// O software apenas automatiza e registra o que já existe.
// 
// PADRÃO: Cada entidade tem:
// - Classe: A entidade em si (Product, Sale, Client)
// - Props: Interface com dados de criação (ProductProps)
// - Enums: Valores fixos relacionados (PaymentMethod, UserRole)
// 
// ============================================================================

// ==================== ENTIDADES BASE ====================

/** Categoria de produtos */
export { Category, CategoryProps } from './Category';

/** Fornecedor de produtos */
export { Supplier, SupplierProps } from './Supplier';

/** Produto do estoque */
export { Product, ProductProps } from './Product';

/** Movimentação de estoque */
export { StockMovement, StockMovementProps, MovementType } from './StockMovement';

// ==================== USUÁRIOS E AUTENTICAÇÃO ====================

/** Usuário do sistema */
export { User, UserProps, UserRole } from './User';

/** Log de auditoria */
export { AuditLog, AuditLogProps, AuditAction } from './AuditLog';

// ==================== CLIENTES ====================

/** Cliente do supermercado */
export { Client, ClientProps } from './Client';

// ==================== VENDAS ====================

/** Venda realizada */
export { Sale, SaleProps, PaymentMethod, PaymentStatus } from './Sale';

/** Item de venda */
export { SaleItem, SaleItemProps } from './SaleItem';

/** Comprovante de venda */
export { Receipt, ReceiptProps, ReceiptType, ReceiptStatus } from './Receipt';

// ==================== PROMOÇÕES ====================

/** Promoção de produtos */
export { Promotion, PromotionProps, DiscountType } from './Promotion';

// ==================== COMPRAS ====================

/** Pedido de compra */
export { PurchaseOrder, PurchaseOrderProps, PurchaseOrderStatus } from './PurchaseOrder';

/** Item de pedido de compra */
export { PurchaseItem, PurchaseItemProps } from './PurchaseItem';

// ==================== FINANCEIRO ====================

/** Conta financeira (a pagar/receber) */
export { 
  FinancialAccount, 
  FinancialAccountProps, 
  AccountType, 
  AccountStatus, 
  AccountCategory 
} from './FinancialAccount';

/** Fluxo de caixa */
export { CashFlow, CashFlowProps, CashFlowType, CashFlowCategory } from './CashFlow';

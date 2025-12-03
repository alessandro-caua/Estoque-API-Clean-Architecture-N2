// ============================================================================
// ARQUIVO DE EXPORTAÇÃO: ENTIDADES DO DOMÍNIO
// ============================================================================
// Este arquivo centraliza todas as exportações das entidades do domínio.
// Facilita a importação em outros módulos do sistema.
// 
// Estrutura do Domínio (Clean Architecture):
// - Entidades: Objetos de negócio com regras e validações
// - Enums: Tipos enumerados para status e categorias
// - Props: Interfaces para criação de entidades
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

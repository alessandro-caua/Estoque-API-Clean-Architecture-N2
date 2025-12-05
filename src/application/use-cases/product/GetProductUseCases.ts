// ============================================================================
// USE CASES DE CONSULTA DE PRODUTOS
// ============================================================================
// 
// Agrupa vários Use Cases de consulta (Query) em um arquivo.
// São operações simples que apenas leem dados.
// 
// NOTA: Você pode separar em arquivos individuais se preferir.
// Aqui agrupamos por simplicidade e porque são muito parecidos.
// 
// ============================================================================

import { Product } from '../../../domain/entities/Product';
import { IProductRepository, ProductFilters } from '../../../domain/ports';

/**
 * Use Case: Buscar produto por ID
 */
export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

/**
 * Use Case: Buscar produto por código de barras
 * 
 * @description
 * Muito usado no caixa para registrar vendas.
 * O leitor de código de barras envia o código, e buscamos o produto.
 */
export class GetProductByBarcodeUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(barcode: string): Promise<Product | null> {
    return this.productRepository.findByBarcode(barcode);
  }
}

/**
 * Use Case: Listar todos os produtos
 * 
 * @description
 * Retorna lista de produtos com filtros opcionais.
 * Útil para tela de listagem/pesquisa de produtos.
 */
export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.findAll(filters);
  }
}

/**
 * Use Case: Listar produtos com estoque baixo
 * 
 * @description
 * Retorna produtos onde quantity <= minQuantity.
 * 
 * REGRA DE NEGÓCIO (RF05):
 * O sistema deve alertar quando o estoque está baixo
 * para que o gerente possa fazer novos pedidos.
 * 
 * @example
 * Produto: Coca-Cola 2L
 * - quantity: 5 unidades
 * - minQuantity: 10 unidades
 * - Este produto aparece na lista de baixo estoque!
 */
export class GetLowStockProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findLowStock();
  }
}

/**
 * Use Case: Listar produtos vencidos
 * 
 * @description
 * Retorna produtos cuja data de validade já passou.
 * 
 * REGRA DE NEGÓCIO:
 * Produtos vencidos NÃO devem ser vendidos.
 * O gerente deve:
 * 1. Identificar produtos vencidos (este Use Case)
 * 2. Registrar perda no estoque (StockMovement LOSS)
 * 3. Possivelmente descartar o produto
 */
export class GetExpiredProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findExpired();
  }
}

/**
 * Use Case: Listar produtos de uma categoria
 * 
 * @description
 * Filtra produtos por categoria.
 * Útil para navegação por departamentos.
 */
export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}

/**
 * Use Case: Listar produtos de um fornecedor
 * 
 * @description
 * Filtra produtos por fornecedor.
 * Útil para fazer pedidos de reposição.
 */
export class GetProductsBySupplierUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(supplierId: string): Promise<Product[]> {
    return this.productRepository.findBySupplier(supplierId);
  }
}

// ============================================================================
// ERRO BASE DE DOMÍNIO
// ============================================================================
// 
// Este arquivo define a classe base para todos os erros de domínio.
// 
// Na Clean Architecture, erros de domínio são importantes porque:
// 1. Representam violações de regras de negócio (não erros técnicos)
// 2. Permitem tratamento específico na camada de apresentação
// 3. Mantêm o domínio isolado de detalhes de implementação
// 
// CONCEITO: Erros de domínio vs Erros técnicos
// - Erro de Domínio: "Cliente não pode ter débito maior que o limite"
// - Erro Técnico: "Falha na conexão com o banco de dados"
// 
// ============================================================================

/**
 * Classe base para todos os erros de domínio
 * 
 * @description
 * Esta classe estende Error nativo do JavaScript, mas adiciona
 * propriedades específicas para erros de regras de negócio.
 * 
 * @example
 * ```typescript
 * throw new DomainError('Operação não permitida', 'OPERATION_NOT_ALLOWED');
 * ```
 */
export class DomainError extends Error {
  /**
   * Código único do erro para identificação programática
   * Útil para internacionalização e tratamento específico
   */
  public readonly code: string;

  /**
   * Data/hora em que o erro ocorreu
   * Útil para logs e debugging
   */
  public readonly timestamp: Date;

  /**
   * Construtor do erro de domínio
   * 
   * @param message - Mensagem descritiva do erro (para humanos)
   * @param code - Código único do erro (para programas)
   */
  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    // Chama o construtor da classe pai (Error)
    super(message);

    // Define o nome da classe do erro
    this.name = this.constructor.name;

    // Armazena o código e timestamp
    this.code = code;
    this.timestamp = new Date();

    // Mantém o stack trace correto no V8 (Node.js)
    // Usamos type assertion porque captureStackTrace é específico do V8
    // e não está definido em todos os ambientes JavaScript
    const ErrorConstructor = Error as typeof Error & {
      captureStackTrace?: (target: Error, constructor: Function) => void;
    };
    
    if (ErrorConstructor.captureStackTrace) {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converte o erro para um objeto JSON serializável
   * Útil para enviar nas respostas HTTP
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * CONFIGURAÇÃO CENTRALIZADA
 * 
 * Gerencia todas as configurações da aplicação através de variáveis de ambiente.
 * Suporta múltiplos ambientes: development, staging, production.
 */

import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Valida se uma variável de ambiente obrigatória existe
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
  return value;
}

/**
 * Configuração da aplicação
 */
export const config = {
  /**
   * Configurações da aplicação
   */
  app: {
    name: process.env.APP_NAME || 'Estoque API',
    version: process.env.APP_VERSION || '2.0.0',
    env: (process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production',
    port: parseInt(process.env.PORT || '3000', 10),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  /**
   * Configurações do banco de dados
   */
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  /**
   * Configurações de logging
   */
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE === 'true',
    logDir: process.env.LOG_DIR || 'logs',
  },

  /**
   * Configurações de segurança
   */
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },

  /**
   * Configurações de API
   */
  api: {
    prefix: process.env.API_PREFIX || '/api',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutos
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
  },

  /**
   * Configurações de cache (para uso futuro)
   */
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutos
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
  },

  /**
   * Configurações de estoque
   */
  stock: {
    defaultMinQuantity: parseInt(process.env.DEFAULT_MIN_QUANTITY || '10', 10),
    lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD || '20', 10),
  },
} as const;

/**
 * Valida configurações críticas
 */
export function validateConfig(): void {
  if (config.app.isProduction) {
    // Em produção, algumas configs são obrigatórias
    if (config.security.jwtSecret === 'dev-secret-change-in-production') {
      throw new Error('JWT_SECRET deve ser definido em produção!');
    }
  }
}

// Exporta tipo da configuração para type-safety
export type Config = typeof config;

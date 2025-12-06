/**
 * LOGGER ESTRUTURADO
 * 
 * Sistema de logging centralizado usando Winston.
 * Suporta múltiplos níveis e formatos de log.
 */

import winston from 'winston';
import { config } from '../../config';

/**
 * Formato customizado para desenvolvimento
 */
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

/**
 * Formato para produção (JSON)
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Transports do Winston
 */
const transports: winston.transport[] = [];

// Console (sempre ativo em dev, opcional em prod)
if (config.logging.enableConsole || config.app.isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: config.app.isDevelopment ? devFormat : prodFormat,
    })
  );
}

// Arquivo (opcional)
if (config.logging.enableFile) {
  transports.push(
    new winston.transports.File({
      filename: `${config.logging.logDir}/error.log`,
      level: 'error',
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: `${config.logging.logDir}/combined.log`,
      format: prodFormat,
    })
  );
}

/**
 * Logger principal
 */
export const logger = winston.createLogger({
  level: config.logging.level,
  format: config.app.isProduction ? prodFormat : devFormat,
  transports,
  // Não sai do processo em caso de erro
  exitOnError: false,
});

/**
 * Helper para log de requisições HTTP
 */
export function logRequest(method: string, url: string, statusCode: number, duration: number) {
  logger.info('HTTP Request', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
  });
}

/**
 * Helper para log de erros
 */
export function logError(error: Error, context?: Record<string, any>) {
  logger.error(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
}

/**
 * Helper para log de domain events
 */
export function logDomainEvent(eventName: string, data: Record<string, any>) {
  logger.info(`Domain Event: ${eventName}`, data);
}

/**
 * Helper para log de use cases
 */
export function logUseCase(useCaseName: string, action: string, data?: Record<string, any>) {
  logger.info(`UseCase: ${useCaseName}.${action}`, data);
}

// Log de inicialização
logger.info('Logger initialized', {
  environment: config.app.env,
  level: config.logging.level,
  consoleEnabled: config.logging.enableConsole,
  fileEnabled: config.logging.enableFile,
});

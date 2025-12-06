/**
 * SERVIDOR - Entry Point da Aplicação
 */

import { createApp } from './app';
import { config } from './config';
import { logger } from './infrastructure/logging/logger';
import { prisma } from './infrastructure/database/prisma-client';

// Cria aplicação
const app = createApp();

// Inicia servidor
const PORT = config.app.port;

app.listen(PORT, () => {
  logger.info('🚀 Servidor iniciado com sucesso!', {
    port: PORT,
    environment: config.app.env,
    version: config.app.version,
    nodeVersion: process.version,
  });
  
  logger.info(`📍 URLs disponíveis:`, {
    api: `http://localhost:${PORT}${config.api.prefix}`,
    health: `http://localhost:${PORT}/health`,
  });
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('❌ Unhandled Promise Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
  });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception', {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Recebido SIGINT, encerrando servidor...');
  
  try {
    await prisma.$disconnect();
    logger.info('✅ Banco de dados desconectado');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Erro ao desconectar banco', { error: error.message });
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Recebido SIGTERM, encerrando servidor...');
  
  try {
    await prisma.$disconnect();
    logger.info('✅ Banco de dados desconectado');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Erro ao desconectar banco', { error: error.message });
    process.exit(1);
  }
});

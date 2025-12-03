// Rotas de StockMovement - Camada de Apresentação
import { Router } from 'express';
import { StockMovementController } from '../controllers/StockMovementController';

export const createStockMovementRoutes = (controller: StockMovementController): Router => {
  const router = Router();

  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.findAll(req, res));
  router.get('/report', (req, res) => controller.getReport(req, res));
  router.get('/date-range', (req, res) => controller.findByDateRange(req, res));
  router.get('/product/:productId', (req, res) => controller.findByProduct(req, res));
  router.get('/type/:type', (req, res) => controller.findByType(req, res));
  router.get('/:id', (req, res) => controller.findById(req, res));

  return router;
};

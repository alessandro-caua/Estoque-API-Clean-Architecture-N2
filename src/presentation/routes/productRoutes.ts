// Rotas de Product - Camada de Apresentação
import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.findAll(req, res));
  router.get('/low-stock', (req, res) => controller.findLowStock(req, res));
  router.get('/expired', (req, res) => controller.findExpired(req, res));
  router.get('/category/:categoryId', (req, res) => controller.findByCategory(req, res));
  router.get('/supplier/:supplierId', (req, res) => controller.findBySupplier(req, res));
  router.get('/barcode/:barcode', (req, res) => controller.findByBarcode(req, res));
  router.get('/:id', (req, res) => controller.findById(req, res));
  router.put('/:id', (req, res) => controller.update(req, res));
  router.delete('/:id', (req, res) => controller.delete(req, res));

  return router;
};

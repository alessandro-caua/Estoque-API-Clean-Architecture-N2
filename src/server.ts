// Ponto de entrada do servidor
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 API de Estoque - Supermercado`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📍 Endpoints disponíveis:`);
  console.log(`   - GET    /api/categories`);
  console.log(`   - POST   /api/categories`);
  console.log(`   - GET    /api/suppliers`);
  console.log(`   - POST   /api/suppliers`);
  console.log(`   - GET    /api/products`);
  console.log(`   - POST   /api/products`);
  console.log(`   - GET    /api/products/low-stock`);
  console.log(`   - GET    /api/products/expired`);
  console.log(`   - GET    /api/stock-movements`);
  console.log(`   - POST   /api/stock-movements`);
  console.log(`   - GET    /api/stock-movements/report`);
});

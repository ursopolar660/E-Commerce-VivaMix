import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();



// ROTA PARA LISTAR TODAS AS CATEGORIAS ÚNICAS
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
  }
});

// ROTA PARA BUSCAR PRODUTOS POR CATEGORIA
router.get('/products/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: categoryName });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos da categoria', error: error.message });
  }
});




// ROTA DE BUSCA (VERSÃO FINAL COM $text)
router.get('/products/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log(`>>> [BUSCA com TEXTO] Termo recebido: "${query}"`);

    if (!query || String(query).trim() === '') {
      return res.status(200).json([]);
    }

    const searchTerm = String(query).trim();

    const products = await Product.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    console.log(`>>> [BUSCA com TEXTO] Produtos encontrados:`, products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error("ERRO NA BUSCA com TEXTO:", error);
    res.status(500).json({ message: 'Erro ao realizar busca', error: error.message });
  }
});
// --- NOVA ROTA ---
// READ (GET) UM ÚNICO PRODUTO PELO ID - ROTA PÚBLICA
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
});


// CREATE (POST)
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

// READ (GET)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// UPDATE (PUT)
router.put('/products/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

// DELETE (DELETE)
router.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
  }
});

export default router;
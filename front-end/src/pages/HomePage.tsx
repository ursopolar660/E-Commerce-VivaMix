// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Apenas UMA importação para nossa instância do Axios
import apiClient from '../api/axiosConfig';
import { Product } from '../types';

// Importações do Material-UI
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button
} from '@mui/material';

// --- COMPONENTE ProductCard ---
// (Em um projeto maior, este componente estaria em seu próprio arquivo)
export const ProductCard = ({ product }: { product: Product }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrls && product.imageUrls.length > 0 
          ? product.imageUrls[0] 
          : 'https://via.placeholder.com/300x140.png?text=Sem+Imagem'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" component="p" sx={{ mt: 2 }}>
          R$ {product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/produto/${product._id}`} variant='outlined'>
          Ver Detalhes
        </Button>
        <Button size="small" variant="contained">Adicionar ao Carrinho</Button>
      </CardActions>
    </Card>
  </Grid>
);

// --- COMPONENTE HomePage ---
function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 2. A chamada de API está perfeita, usando a instância correta e o endpoint certo.
        const response = await apiClient.get<Product[]>('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Vitrine da Loja
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;
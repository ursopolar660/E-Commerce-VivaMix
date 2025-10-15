// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import { Link } from 'react-router-dom'; // 1. Importe o Link
import CategoryMenu from '../components/CategoryMenu'; // Importe o menu
import axios from '../api/axiosConfig';

// Garanta que todas estas importações do MUI estão presentes
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
        {/* 2. Transforme o botão em um Link */}
        <Button size="small" component={Link} to={`/produto/${product._id}`} variant='outlined' sx={{ textAlign: 'center', '&:hover': { backgroundColor: '#1976d2', color: '#fff' } }}>
          Ver Detalhes
        </Button>
        <Button size="small" variant="outlined" sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#1976d2', color: '#fff' } }}>Adicionar ao Carrinho</Button>
      </CardActions>
    </Card>
  </Grid>
);

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get<Product[]>('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>

    <Container sx={{ py: 4 }} maxWidth="lg">
      <Grid container spacing={4}>
      
        
        {/* Coluna para os produtos */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" component="h1" gutterBottom>
            Vitrine da Loja
          </Typography>
          <Grid container spacing={3}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}


export default HomePage;
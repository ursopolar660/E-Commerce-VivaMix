// frontend/src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard'; // Importe o novo componente

import {
  Container,
  Typography,
  Grid,
  CircularProgress, // Para o estado de loading
  Alert          // Para o estado de erro
} from '@mui/material';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        setError(null);   // Limpa erros anteriores
        
        const response = await apiClient.get<Product[]>('/products');
        setProducts(response.data);

      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false); // Finaliza o carregamento (com sucesso ou erro)
      }
    };

    fetchProducts();
  }, []);

  // Renderiza um indicador de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Renderiza a vitrine quando os dados estiverem prontos
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
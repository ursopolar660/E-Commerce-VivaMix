// frontend/src/pages/SearchResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import { Container, Typography, Grid } from '@mui/material';
import ProductCard from '../components/ProductCard'; // IMPORTA O CARD DA HOMEPAGE

function SearchResultsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        try {
          const response = await apiClient.get<Product[]>(`/products/search?q=${query}`);
          setProducts(response.data);
        } catch (error) {
          console.error('Erro ao buscar resultados:', error);
        }
      };
      fetchResults();
    } else {
      setProducts([]);
    }
  }, [query]);

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Resultados para: "{query}"
      </Typography>
      <Grid container spacing={4}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} /> // Usa o card importado
          ))
        ) : (
          <Typography>Nenhum produto encontrado.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default SearchResultsPage;
// frontend/src/pages/CategoryPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import { Container, Typography, Grid, CircularProgress, Box } from '@mui/material';
import ProductCard from '../components/ProductCard'; // Importando o componente centralizado

function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams<{ categoryName: string }>();

  useEffect(() => {
    if (categoryName) {
      setLoading(true);
      const fetchProductsByCategory = async () => {
        try {
          const response = await apiClient.get<Product[]>(`/products/category/${categoryName}`);
          setProducts(response.data);
        } catch (error) {
          console.error(`Erro ao buscar produtos da categoria ${categoryName}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchProductsByCategory();
    }
  }, [categoryName]);

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Categoria: {categoryName}
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <Typography sx={{ ml: 4 }}>Nenhum produto encontrado nesta categoria.</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default CategoryPage;
// frontend/src/pages/ProductDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get<Product>(`/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Erro ao buscar detalhes do produto:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <Typography sx={{ p: 4 }}>Carregando...</Typography>;
  }

  // --- CORREÇÃO AQUI ---
  // Adicionamos uma verificação extra para garantir que product.imageUrls não é nulo ou indefinido
  const images = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls.map(url => ({
        original: url,
        thumbnail: url,
        originalAlt: product.name,
        thumbnailAlt: product.name,
      }))
    : [{
        original: 'https://via.placeholder.com/500x500.png?text=Sem+Imagem',
        thumbnail: 'https://via.placeholder.com/150x150.png?text=Sem+Imagem',
        originalAlt: 'Sem imagem',
        thumbnailAlt: 'Sem imagem',
      }];

  return (
    <>
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Button href="/" variant="contained" sx={{ mb: 2 }} startIcon={<ArrowBackIosIcon />}>Voltar para Home</Button>
    </Container>


    <Container sx={{ py: 4 }} maxWidth="md">
      <Paper elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <ImageGallery 
                items={images}
                showPlayButton={false}
                showFullscreenButton={true}
                thumbnailPosition="bottom"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography gutterBottom variant="h4" component="h1">{product.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>{product.category}</Typography>
              <Typography variant="h5" component="p" sx={{ my: 2 }}>
                R$ {product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estoque: {product.stock} unidades
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Button variant="contained" size="large" fullWidth>
                  Adicionar ao Carrinho
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </>
  );
}

export default ProductDetailPage;
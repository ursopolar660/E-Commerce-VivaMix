// frontend/src/components/ProductCard.tsx

import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

// Note que agora ele é a exportação padrão "default" do arquivo
export default function ProductCard({ product }: { product: Product }) {
  return (
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
          <Button size="small" component={Link} to={`/produto/${product._id}`}>
            Ver Detalhes
          </Button>
          <Button size="small" variant="contained">Adicionar ao Carrinho</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
// frontend/src/pages/AdminPage.tsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Product } from '../types';
import imageCompression from 'browser-image-compression';

// Importando componentes do MUI
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Estado inicial do formulário para reuso
const formInitialState = { name: '', description: '', price: '', stock: '', category: '' };

function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState(formInitialState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Estado para múltiplos arquivos

  // Busca os produtos da API
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<Product[]>('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Executa a busca de produtos quando o componente é montado
  useEffect(() => {
    fetchProducts();
  }, []);

  // Atualiza o estado do formulário conforme o usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Atualiza o estado dos arquivos de imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  // Lida com o envio do formulário (criação ou edição)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let imageUrls = editingId ? products.find(p => p._id === editingId)?.imageUrls || [] : [];

    // ETAPA 1: Upload e compressão das imagens (se houver novas imagens)
    if (imageFiles.length > 0) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const uploadFormData = new FormData();
        
        // Comprime e adiciona todos os arquivos selecionados ao FormData
        for (const file of imageFiles) {
          const compressedFile = await imageCompression(file, options);
          uploadFormData.append('images', compressedFile); // 'images' no plural!
        }

        console.log('Enviando imagens para o back-end...');
        const uploadResponse = await apiClient.post('/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrls = uploadResponse.data.imageUrls; // Espera um array de URLs do back-end
        console.log('URLs das imagens recebidas:', imageUrls);

      } catch (error) {
        console.error('Erro no upload das imagens:', error);
        alert('Erro ao fazer upload das imagens.');
        return; // Para a execução se o upload falhar
      }
    }

    // ETAPA 2: Salvar os dados do produto (com o array de URLs de imagem)
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      imageUrls: imageUrls, // Envia o array de URLs
    };

    try {
      if (editingId) {
        // Lógica de UPDATE (PUT)
        await apiClient.put(`/products/${editingId}`, productData);
        alert('Produto atualizado com sucesso!');
      } else {
        // Lógica de CREATE (POST)
        await apiClient.post('/products', productData);
        alert('Produto criado com sucesso!');
      }
      setFormData(formInitialState);
      setImageFiles([]);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto.');
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
    });
    setImageFiles([]); // Limpa a seleção de arquivo ao começar a editar
  };

  // Lida com a confirmação de exclusão
  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await apiClient.delete(`/products/${productToDelete._id}`);
      alert('Produto deletado com sucesso!');
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto.');
    }
  };
  
  // Funções para controlar o diálogo de confirmação
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
  };
  const closeDeleteDialog = () => {
    setProductToDelete(null);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Painel de Gerenciamento de Produtos
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome do Produto" name="name" value={formData.name} onChange={handleInputChange} required fullWidth />
          <TextField label="Descrição" name="description" value={formData.description} onChange={handleInputChange} required fullWidth />
          <TextField label="Preço" name="price" type="number" value={formData.price} onChange={handleInputChange} required fullWidth />
          <TextField label="Estoque" name="stock" type="number" value={formData.stock} onChange={handleInputChange} required fullWidth />
          <TextField label="Categoria" name="category" value={formData.category} onChange={handleInputChange} required fullWidth />
          
          <Button variant="outlined" component="label" fullWidth>
            Selecionar Imagens (até 5)
            <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple />
          </Button>
          {imageFiles.length > 0 && 
            <Typography variant="body2" color="text.secondary">
              {imageFiles.length} arquivo(s) selecionado(s)
            </Typography>
          }

          <Button type="submit" variant="contained" color="primary" startIcon={editingId ? <EditIcon /> : <AddCircleOutlineIcon />} sx={{ alignSelf: 'flex-start', mt: 2 }}>
            {editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Lista de Produtos
        </Typography>
        <List>
          {products.map((product, index) => (
            <React.Fragment key={product._id}>
              <ListItem 
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => openDeleteDialog(product)} sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText 
                  primary={product.name}
                  secondary={`R$ ${product.price.toFixed(2)} | Categoria: ${product.category} | Estoque: ${product.stock}`}
                />
              </ListItem>
              {index < products.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Diálogo de Confirmação para Deletar */}
      <Dialog open={!!productToDelete} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPage;
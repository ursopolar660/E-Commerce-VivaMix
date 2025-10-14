// frontend/src/components/CategoryMenu.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CategoryMenu() {
  const [categories, setCategories] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<string[]>('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleClickAndOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    // O Box controla o fechamento do menu no hover
    <Box onMouseLeave={handleClose}>
      <Button
        id="category-button"
        aria-controls={open ? 'category-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        // --- MUDANÇA PRINCIPAL AQUI ---
        onClick={handleClickAndOpen}       // Garante o clique no mobile/desktop
        onMouseEnter={handleClickAndOpen} // Adiciona o hover no desktop
        // --- FIM DA MUDANÇA ---
        color="inherit"
        endIcon={<KeyboardArrowDownIcon />}
      >
        Categorias
      </Button>
      <Menu
        id="category-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: 'primary.dark', // <-- Defina sua cor de fundo desejada aqui
            border: '1px solid #555',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'category-button',
          onMouseLeave: handleClose,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {categories.map((category) => (
          <MenuItem 
            key={category} 
            onClick={handleClose} 
            component={Link} 
            to={`/category/${category}`}
            sx={{ color: '#fff', textDecoration: 'none', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'capitalize' }} // Estilização personalizada
              >
              {category}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
// frontend/src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar Produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
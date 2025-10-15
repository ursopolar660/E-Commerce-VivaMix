// frontend/src/App.tsx

// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SearchBar from './components/SearchBar'; // Garanta que esta importação esteja correta
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import CategoryMenu from './components/CategoryMenu';
import CategoryPage from './pages/CategoryPage';
const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

console.log('VITE_API_URL no build:', import.meta.env.VITE_API_URL);

// Componente de Cabeçalho separado para poder acessar o contexto de autenticação
function Header() {
  const { token, logout } = useAuth();

  return (
    <AppBar position="static" sx={{textDecoration: 'none', color: '#fff', fontWeight: 'bold', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '2px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 10 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Viva Mix Store
          </Link>
        </Typography>
         <Box sx={{ ml: 2 }}>
          <CategoryMenu />
        </Box>
        <SearchBar />
        <Button component={Link} to="/admin" color="inherit" sx={{ ml: 2 }}>
          Admin
        </Button>
        {/* Renderiza o botão de "Sair" apenas se o usuário estiver logado (token existe) */}
        {token && (
          <Button color="inherit" onClick={logout} sx={{ ml: 1 }}>
            Sair
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Componente principal da aplicação
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Envolvemos toda a aplicação com o AuthProvider */}
        <AuthProvider>
          <Header />
          <main>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produto/:id" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} /> {/* ROTA FALTANTE ESTÁ AQUI */}
              
              {/* Rota Protegida */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
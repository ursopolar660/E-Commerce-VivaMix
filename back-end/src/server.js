import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure o dotenv PRIMEIRO de tudo
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('API Key lida do .env:', process.env.CLOUDINARY_API_KEY);

// 2. AGORA importe as rotas, que dependem das variáveis do dotenv
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Conexão com o banco de dados
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const app = express();

// Configuração de CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Rotas da API
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
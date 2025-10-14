// backend/src/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// ROTA PARA REGISTRAR UM NOVO USUÁRIO (ADMIN)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao registrar usuário', details: error.message });
  }
});

// ROTA PARA LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Email ou senha inválidos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token expira em 7 dias
    });

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Erro no servidor' });
  }
});

export default router;
// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Garante que não haverá dois usuários com o mesmo email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Futuramente podemos adicionar um campo "role", ex: 'admin' ou 'customer'
});

// Middleware para criptografar a senha ANTES de salvar o usuário no banco
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
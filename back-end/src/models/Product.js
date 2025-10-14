// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrls: {
      type: [String],
      required: true, // Pode não ter imagem inicialmente
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Adiciona os campos createdAt e updatedAt automaticamente
    timestamps: true,
  }
);

productSchema.index(
  { name: 'text', description: 'text' },
  { default_language: 'portuguese' }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
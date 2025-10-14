import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 } 
});

// Mude de upload.single('image') para upload.array('images', 5)
router.post('/upload', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ error: 'Nenhum arquivo enviado.' });
    }

    // Faz o upload de todos os arquivos em paralelo
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({ imageUrls }); // Retorna um array de URLs
  } catch (error) {
    res.status(500).send({ error: 'Falha no upload das imagens', details: error.message });
  }
});

export default router;
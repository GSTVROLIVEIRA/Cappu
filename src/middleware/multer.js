const multer = require('multer');

// Usar armazenamento em memória para upload de fotos de perfil (LONGBLOB)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Aceita apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

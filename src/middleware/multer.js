const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/alunos'));
  },
  filename: function (req, file, cb) {
    // Usa o id do usuário autenticado para nomear a foto
    const ext = path.extname(file.originalname);
    cb(null, req.user.id_usuario + ext);
  }
});

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

const express = require('express');
const router = express.Router();
const { createResumo, getAllResumos, updateResumo, deleteResumo } = require('../controller/resumosController');

router.post('/', createResumo); // Criar resumo
router.get('/', getAllResumos); // Listar todos
router.put('/:id', updateResumo); // Atualizar
router.delete('/:id', deleteResumo); // Deletar

module.exports = router;

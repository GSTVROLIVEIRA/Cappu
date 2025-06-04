const db = require('../utils/db');

// CREATE
async function createResumo(req, res) {
    try {
        const { ID_USUARIO, TEXTO_RESUMO, TITULO, CATEGORIA } = req.body;
        const sql = `INSERT INTO RESUMOS (ID_USUARIO, DATA_RESUMO, TEXTO_RESUMO, TITULO, CATEGORIA) VALUES (?, NOW(), ?, ?, ?)`;
        await db.query(sql, [ID_USUARIO, TEXTO_RESUMO, TITULO, CATEGORIA]);
        res.status(201).json({ message: 'Resumo criado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar resumo', details: err });
    }
}

// READ ALL
async function getAllResumos(req, res) {
    try {
        const sql = `SELECT * FROM RESUMOS`;
        const resumos = await db.query(sql, []);
        res.json(resumos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar resumos', details: err });
    }
}

// UPDATE
async function updateResumo(req, res) {
    try {
        const { id } = req.params;
        const { TEXTO_RESUMO, TITULO, CATEGORIA } = req.body;
        const sql = `UPDATE RESUMOS SET TEXTO_RESUMO = ?, TITULO = ?, CATEGORIA = ? WHERE COD_RESUMO = ?`;
        await db.query(sql, [TEXTO_RESUMO, TITULO, CATEGORIA, id]);
        res.json({ message: 'Resumo atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar resumo', details: err });
    }
}

// DELETE
async function deleteResumo(req, res) {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM RESUMOS WHERE COD_RESUMO = ?`;
        await db.query(sql, [id]);
        res.json({ message: 'Resumo deletado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar resumo', details: err });
    }
}

module.exports = { createResumo, getAllResumos, updateResumo, deleteResumo };

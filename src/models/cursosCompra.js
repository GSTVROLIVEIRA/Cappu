// Model para tabela CURSOS_COMPRA, compatível com Clever Cloud.
class CursosCompra {
    constructor({
        ID_COMPRA,
        ID_CURSO
    }) {
        this.ID_COMPRA = ID_COMPRA;
        this.ID_CURSO = ID_CURSO;
    }
}

module.exports = CursosCompra;

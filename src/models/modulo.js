// Model para tabela MODULO, compatível com Clever Cloud.
class Modulo {
    constructor({
        ID_MODULO,
        ID_CURSO,
        DESCRICAO,
        TITULO,
        ORDEM
    }) {
        this.ID_MODULO = ID_MODULO;
        this.ID_CURSO = ID_CURSO;
        this.DESCRICAO = DESCRICAO;
        this.TITULO = TITULO;
        this.ORDEM = ORDEM;
    }
}

module.exports = Modulo;

module.exports = Modulo;

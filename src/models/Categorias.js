// Model para tabela CATEGORIAS, compatível com Clever Cloud.
class Categorias {
    constructor({
        ID_CATEGORIA,
        DESCRICAO,
        NOME
    }) {
        this.ID_CATEGORIA = ID_CATEGORIA;
        this.DESCRICAO = DESCRICAO;
        this.NOME = NOME;
    }
}

module.exports = Categorias;

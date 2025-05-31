// Model para tabela ATIVIDADE, compatível com Clever Cloud.
class Atividade {
    constructor({
        ID_ATIVIDADE,
        ID_MODULO,
        TITULO,
        DESCRICAO,
        DATA_CRIACAO,
        DURACAO
    }) {
        this.ID_ATIVIDADE = ID_ATIVIDADE;
        this.ID_MODULO = ID_MODULO;
        this.TITULO = TITULO;
        this.DESCRICAO = DESCRICAO;
        this.DATA_CRIACAO = DATA_CRIACAO;
        this.DURACAO = DURACAO;
    }
}

module.exports = Atividade;

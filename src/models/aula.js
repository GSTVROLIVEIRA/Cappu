// Model para tabela AULA, compatível com Clever Cloud.
class Aula {
    constructor({
        ID_AULA,
        ID_MODULO,
        NOME,
        DURACAO,
        ORDEM
    }) {
        this.ID_AULA = ID_AULA;
        this.ID_MODULO = ID_MODULO;
        this.NOME = NOME;
        this.DURACAO = DURACAO;
        this.ORDEM = ORDEM;
    }
}

module.exports = Aula;
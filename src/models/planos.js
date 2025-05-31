// Model para tabela PLANOS, compatível com Clever Cloud.
class Planos {
    constructor({
        ID_PLANO,
        NOME,
        DESCRICAO,
        VALOR,
        DURACAO_DIAS
    }) {
        this.ID_PLANO = ID_PLANO;
        this.NOME = NOME;
        this.DESCRICAO = DESCRICAO;
        this.VALOR = VALOR;
        this.DURACAO_DIAS = DURACAO_DIAS;
    }
}

module.exports = Planos;

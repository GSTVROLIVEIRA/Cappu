// Model para tabela EXERCICIO, compatível com Clever Cloud.
class Exercicio {
    constructor({
        ID_EXERCICIO,
        ID_AULA,
        ENUNCIADO,
        TIPO,
        ORDEM
    }) {
        this.ID_EXERCICIO = ID_EXERCICIO;
        this.ID_AULA = ID_AULA;
        this.ENUNCIADO = ENUNCIADO;
        this.TIPO = TIPO;
        this.ORDEM = ORDEM;
    }
}

module.exports = Exercicio;
// Model para tabela AVALIACAO_CURSO, compatível com Clever Cloud.
class AvaliacaoCurso {
    constructor({
        ID_AVALIACAO,
        ID_CURSO,
        ID_USUARIO,
        NOTA,
        JUSTIFICATIVA
    }) {
        this.ID_AVALIACAO = ID_AVALIACAO;
        this.ID_CURSO = ID_CURSO;
        this.ID_USUARIO = ID_USUARIO;
        this.NOTA = NOTA;
        this.JUSTIFICATIVA = JUSTIFICATIVA;
    }
}

module.exports = AvaliacaoCurso;

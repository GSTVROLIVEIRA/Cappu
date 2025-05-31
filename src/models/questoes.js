// Model para tabela QUESTOES, compatível com Clever Cloud.
class Questoes {
    constructor({
        COD_QUESTAO,
        ID_QUEST,
        PERGUNTA,
        ORDEM,
        ALT_AUDITIVA,
        ALT_VISUAL,
        ALT_LER_ESCREVER,
        ALT_SINESTESICO
    }) {
        this.COD_QUESTAO = COD_QUESTAO;
        this.ID_QUEST = ID_QUEST;
        this.PERGUNTA = PERGUNTA;
        this.ORDEM = ORDEM;
        this.ALT_AUDITIVA = ALT_AUDITIVA;
        this.ALT_VISUAL = ALT_VISUAL;
        this.ALT_LER_ESCREVER = ALT_LER_ESCREVER;
        this.ALT_SINESTESICO = ALT_SINESTESICO;
    }
}

module.exports = Questoes;

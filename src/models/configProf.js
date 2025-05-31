// Model para tabela CONFIG_PROF, compatível com Clever Cloud.
class ConfigProf {
    constructor({
        ID_CONFIG_PROF,
        ID_USUARIO,
        LINK,
        ID_NOTIFICACAO,
        BIOGRAFIA,
        CONTA_PAG,
        AGENCIA_PAG,
        CHAVE_PIX,
        BANCO_PAG
    }) {
        this.ID_CONFIG_PROF = ID_CONFIG_PROF;
        this.ID_USUARIO = ID_USUARIO;
        this.LINK = LINK;
        this.ID_NOTIFICACAO = ID_NOTIFICACAO;
        this.BIOGRAFIA = BIOGRAFIA;
        this.CONTA_PAG = CONTA_PAG;
        this.AGENCIA_PAG = AGENCIA_PAG;
        this.CHAVE_PIX = CHAVE_PIX;
        this.BANCO_PAG = BANCO_PAG;
    }
}

module.exports = ConfigProf;

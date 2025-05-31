// Model para tabela USUARIO, compatível com Clever Cloud.
class User {
    constructor({
        ID_USUARIO,
        DATA_CADASTRO,
        TIPO_USUARIO,
        ENDERECO,
        DT_NASC,
        EMAIL,
        NOME_USU,
        SENHA,
        FOTO_PERFIL,
        TELEFONE,
        NUM_IDENTIFICACAO,
        ID_STATUS,
        COR_TELA
    }) {
        this.ID_USUARIO = ID_USUARIO;
        this.DATA_CADASTRO = DATA_CADASTRO;
        this.TIPO_USUARIO = TIPO_USUARIO;
        this.ENDERECO = ENDERECO;
        this.DT_NASC = DT_NASC;
        this.EMAIL = EMAIL;
        this.NOME_USU = NOME_USU;
        this.SENHA = SENHA;
        this.FOTO_PERFIL = FOTO_PERFIL;
        this.TELEFONE = TELEFONE;
        this.NUM_IDENTIFICACAO = NUM_IDENTIFICACAO;
        this.ID_STATUS = ID_STATUS;
        this.COR_TELA = COR_TELA;
    }
}

module.exports = User;
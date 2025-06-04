class Resumos {
    constructor({
        COD_RESUMO,
        ID_USUARIO,
        DATA_RESUMO,
        TEXTO_RESUMO,
        TITULO,
        CATEGORIA
    }) {
        this.COD_RESUMO = COD_RESUMO;
        this.ID_USUARIO = ID_USUARIO;
        this.DATA_RESUMO = DATA_RESUMO;
        this.TEXTO_RESUMO = TEXTO_RESUMO;
        this.TITULO = TITULO;
        this.CATEGORIA = CATEGORIA;
    }
}

module.exports = Resumos;

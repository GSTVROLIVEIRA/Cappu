// Model para tabela COMPRA, compatível com Clever Cloud.
class Compra {
    constructor({
        ID_COMPRA,
        ID_USUARIO,
        FORMA_PAGAMENTO,
        DATA_COMPRA,
        STATUS,
        VALOR
    }) {
        this.ID_COMPRA = ID_COMPRA;
        this.ID_USUARIO = ID_USUARIO;
        this.FORMA_PAGAMENTO = FORMA_PAGAMENTO;
        this.DATA_COMPRA = DATA_COMPRA;
        this.STATUS = STATUS;
        this.VALOR = VALOR;
    }
}

module.exports = Compra;

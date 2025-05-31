// Model para tabela MATERIAL, compatível com Clever Cloud.
class Material {
    constructor({
        ID_MATERIAL,
        ID_AULA,
        DESCRICAO
    }) {
        this.ID_MATERIAL = ID_MATERIAL;
        this.ID_AULA = ID_AULA;
        this.DESCRICAO = DESCRICAO;
    }
}

module.exports = Material;

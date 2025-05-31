
const bcrypt = require("bcryptjs");

// Exportação dos models em classes simples (sem Sequelize)
const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Curso = require('./curso');
const Modulo = require('./modulo');
const Aula = require('./aula');
const Material = require('./material');
const Atividade = require('./atividade');
const AtividadesQuestoes = require('./atividadesQuestoes');
const Questionario = require('./questionario');
const Questoes = require('./questoes');
const AnaliseAprendizagem = require('./analiseAprendizagem');
const QuestAnalise = require('./questAnalise');
const ProgressoAula = require('./progressoAula');
const AvaliacaoCurso = require('./avaliacaoCurso');
const Suporte = require('./suporte');
const ConfigProf = require('./configProf');
const Resumos = require('./resumos');
const Planos = require('./planos');
const Compra = require('./compra');
const CursosCompra = require('./cursosCompra');
const CompraPlanos = require('./compraPlanos');
const EstiloAprendizagem = require('./estiloAprendizagem');
const Funcionalidade = require('./funcionalidade');

Curso.hasMany(Aula, { foreignKey: "curso_id" });
Aula.belongsTo(Curso, { foreignKey: "curso_id" });

Aula.hasMany(Exercicio, { foreignKey: "aula_id" });
Exercicio.belongsTo(Aula, { foreignKey: "aula_id" });

Aula.hasMany(Material, { foreignKey: "aula_id" });
Material.belongsTo(Aula, { foreignKey: "aula_id" });

User.hasMany(Resumo, { foreignKey: "aluno_id" });
Resumo.belongsTo(User, { foreignKey: "aluno_id" });

// Função para popular o banco com dados iniciais (opcional)
async function seed() {
  try {
    const professor = await User.create({
      name: "Admin",
      email: "admin@teste.com",
      password: await bcrypt.hash("admin123", 12),
      role: "professor",
      status: "active",
    });

    const curso = await Curso.create({
      titulo: "Introdução ao SQLite",
      descricao: "Descrição inicial do curso",
      categoria: "Geral",
      nivel: "basico",
      duracao: "1 mês",
      professor_id: professor.id,
    });

    console.log("[SQLite] Dados iniciais criados!");
  } catch (error) {
    console.error("[SQLite] Erro ao criar dados iniciais:", error);
  }
}

// Sincroniza e popula o banco (apenas em desenvolvimento/testes)

  .sync({ force: true }) // force: true só em desenvolvimento!
  .then(seed)
  .catch((err) => {
    console.error("[SQLite] Erro ao sincronizar:", err);
  });

module.exports = {
  User,
  Curso,
  Aula,
  Exercicio,
  Material,
  Resumo,
};
const { query } = require("../utils/db");
const moment = require("moment");

/**
 * Salva as respostas do questionário VARK e calcula a pontuação.
 * Só permite um registro por usuário.
 */
exports.salvarRespostasVark = async (req, res) => {
  const { respostas } = req.body; // [{ cod_questao, resposta }]
  const idUsuario = req.user.ID_USUARIO;

  // LOG DE ENTRADA
  console.log('--- [VARK] Início salvarRespostasVark ---');
  console.log('Usuário:', idUsuario);
  console.log('Respostas recebidas:', respostas);

  try {
    // Verifica se o usuário já respondeu
    const analiseExistenteArr = await query(
      "SELECT * FROM ANALISE_APRENDIZAGEM WHERE ID_USUARIO = ?",
      [idUsuario]
    );
    const analiseExistente = Array.isArray(analiseExistenteArr) ? analiseExistenteArr : [];
    if (analiseExistente.length > 0) {
      req.flash("error", "Você já respondeu o questionário VARK.");
      return res.redirect("/aluno/conclusao");
    }

    // Checa se respostas foi enviado corretamente
    if (!req.body.respostas || !Array.isArray(req.body.respostas) || req.body.respostas.length !== 16) {
      req.flash("error", "Respostas do questionário inválidas. Responda todas as perguntas.");
      return res.redirect("/aluno/quest1_vark");
    }
    const respostas = req.body.respostas;

    // Gera novo COD_ANALISE (pode ser o timestamp)
    const codAnalise = Math.floor(Date.now() / 1000); // timestamp em segundos, cabe em INT
    const dataAnalise = moment().format("YYYY-MM-DD HH:mm:ss");

    // Inicializa pontuação
    let resAuditiva = 0, resVisual = 0, resSinestesico = 0, resLerEscr = 0;

    // Mapeamento de alternativas para estilos
    // Exemplo: { cod_questao: { 1: 'AUDITIVA', 2: 'LER_ESCR', ... } }
    const mapaEstilos = {
      1: ['AUDITIVA', 'LER_ESCR', 'VISUAL', 'SINESTESICO'],
      2: ['VISUAL', 'AUDITIVA', 'SINESTESICO', 'LER_ESCR'],
      3: ['SINESTESICO', 'LER_ESCR', 'AUDITIVA', 'VISUAL'],
      4: ['LER_ESCR', 'AUDITIVA', 'VISUAL', 'SINESTESICO'],
      5: ['VISUAL', 'LER_ESCR', 'AUDITIVA', 'SINESTESICO'],
      6: ['VISUAL', 'SINESTESICO', 'AUDITIVA', 'LER_ESCR'],
      7: ['LER_ESCR', 'SINESTESICO', 'AUDITIVA', 'VISUAL'],
      8: ['LER_ESCR', 'SINESTESICO', 'AUDITIVA', 'VISUAL'],
      9: ['VISUAL', 'AUDITIVA', 'LER_ESCR', 'SINESTESICO'],
      10: ['VISUAL', 'SINESTESICO', 'AUDITIVA', 'LER_ESCR'],
      11: ['VISUAL', 'AUDITIVA', 'SINESTESICO', 'LER_ESCR'],
      12: ['VISUAL', 'AUDITIVA', 'SINESTESICO', 'LER_ESCR'],
      13: ['VISUAL', 'AUDITIVA', 'LER_ESCR', 'SINESTESICO'],
      14: ['AUDITIVA', 'VISUAL', 'SINESTESICO', 'LER_ESCR'],
      15: ['VISUAL', 'LER_ESCR', 'VISUAL', 'AUDITIVA'],
      16: ['AUDITIVA', 'VISUAL', 'LER_ESCR', 'SINESTESICO'],
    };

    // Calcula pontuação SOMENTE (não insere ainda)
    for (const r of respostas) {
      const { cod_questao, resposta } = r; // resposta: 1,2,3,4
      // Mapeia alternativa para estilo
      const estilos = mapaEstilos[cod_questao];
      if (!estilos || !resposta || resposta < 1 || resposta > 4) continue;
      const estilo = estilos[resposta - 1];
      if (estilo === 'AUDITIVA') resAuditiva++;
      if (estilo === 'VISUAL') resVisual++;
      if (estilo === 'SINESTESICO') resSinestesico++;
      if (estilo === 'LER_ESCR') resLerEscr++;
    }

    // 1. Salva pontuação total em ANALISE_APRENDIZAGEM PRIMEIRO
    await query(
      `INSERT INTO ANALISE_APRENDIZAGEM (COD_ANALISE, ID_USUARIO, RES_AUDITIVA, RES_VISUAL, RES_SINESTESICO, RES_LER_ESCR, DATA_ANALISE)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [codAnalise, idUsuario, resAuditiva, resVisual, resSinestesico, resLerEscr, dataAnalise]
    );
    console.log('[VARK] Inserido em ANALISE_APRENDIZAGEM:', {codAnalise, idUsuario, resAuditiva, resVisual, resSinestesico, resLerEscr, dataAnalise});

    // 2. Agora salva cada resposta em QUEST_ANALISE
    for (const r of respostas) {
      const { cod_questao, resposta } = r;
      await query(
        `INSERT INTO QUEST_ANALISE (COD_QUESTAO, COD_ANALISE, ID_USUARIO, RESPOSTA)
        VALUES (?, ?, ?, ?)`,
        [cod_questao, codAnalise, idUsuario, resposta]
      );
      console.log(`[VARK] Inserido QUEST_ANALISE:`, {cod_questao, codAnalise, idUsuario, resposta});
    }
    console.log('[VARK] Todas respostas inseridas para análise:', codAnalise, idUsuario);

    // Se for AJAX, responde com JSON para o front redirecionar
    if (req.xhr || req.headers['accept'] === 'application/json') {
      return res.json({ success: true, redirect: '/aluno/conclusao' });
    }
    req.flash("success", "Respostas salvas com sucesso!");
    res.redirect("/aluno/conclusao");
  } catch (err) {
    console.error('[VARK] ERRO AO SALVAR:', err);
    if (req.xhr || req.headers['accept'] === 'application/json') {
      return res.status(500).json({ success: false, message: 'Erro ao salvar respostas do questionário.', error: err.message });
    }
    req.flash("error", "Erro ao salvar respostas do questionário.");
    res.redirect("/aluno/quest1_vark");
  }
  console.log('--- [VARK] Fim salvarRespostasVark ---');
};

/**
 * Busca a pontuação VARK do usuário logado e renderiza a tela de conclusão.
 */
exports.resultadoVark = async (req, res) => {
  const idUsuario = req.user.ID_USUARIO;
  try {
    const analiseArr = await query(
      "SELECT * FROM ANALISE_APRENDIZAGEM WHERE ID_USUARIO = ?",
      [idUsuario]
    );
    const analise = Array.isArray(analiseArr) ? analiseArr : [];
    if (!analise.length) {
      req.flash("error", "Você ainda não respondeu o questionário.");
      return res.redirect("/aluno/quest1_vark");
    }
    res.render("dashboard/aluno/conclusao", {
      user: req.user,
      timestamp: Date.now(),
      resultado: analise[0],
      title: "Resultado VARK"
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao buscar resultado.");
    res.redirect("/aluno/quest1_vark");
  }
};

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/multer");

// Middleware para verificar se o usuário é aluno
const isAluno = (req, res, next) => {
  if (req.user && (req.user.role === "aluno" || req.user.TIPO_USUARIO === "aluno")) {
    return next();
  }
  res.redirect("/auth/cl-login");
};

router.use(isAluno);

// Dashboard do aluno
router.get("/", (req, res) => {
  res.render("dashboard/aluno/a-perfil", {
    user: req.user,
    title: "Dashboard Aluno",
  });
});

router.get("/a-config", (req, res) => {
  res.render("dashboard/aluno/a-config", {
    user: req.user,
    title: "Configurações",
    success: req.flash('success'),
    error: req.flash('error'),
    timestamp: Date.now()
  });
});

// Excluir conta do usuário
router.post("/excluir-conta", async (req, res) => {
  const db = require('../config/database');
  try {
    console.log('Tentando excluir usuário:', req.user && req.user.ID_USUARIO);
    // Deleta dependências em QUEST_ANALISE
    await db.query('DELETE FROM QUEST_ANALISE WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    // Deleta dependências em ANALISE_APRENDIZAGEM
    await db.query('DELETE FROM ANALISE_APRENDIZAGEM WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    // Deleta o usuário do banco
    const [result] = await db.query('DELETE FROM USUARIO WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    console.log('Resultado da exclusão:', result);
    // Faz logout destruindo a sessão
    if (req.logout) {
      req.logout(function(err) {
        if (err) { 
          console.log('Erro no logout:', err);
          req.flash('error', 'Erro ao fazer logout: ' + err.message);
          return res.redirect('/aluno/a-config'); 
        }
        req.session.destroy(() => {
          res.redirect('/');
        });
      });
    } else {
      req.session.destroy(() => {
        res.redirect('/');
      });
    }
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    req.flash('error', 'Erro ao excluir conta: ' + err.message);
    res.redirect('/aluno/a-config');
  }
});

// Upload da foto do perfil
router.post("/upload-foto", upload.single("foto_perfil"), async (req, res) => {
  if (!req.file) {
    req.flash('error', 'Nenhum arquivo enviado!');
    return res.redirect("/aluno/a-config");
  }
  const db = require('../config/database');
  try {
    // Salva a imagem no banco
    // Remove a foto antiga antes de salvar a nova
    await db.query('UPDATE USUARIO SET FOTO_PERFIL = NULL WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    // Salva a nova foto
    await db.query(
      'UPDATE USUARIO SET FOTO_PERFIL = ? WHERE ID_USUARIO = ?',
      [req.file.buffer, req.user.ID_USUARIO]
    );
    // Recarrega o usuário atualizado do banco
    const [rows] = await db.query('SELECT * FROM USUARIO WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    if (rows.length) {
      // Atualiza req.user para refletir a nova foto
      Object.assign(req.user, rows[0]);
    }
    req.flash('success', 'Foto de perfil adicionada com sucesso!');
    res.redirect("/aluno/a-config");
  } catch (err) {
    req.flash('error', 'Erro ao salvar foto no banco!');
    res.redirect("/aluno/a-config");
  }
});

// Excluir foto do perfil
router.post("/excluir-foto", async (req, res) => {
  const db = require('../config/database');
  try {
    await db.query('UPDATE USUARIO SET FOTO_PERFIL = NULL WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
    req.user.FOTO_PERFIL = null;
    req.flash('success', 'Foto de perfil removida com sucesso!');
    res.redirect("/aluno/a-config");
  } catch (err) {
    req.flash('error', 'Erro ao remover foto!');
    res.redirect("/aluno/a-config");
  }
});

router.get("/a-perfil", (req, res) => {
  res.render("dashboard/aluno/a-perfil", {
    user: req.user,
    title: "Perfil Aluno",
    timestamp: Date.now()
  });
});


router.get("/a-meuscursos", (req, res) => {
  res.render("dashboard/aluno/a-meuscursos", {
    user: req.user,
    title: "Meus Cursos",
    timestamp: Date.now()
  });
});


// Função utilitária para checar se o usuário já respondeu o VARK
async function usuarioRespondeuVark(userId, query) {
  const resultado = await query(
    "SELECT 1 FROM ANALISE_APRENDIZAGEM WHERE ID_USUARIO = ? LIMIT 1",
    [userId]
  );
  return resultado && resultado.length > 0;
}

router.get("/a-minha-rotina", async (req, res) => {
  const query = require("../utils/db").query;
  const userId = req.user.ID_USUARIO;
  const respondeu = await usuarioRespondeuVark(userId, query);
  if (respondeu) {
    return res.redirect("/aluno/a-minha-rotina-2");
  }
  res.render("dashboard/aluno/a-minha-rotina", {
    user: req.user,
    title: "Minha Rotina",
    timestamp: Date.now()
  });
});
router.get("/a-pomodoro", (req, res) => {
  res.render("dashboard/aluno/a-pomodoro", {
    user: req.user,
    title: "Pomodoro",
  });
});
router.get("/a-resumo", (req, res) => {
  res.render("dashboard/aluno/a-resumo", {
    user: req.user,
    title: "Resumo",
    timestamp: Date.now()
  });
});

router.get("/a-mnemonica", (req, res) => {
  res.render("dashboard/aluno/a-mnemonica", {
    user: req.user,
    title: "Mnemonica",
    timestamp: Date.now()
  });
});

router.get("/a-feynman", (req, res) => {
  res.render("dashboard/aluno/a-feynman", {
    user: req.user,
    title: "Feynman",
    timestamp: Date.now()
  });
});
router.get("/a-bd_feynman", (req, res) => {
  res.render("dashboard/aluno/a-bd_feynman", {
    user: req.user,
    title: "Feynman",
    timestamp: Date.now()
  });
});
router.get("/a-bd_mnemonicas", (req, res) => {
  res.render("dashboard/aluno/a-bd_mnemonicas", {
    user: req.user,
    title: "Mnemonica",
    timestamp: Date.now()
  });
});
const db = require("../utils/db");
router.get("/a-bd_resumos", async (req, res) => {
  try {
    const resumos = await db.query("SELECT * FROM RESUMOS WHERE ID_USUARIO = ?", [req.user.ID_USUARIO]);
    res.render("dashboard/aluno/a-bd_resumos", {
      user: req.user,
      title: "Resumo",
      timestamp: Date.now(),
      resumos: resumos || []
    });
  } catch (err) {
    res.status(500).send("Erro ao buscar resumos");
  }
});


router.get("/a-meusmateriais", (req, res) => {
  res.render("dashboard/aluno/a-meusmateriais", {
    user: req.user,
    title: "Meus Materiais",
    timestamp: Date.now()
  });
});

router.get("/a-gerenciarplano", (req,res) =>{
  res.render("dashboard/aluno/a-gerenciarplano",{
    user: req.user,
    title: "Gerenciar Plano",
    timestamp: Date.now()
  });
});

// Nova rota para a-page-resumo
router.get("/a-page-resumo", (req, res) => {
  res.render("dashboard/aluno/a-page-resumo", {
    user: req.user,
    title: "Página de Resumo",
    timestamp: Date.now()
  });
});


router.get("/a-todososcursos", (req,res) => {
  res.render("dashboard/aluno/a-todososcursos", {
    user : req.user,
    title : "Cursos",
    timestamp: Date.now()
  });
});

router.get("/a-certificado", (req,res) => {
  res.render("dashboard/aluno/a-certificado", {
    user : req.user,
    title : "Certificados",
    timestamp: Date.now()
  });
});

router.get("/aula", (req,res) => {
  res.render("dashboard/aluno/aula", {
    user : req.user,
    title : "Aula",
    timestamp: Date.now()
  });
});

router.get("/aula-card", (req,res) => {
  res.render("dashboard/aluno/aula-card", {
    user : req.user,
    title : "Aula",
    timestamp: Date.now()
  });
});

router.get("/exercicio", (req,res) => {
  res.render("dashboard/aluno/exercicio", {
    user : req.user,
    title : "Exercicio",
    timestamp: Date.now()
  });
});

router.get("/a-avaliar", (req,res) => {
  res.render("dashboard/aluno/a-avaliar", {
    user : req.user,
    title : "Avaliar",
    timestamp: Date.now()
  });
});

router.get("/quest1_vark", (req,res) => {
  res.render("dashboard/aluno/quest1_vark", {
    user : req.user,
    title : "Questionario Vark",
    timestamp: Date.now()
  });
});

router.get("/quest2_vark", (req,res) => {
  res.render("dashboard/aluno/quest2_vark", {
    user : req.user,
    title : "Questionario Vark",
    timestamp: Date.now()
  });
});

router.get("/quest3_vark", (req,res) => {
  res.render("dashboard/aluno/quest3_vark", {
    user : req.user,
    title : "Questionario Vark",
    timestamp: Date.now()
  });
});

router.get("/quest4_vark", (req,res) => {
  res.render("dashboard/aluno/quest4_vark", {
    user : req.user,
    title : "Questionario Vark",
    timestamp: Date.now()
  });
});

const varkController = require("../controller/varkController");

// Salvar respostas do questionário VARK
router.post("/vark/save", varkController.salvarRespostasVark);

// Endpoint para checar se o usuário já respondeu o VARK
router.get("/vark/respondido", async (req, res) => {
  const query = require("../utils/db").query;
  const userId = req.user.ID_USUARIO;
  try {
    const resultado = await query(
      "SELECT 1 FROM ANALISE_APRENDIZAGEM WHERE ID_USUARIO = ? LIMIT 1",
      [userId]
    );
    res.json({ respondido: resultado && resultado.length > 0 });
  } catch (err) {
    res.status(500).json({ respondido: false, error: err.message });
  }
});

// Mostrar o resultado VARK na tela de conclusão
router.get("/conclusao", varkController.resultadoVark);

router.get("/a-minha-rotina-2", (req,res) => {
  res.render("dashboard/aluno/a-minha-rotina-2", {
    user : req.user,
    timestamp: Date.now(),
    title : "Minha Rotina",
  });
});

router.get("/a-bd_feynman", (req,res) => {
  res.render("dashboard/aluno/a-bd_feynman", {
    user : req.user,
    title : "Feynman",
    timestamp: Date.now()
  });
});

router.get("/a-bd_mnemonicas", (req,res) => {
  res.render("dashboard/aluno/a-bd_mnemonicas", {
    user : req.user,
    title : "Mnemonica",
    timestamp: Date.now()
  });
});

// ROTA DUPLICADA REMOVIDA para evitar conflito com a rota correta de criação de resumo

router.get("/a-mnemonica", (req, res) => {
  res.render("dashboard/aluno/a-mnemonica", {
    user: req.user,
    title: "Mnemônica",
    timestamp: Date.now()
  });
});

router.get("/a-comprar-curso", (req, res) => {
  res.render("dashboard/aluno/a-comprar-curso", {
    user: req.user,
    title: "Todos os Cursos",
    timestamp: Date.now()
  });
});

// Listar todos os resumos do usuário
router.get('/a-bd_resumos', async (req, res) => {
  const db = require('../config/database');
  const [resumos] = await db.query('SELECT * FROM RESUMOS WHERE ID_USUARIO = ?', [req.user.ID_USUARIO]);
  res.render('dashboard/aluno/a-bd_resumos', {
    user: req.user,
    resumos,
    title: 'Meus Resumos',
    timestamp: Date.now()
  });
});

// Formulário para criar novo resumo
router.get('/a-resumos', (req, res) => {
  res.render('dashboard/aluno/a-resumo', {
    user: req.user,
    resumo: null,
    title: 'Novo Resumo',
    timestamp: Date.now()
  });
});

// Salvar novo resumo
router.post('/a-resumos', async (req, res) => {
  const db = require('../config/database');
  const { titulo, categoria, texto_resumo } = req.body;
  await db.query(
    'INSERT INTO RESUMOS (ID_USUARIO, DATA_RESUMO, TEXTO_RESUMO, TITULO, CATEGORIA) VALUES (?, NOW(), ?, ?, ?)',
    [req.user.ID_USUARIO, texto_resumo, titulo, categoria]
  );
  res.redirect('/aluno/a-bd_resumos');
});

// Formulário para editar resumo
router.get('/a-resumos/:id', async (req, res) => {
  const db = require('../config/database');
  const [rows] = await db.query('SELECT * FROM RESUMOS WHERE COD_RESUMO = ? AND ID_USUARIO = ?', [req.params.id, req.user.ID_USUARIO]);
  if (rows.length === 0) return res.redirect('/aluno/a-bd_resumos');
  res.render('dashboard/aluno/a-resumo', {
    user: req.user,
    resumo: rows[0],
    title: 'Editar Resumo',
    timestamp: Date.now()
  });
});

// Atualizar resumo
router.post('/a-resumos/:id', async (req, res) => {
  const db = require('../config/database');
  const { titulo, categoria, texto_resumo } = req.body;
  await db.query(
    'UPDATE RESUMOS SET TEXTO_RESUMO = ?, TITULO = ?, CATEGORIA = ?, DATA_RESUMO = NOW() WHERE COD_RESUMO = ? AND ID_USUARIO = ?',
    [texto_resumo, titulo, categoria, req.params.id, req.user.ID_USUARIO]
  );
  res.redirect('/aluno/a-bd_resumos');
});

// Deletar resumo
router.post('/a-resumos/:id/delete', async (req, res) => {
  const db = require('../config/database');
  await db.query('DELETE FROM RESUMOS WHERE COD_RESUMO = ? AND ID_USUARIO = ?', [req.params.id, req.user.ID_USUARIO]);
  res.redirect('/aluno/a-bd_resumos');
});

router.get("/a-bd_resumos", (req,res) => {
  res.render("dashboard/aluno/a-bd_resumos", {
    user : req.user,
    title : "Resumo",
    timestamp: Date.now()
  });
});

router.get("/pomodoro", (req,res) => {
  res.render("dashboard/aluno/pomodoro", {
    user : req.user,
    title : "Pomodoro",
    timestamp: Date.now()
  });
});

// Rotas para a Home
router.get("/cursos", (req,res) => {
  res.render("pages/home/cursos");
});

router.post("/resumo/save", (req, res) => {
  // Lógica para salvar resumo
});

router.post("/avaliar/save", (req, res) => {
  // Lógica para salvar resumo
});

// Rotas de técnicas
router.get("/tecnicas", (req, res) => {
  res.render("dashboard/aluno/a-config", {
    user: req.user,
    title: "Técnicas de Estudo",
  });
});

// Servir a imagem do banco como endpoint
router.get('/foto-perfil/:id', async (req, res) => {
  const db = require('../config/database');
  try {
    const [rows] = await db.query('SELECT FOTO_PERFIL FROM USUARIO WHERE ID_USUARIO = ?', [req.params.id]);
    if (!rows.length || !rows[0].FOTO_PERFIL) {
      return res.sendFile(path.join(__dirname, '../../public/images/perfil.svg'));
    }
    res.set('Content-Type', 'image/jpeg');
    res.send(rows[0].FOTO_PERFIL);
  } catch (err) {
    res.sendFile(path.join(__dirname, '../../public/images/perfil.svg'));
  }
});

// Rota de logout para destruir a sessão do usuário
router.get('/logout', (req, res, next) => {
  if (req.logout) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  } else {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
});

module.exports = router;

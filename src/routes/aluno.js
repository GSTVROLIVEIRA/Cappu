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


router.get("/a-minha-rotina", (req, res) => {
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
router.get("/a-bd_resumos", (req, res) => {
  res.render("dashboard/aluno/a-bd_resumos", {
    user: req.user,
    title: "Resumo",
    timestamp: Date.now()
  });
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

router.get("/conclusao", (req,res) => {
  res.render("dashboard/aluno/conclusao", {
    user : req.user,
    timestamp: Date.now(),
    title : "Questionario Vark",
  });
});

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

module.exports = router;

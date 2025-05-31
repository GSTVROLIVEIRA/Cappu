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
  });
});

// Upload da foto do perfil
router.post("/upload-foto", upload.single("foto_perfil"), (req, res) => {
  if (!req.file) {
    req.flash('error_msg', 'Nenhum arquivo enviado!');
    return res.redirect("/aluno/a-config");
  }
  // Atualize o campo da foto no banco de dados conforme seu ORM, aqui só atualiza no req.user
  req.user.foto_perfil = `/uploads/alunos/${req.file.filename}`;
  // TODO: Salvar caminho no banco de dados
  res.redirect("/aluno/a-config");
});

// Excluir foto do perfil
router.post("/excluir-foto", (req, res) => {
  if (req.user.foto_perfil) {
    const filePath = path.join(__dirname, '../../public', req.user.foto_perfil);
    fs.unlink(filePath, (err) => {
      // Ignora erro se arquivo não existir
      req.user.foto_perfil = null;
      // TODO: Remover caminho do banco de dados
      res.redirect("/aluno/a-config");
    });
  } else {
    res.redirect("/aluno/a-config");
  }
});

router.get("/a-perfil", (req, res) => {
  res.render("dashboard/aluno/a-perfil", {
    user: req.user,
    title: "Perfil Aluno",
  });
});


router.get("/a-meuscursos", (req, res) => {
  res.render("dashboard/aluno/a-meuscursos", {
    user: req.user,
    title: "Meus Cursos",
  });
});


router.get("/a-minha-rotina", (req, res) => {
  res.render("dashboard/aluno/a-minha-rotina", {
    user: req.user,
    title: "Minha Rotina",
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
  });
});

router.get("/a-mnemonica", (req, res) => {
  res.render("dashboard/aluno/a-mnemonica", {
    user: req.user,
    title: "Mnemonica",
  });
});

router.get("/a-feynman", (req, res) => {
  res.render("dashboard/aluno/a-feynman", {
    user: req.user,
    title: "Feynman",
  });
});
router.get("/a-bd_feynman", (req, res) => {
  res.render("dashboard/aluno/a-bd_feynman", {
    user: req.user,
    title: "Feynman",
  });
});
router.get("/a-bd_mnemonicas", (req, res) => {
  res.render("dashboard/aluno/a-bd_mnemonicas", {
    user: req.user,
    title: "Mnemonica",
  });
});
router.get("/a-bd_resumos", (req, res) => {
  res.render("dashboard/aluno/a-bd_resumos", {
    user: req.user,
    title: "Resumo",
  });
});


router.get("/a-meusmateriais", (req, res) => {
  res.render("dashboard/aluno/a-meusmateriais", {
    user: req.user,
    title: "Meus Materiais",
  });
});

router.get("/a-gerenciarplano", (req,res) =>{
  res.render("dashboard/aluno/a-gerenciarplano",{
    user: req.user,
    title: "Gerenciar Plano",
  });
});


router.get("/a-todososcursos", (req,res) => {
  res.render("dashboard/aluno/a-todososcursos", {
    user : req.user,
    title : "Cursos",
  });
});

router.get("/a-certificado", (req,res) => {
  res.render("dashboard/aluno/a-certificado", {
    user : req.user,
    title : "Certificados",
  });
});

router.get("/aula", (req,res) => {
  res.render("dashboard/aluno/aula", {
    user : req.user,
    title : "Aula",
  });
});

router.get("/aula-card", (req,res) => {
  res.render("dashboard/aluno/aula-card", {
    user : req.user,
    title : "Aula",
  });
});

router.get("/exercicio", (req,res) => {
  res.render("dashboard/aluno/exercicio", {
    user : req.user,
    title : "Exercicio",
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
  });
});

router.get("/quest2_vark", (req,res) => {
  res.render("dashboard/aluno/quest2_vark", {
    user : req.user,
    title : "Questionario Vark",
  });
});

router.get("/quest3_vark", (req,res) => {
  res.render("dashboard/aluno/quest3_vark", {
    user : req.user,
    title : "Questionario Vark",
  });
});

router.get("/quest4_vark", (req,res) => {
  res.render("dashboard/aluno/quest4_vark", {
    user : req.user,
    title : "Questionario Vark",
  });
});

router.get("/conclusao", (req,res) => {
  res.render("dashboard/aluno/conclusao", {
    user : req.user,
    title : "Questionario Vark",
  });
});

router.get("/a-minha-rotina-2", (req,res) => {
  res.render("dashboard/aluno/a-minha-rotina-2", {
    user : req.user,
    title : "Minha Rotina",
  });
});

router.get("/a-bd_feynman", (req,res) => {
  res.render("dashboard/aluno/a-bd_feynman", {
    user : req.user,
    title : "Feynman",
  });
});

router.get("/a-bd_mnemonicas", (req,res) => {
  res.render("dashboard/aluno/a-bd_mnemonicas", {
    user : req.user,
    title : "Mnemonica",
  });
});

router.get("/a-bd_resumos", (req,res) => {
  res.render("dashboard/aluno/a-bd_resumos", {
    user : req.user,
    title : "Resumo",
  });
});

router.get("/pomodoro", (req,res) => {
  res.render("dashboard/aluno/pomodoro", {
    user : req.user,
    title : "Pomodoro",
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

module.exports = router;

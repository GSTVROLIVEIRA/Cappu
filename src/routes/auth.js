const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controller/authControllers");
const { 
  registerValidation, 
  loginValidation, 
  validate 
} = require("../middleware/validators/authValidators");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/authe");

//------------------------------------------------------------------
// Rotas Públicas (acesso sem autenticação)
//------------------------------------------------------------------
router.get("/cl-login", 
  isNotLoggedIn, // Novo middleware
  (req, res) => {
    res.render("auth/cl-login");
  }
);

router.get("/cl-cadastro", 
  isNotLoggedIn, // Novo middleware
  (req, res) => {
    res.render("auth/cl-cadastro", { role: 'aluno' });
  }
);

router.get("/cl-loginmain", 
  isNotLoggedIn,
  (req, res) => {
    res.render("auth/cl-loginmain");
  }
);
router.get("/cl-esq_senha", 
  isNotLoggedIn,
  (req, res) => {
    res.render("auth/cl-esq_senha");
  }
);

router.get("/cl-cod-rec", 
  isNotLoggedIn,
  (req, res) => {
    res.render("auth/cl-cod-rec");
  }
);

//------------------------------------------------------------------
// Processamento de Formulários
//------------------------------------------------------------------
router.post("/cl-cadastro",
  isNotLoggedIn, // Novo
  registerValidation,
  validate,
  authController.register
);

router.post("/cl-login",
  isNotLoggedIn, // Novo
  loginValidation,
  validate,
  (req, res, next) => {
    // Verificar se é uma requisição AJAX
    const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';
    
    passport.authenticate("local", {
      successRedirect: "/dashboard/aluno/a-perfil",
      failureRedirect: "/auth/cl-login",
      failureFlash: true
    }, (err, user, info) => {
      if (err) {
        console.error('Erro de autenticação:', err);
        if (isAjax) {
          return res.json({ success: false, message: err.message || 'Erro interno do servidor' });
        }
        req.flash("error", err.message || 'Erro interno do servidor');
        return res.redirect("/auth/cl-login");
      }
      
      if (!user) {
        if (isAjax) {
          return res.json({ success: false, message: info.message || 'Email ou senha inválidos' });
        }
        req.flash("error", info.message || 'Email ou senha inválidos');
        return res.redirect("/auth/cl-login");
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Erro no login:', err);
          if (isAjax) {
            return res.json({ success: false, message: err.message || 'Erro ao fazer login' });
          }
          req.flash("error", err.message || 'Erro ao fazer login');
          return res.redirect("/auth/cl-login");
        }
        
        // Login bem-sucedido, passar para o próximo middleware
        return next();
      });
    })(req, res, next);
  },
  authController.login
);

//------------------------------------------------------------------
// Rotas de Cadastro Específico
//------------------------------------------------------------------
router.get("/cadastro-aluno", 
  isNotLoggedIn, // Novo
  (req, res) => {
    res.render("auth/register", { 
      role: "aluno",
      formData: req.flash("formData")[0], // Recupera dados em caso de erro
      title: "Cadastro de Aluno" // Novo
    });
  }
);

router.get("/cadastro-professor",
  isNotLoggedIn,
  (req, res) => {
    res.render("auth/cl-cadastro", { role: "professor" });
  }
);

router.post("/cadastro-professor",
  isNotLoggedIn,
  // force role to professor on this route
  (req, res, next) => { req.body.role = 'professor'; next(); },
  registerValidation,
  validate,
  authController.register
);

//------------------------------------------------------------------
// Logout
//------------------------------------------------------------------
router.get("/logout", 
  isLoggedIn, // Novo
  authController.logout
);

module.exports = router;
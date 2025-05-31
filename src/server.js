require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./controller/passport");
const cookieParser = require("cookie-parser");

const app = express();

// ======================
// Configurações Essenciais
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '../public')));

// ======================
// Middlewares
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sua_chave_secreta_segura",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ======================
// Rotas (Mesclando o melhor dos dois)
// ======================
// Rotas principais

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
app.use("/aluno", require("./routes/aluno"));
app.use("/professor", require("./routes/professor"));

// Rotas de redirecionamento (do segundo arquivo)
app.get("/login", (req, res) => res.redirect("/auth/login"));
app.get("/cadastro", (req, res) => res.redirect("/auth/register"));

// Rotas dinâmicas (do segundo arquivo)
app.get("/curso/:nome", (req, res) => {
  const viewName = `c-${req.params.nome}`;
  res.render(`courses/${viewName}`, {
    curso: {
      professor: "Professor Exemplo",
      duracao: "8 Meses",
      valor: "728,90"
    }
  });
});

app.get("/institucional/:pagina", (req, res) => {
  const viewPage = `inst-${req.params.pagina}`;
  res.render(`pages/institucional/${viewPage}`);
});



  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Erro no banco de dados:", err));
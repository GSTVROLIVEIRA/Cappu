
const bcrypt = require("bcryptjs");
const { query } = require("../utils/db");

module.exports = {
  async register(req, res) {
    try {
      const { name, email, password, role, document } = req.body;
      console.log('Dados recebidos:', req.body);

      if ([name, email, password, role].some(field => !field?.trim())) {
        if (req.xhr) {
          return res.json({ success: false, message: "Todos os campos são obrigatórios" });
        }
        throw new Error("Todos os campos são obrigatórios");
      }

      const existingUser = await query('SELECT * FROM USUARIO WHERE EMAIL = ?', [email]);
      if (existingUser.length > 0) {
        if (req.xhr) {
          return res.json({ success: false, message: "Email já cadastrado" });
        }
        throw new Error("Email já cadastrado");
      }

      // Obter o próximo ID_USUARIO disponível
      const maxIdResult = await query('SELECT COALESCE(MAX(ID_USUARIO), 0) as maxId FROM USUARIO');
      const nextId = maxIdResult[0].maxId + 1;

      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Inserir na tabela USUARIO com todos os campos obrigatórios
      const result = await query(`
        INSERT INTO USUARIO (
          ID_USUARIO, NOME_USU, EMAIL, SENHA, TIPO_USUARIO, 
          ID_STATUS, DATA_CADASTRO, TELEFONE, ENDERECO, DT_NASC,
          NUM_IDENTIFICACAO, COR_TELA, FOTO_PERFIL
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, NULL)
      `, [
        nextId,                    // ID_USUARIO
        name,                      // NOME_USU
        email,                     // EMAIL
        hashedPassword,            // SENHA
        role,                      // TIPO_USUARIO
        1,                         // ID_STATUS (ativo)
        '',                        // TELEFONE (vazio)
        '',                        // ENDERECO (vazio)
        new Date(),                // DT_NASC (data atual)
        document || '',            // NUM_IDENTIFICACAO (CPF/CNPJ do formulário)
        0                          // COR_TELA (0)
      ]);

      console.log('Usuário cadastrado com sucesso:', result);
      
      // Verificar se a solicitação é AJAX
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ 
          success: true, 
          message: 'Cadastro realizado com sucesso!', 
          redirect: '/auth/cl-login' 
        });
      }
      
      // Redirecionamento tradicional
      req.flash("success", "Cadastro realizado com sucesso!");
      res.redirect("/aluno/a-perfil");
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Verificar se a solicitação é AJAX
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({ 
          success: false, 
          message: error.message || 'Erro ao cadastrar usuário' 
        });
      }
      
      // Redirecionamento tradicional
      req.flash("error", error.message || 'Erro ao cadastrar usuário');
      const userRole = req.body?.role || 'aluno';
      if (userRole === 'professor') {
        res.redirect("/auth/cadastro-professor");
      } else {
        res.redirect("/auth/cl-cadastro");
      }
    }
  },

  login(req, res) {
    // Determinar para onde redirecionar com base no papel do usuário
    let redirectTo;
    if (req.session.returnTo) {
      redirectTo = req.session.returnTo;
    } else if (req.user.TIPO_USUARIO === 'aluno' || req.user.role === 'aluno') {
      redirectTo = '/aluno/a-perfil';
    } else if (req.user.TIPO_USUARIO === 'professor' || req.user.role === 'professor') {
      redirectTo = '/professor/p-professor';
    } else {
      redirectTo = `/${req.user.TIPO_USUARIO || req.user.role || ''}`;
    }
    delete req.session.returnTo;
    
    // Verificar se a solicitação é AJAX
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.json({ 
        success: true, 
        message: 'Login realizado com sucesso!', 
        redirect: redirectTo 
      });
    }
    
    // Redirecionamento tradicional
    res.redirect(redirectTo);
  },

  logout(req, res) {
    req.logout(err => {
      if (err) console.error(err);
      res.redirect("/");
    });
  }
};

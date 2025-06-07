// JS dinâmico para adicionar/remover módulos e aulas na criação de curso

// Usando um namespace para evitar conflitos
const CursoManager = {
  modulos: [],
  
  init() {
    if (window.cursoModulos && Array.isArray(window.cursoModulos)) {
      this.modulos = window.cursoModulos;
    }
    this.renderModulos();
  },

  renderModulos() {
    const modulosContainer = document.getElementById('modulosContainer');
    if (!modulosContainer) return;
    
    modulosContainer.innerHTML = '';
    this.modulos.forEach((modulo, i) => {
      const moduloDiv = document.createElement('div');
      moduloDiv.className = 'modulo-bloco';
      moduloDiv.innerHTML = `
        <h3>Módulo ${i + 1}</h3>
        <input id="modulo-titulo-${i}" type="text" placeholder="Título do módulo" 
               value="${modulo.titulo || ''}" 
               onchange="CursoManager.updateModuloTitulo(${i}, this.value)" required />
        <textarea id="modulo-desc-${i}" placeholder="Descrição do módulo" 
                  onchange="CursoManager.updateModuloDescricao(${i}, this.value)" 
                  required>${modulo.descricao || ''}</textarea>
        <button type="button" onclick="CursoManager.removeModulo(${i})">Remover módulo</button>
        <div class="aulas">
          <h4>Aulas</h4>
          ${(modulo.aulas || []).map((aula, j) => `
            <div class="aula-bloco">
              <input id="aula-titulo-${i}-${j}" type="text" placeholder="Título da aula" 
                     value="${aula.titulo || ''}" 
                     onchange="CursoManager.updateAulaTitulo(${i},${j},this.value)" required />
              <textarea id="aula-desc-${i}-${j}" placeholder="Descrição da aula" 
                        onchange="CursoManager.updateAulaDescricao(${i},${j},this.value)" 
                        required>${aula.descricao || ''}</textarea>
              <button type="button" onclick="CursoManager.removeAula(${i},${j})">Remover aula</button>
            </div>
          `).join('')}
          <button type="button" onclick="CursoManager.addAula(${i})">Adicionar aula</button>
        </div>
      `;
      modulosContainer.appendChild(moduloDiv);
    });
    
    // Adiciona o botão de adicionar módulo se não existir
    if (!document.getElementById('addModuloBtn')) {
      const addBtn = document.createElement('button');
      addBtn.id = 'addModuloBtn';
      addBtn.type = 'button';
      addBtn.textContent = 'Adicionar Módulo';
      addBtn.onclick = () => this.addModulo();
      modulosContainer.appendChild(addBtn);
    }
  },
  
  addModulo() {
    this.modulos.push({ titulo: '', descricao: '', aulas: [] });
    this.renderModulos();
    this.showNotify('success', 'Módulo adicionado!');
  },
  
  removeModulo(index) {
    if (index >= 0 && index < this.modulos.length) {
      this.modulos.splice(index, 1);
      this.renderModulos();
      this.showNotify('success', 'Módulo removido!');
    }
  },
  
  updateModuloTitulo(index, value) {
    if (this.modulos[index]) {
      this.modulos[index].titulo = value;
    }
  },
  
  updateModuloDescricao(index, value) {
    if (this.modulos[index]) {
      this.modulos[index].descricao = value;
    }
  },
  
  addAula(moduloIndex) {
    if (this.modulos[moduloIndex]) {
      this.modulos[moduloIndex].aulas = this.modulos[moduloIndex].aulas || [];
      this.modulos[moduloIndex].aulas.push({ titulo: '', descricao: '' });
      this.renderModulos();
      this.showNotify('success', 'Aula adicionada!');
    }
  },
  
  removeAula(moduloIndex, aulaIndex) {
    if (this.modulos[moduloIndex] && this.modulos[moduloIndex].aulas) {
      this.modulos[moduloIndex].aulas.splice(aulaIndex, 1);
      this.renderModulos();
      this.showNotify('success', 'Aula removida!');
    }
  },
  
  updateAulaTitulo(moduloIndex, aulaIndex, value) {
    if (this.modulos[moduloIndex] && this.modulos[moduloIndex].aulas && this.modulos[moduloIndex].aulas[aulaIndex]) {
      this.modulos[moduloIndex].aulas[aulaIndex].titulo = value;
    }
  },
  
  updateAulaDescricao(moduloIndex, aulaIndex, value) {
    if (this.modulos[moduloIndex] && this.modulos[moduloIndex].aulas && this.modulos[moduloIndex].aulas[aulaIndex]) {
      this.modulos[moduloIndex].aulas[aulaIndex].descricao = value;
    }
  },
  
  validateForm() {
    let valid = true;
    document.querySelectorAll('.campo-invalido').forEach(el => el.classList.remove('campo-invalido'));
    
    this.modulos.forEach((modulo, i) => {
      if (!modulo.titulo) {
        valid = false;
        this.highlightInvalidField(`#modulo-titulo-${i}`);
      }
      if (!modulo.descricao) {
        valid = false;
        this.highlightInvalidField(`#modulo-desc-${i}`);
      }
      
      (modulo.aulas || []).forEach((aula, j) => {
        if (!aula.titulo) {
          valid = false;
          this.highlightInvalidField(`#aula-titulo-${i}-${j}`);
        }
        if (!aula.descricao) {
          valid = false;
          this.highlightInvalidField(`#aula-desc-${i}-${j}`);
        }
      });
    });
    
    return valid;
  },
  
  highlightInvalidField(selector) {
    const el = document.querySelector(selector);
    if (el) el.classList.add('campo-invalido');
  },
  
  showNotify(status, text) {
    if (window.SimpleNotify) {
      new SimpleNotify({
        status: status,
        title: status === 'success' ? 'Sucesso' : 'Erro',
        text: text,
        timeout: 3000
      });
    } else if (window.Notify) {
      new Notify({ 
        status, 
        title: status === 'success' ? 'Sucesso' : 'Erro', 
        text, 
        position: 'left top' 
      });
    } else {
      alert(`${status.toUpperCase()}: ${text}`);
    }
  },
  
  initForm() {
    const form = document.querySelector('form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        
        if (!this.validateForm()) {
          this.showNotify('error', 'Preencha todos os campos obrigatórios de módulos e aulas!');
          return false;
        }
        
        const modulosInput = document.createElement('input');
        modulosInput.type = 'hidden';
        modulosInput.name = 'modulos';
        modulosInput.value = JSON.stringify(this.modulos);
        form.appendChild(modulosInput);
        form.submit();
      };
    }
  }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  CursoManager.init();
  CursoManager.initForm();
  
  // Torna o gerenciador disponível globalmente
  window.CursoManager = CursoManager;
});

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
        <div class="modulo-header">
          <h3>Módulo ${i + 1}: ${modulo.titulo || 'Sem título'}</h3>
          <div class="modulo-actions">
            <button type="button" class="btn btn-sm btn-outline-primary" 
                    onclick="CursoManager.openAulaModal(${i})">
              <i class="fas fa-plus"></i> Adicionar Aula
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" 
                    onclick="CursoManager.removeModulo(${i})">
              <i class="fas fa-trash"></i> Remover
            </button>
          </div>
        </div>
        <div class="modulo-body">
          <div class="form-group">
            <label for="modulo-titulo-${i}">Título do Módulo</label>
            <input id="modulo-titulo-${i}" type="text" class="form-control" 
                   placeholder="Título do módulo" 
                   value="${modulo.titulo || ''}" 
                   onchange="CursoManager.updateModuloTitulo(${i}, this.value)" required />
          </div>
          <div class="form-group">
            <label for="modulo-desc-${i}">Descrição do Módulo</label>
            <textarea id="modulo-desc-${i}" class="form-control" 
                      placeholder="Descrição do módulo" 
                      onchange="CursoManager.updateModuloDescricao(${i}, this.value)" 
                      rows="3">${modulo.descricao || ''}</textarea>
          </div>
          
          <div class="aulas">
            <h5>Aulas</h5>
            ${(modulo.aulas || []).length > 0 ? `
              <div class="list-group">
                ${(modulo.aulas || []).map((aula, j) => `
                  <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="mb-1">${aula.titulo || 'Aula sem título'}</h6>
                        <small class="text-muted">
                          ${aula.tipo_conteudo === 'video' ? '🎥 Vídeo' : '📝 Texto'} 
                          ${aula.duracao ? `• ${aula.duracao}` : ''}
                        </small>
                      </div>
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-primary" 
                                onclick="CursoManager.openAulaModal(${i}, ${j}); event.stopPropagation();">
                          <i class="fas fa-edit"></i> Editar
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger" 
                                onclick="CursoManager.removeAula(${i}, ${j}); event.stopPropagation();">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="alert alert-info">
                Nenhuma aula adicionada a este módulo. Clique em "Adicionar Aula" para começar.
              </div>
            `}
          </div>
        </div>
      `;
      modulosContainer.appendChild(moduloDiv);
    });
    
    // Garante que o botão de adicionar módulo existe e tem o evento configurado corretamente
    const addModuloBtn = document.getElementById('addModuloBtn');
    if (addModuloBtn) {
      addModuloBtn.onclick = () => this.addModulo();
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
      this.modulos[moduloIndex].aulas.push({
        titulo: '',
        descricao: '',
        tipo_conteudo: 'video',
        video_url: '',
        duracao: '00:10:00',
        ordem: (this.modulos[moduloIndex].aulas.length + 1),
        ID_AULA: null
      });
      this.renderModulos();
      this.showNotify('success', 'Aula adicionada!');
    }
  },
  
  // Abre o modal de adicionar/editar aula
  openAulaModal(moduloIndex, aulaIndex = null) {
    const modal = document.getElementById('aulaModal');
    const form = document.getElementById('aulaForm');
    const modalTitle = document.getElementById('aulaModalLabel');
    
    // Se for edição, preenche os campos
    if (aulaIndex !== null && this.modulos[moduloIndex]?.aulas?.[aulaIndex]) {
      const aula = this.modulos[moduloIndex].aulas[aulaIndex];
      modalTitle.textContent = 'Editar Aula';
      form.elements['titulo'].value = aula.titulo || '';
      form.elements['descricao'].value = aula.descricao || '';
      form.elements['tipo_conteudo'].value = aula.tipo_conteudo || 'video';
      form.elements['video_url'].value = aula.video_url || '';
      form.elements['duracao'].value = aula.duracao || '00:10:00';
      form.elements['ordem'].value = aula.ordem || (this.modulos[moduloIndex].aulas.length + 1);
      form.dataset.moduloIndex = moduloIndex;
      form.dataset.aulaIndex = aulaIndex;
      
      // Atualiza a visualização do tipo de conteúdo
      this.toggleVideoFields();
    } else {
      // Nova aula
      modalTitle.textContent = 'Nova Aula';
      form.reset();
      form.elements['tipo_conteudo'].value = 'video';
      form.elements['duracao'].value = '00:10:00';
      form.elements['ordem'].value = this.modulos[moduloIndex]?.aulas?.length + 1 || 1;
      form.dataset.moduloIndex = moduloIndex;
      form.dataset.aulaIndex = '';
      
      // Atualiza a visualização do tipo de conteúdo
      this.toggleVideoFields();
    }
    
    // Mostra o modal
    new bootstrap.Modal(modal).show();
  },
  
  // Salva os dados da aula do modal
  saveAulaFromModal() {
    const form = document.getElementById('aulaForm');
    const moduloIndex = parseInt(form.dataset.moduloIndex);
    const aulaIndex = form.dataset.aulaIndex !== '' ? parseInt(form.dataset.aulaIndex) : null;
    const fileInput = document.getElementById('video_arquivo');
    
    if (moduloIndex === undefined || isNaN(moduloIndex)) {
      this.showNotify('error', 'Erro ao identificar o módulo da aula.');
      return;
    }
    
    const formData = new FormData(form);
    const aulaData = {
      titulo: formData.get('titulo') || '',
      descricao: formData.get('descricao') || '',
      tipo_conteudo: formData.get('tipo_conteudo') || 'video',
      video_url: formData.get('video_url') || '',
      duracao: formData.get('duracao') || '00:10:00',
      ordem: parseInt(formData.get('ordem')) || 1,
      ID_AULA: null
    };
    
    // Validação básica
    if (!aulaData.titulo) {
      this.showNotify('error', 'O título da aula é obrigatório.');
      return false;
    }
    
    // Verifica se há um arquivo para upload
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.size > 500 * 1024 * 1024) { // 500MB
        this.showNotify('error', 'O arquivo é muito grande. O tamanho máximo permitido é 500MB.');
        return false;
      }
      
      // Adiciona informações do arquivo
      aulaData.ARQUIVO = file.name;
      aulaData.TAMANHO_ARQUIVO = file.size;
      aulaData.TIPO_ARQUIVO = file.type;
      
      // Aqui você pode adicionar o upload do arquivo para o servidor
      // Por enquanto, apenas simulamos que o arquivo foi salvo
      this.showNotify('info', 'Fazendo upload do arquivo...');
      
      // Simulando upload (substitua por chamada real para o servidor)
      setTimeout(() => {
        this.finalizarSalvamentoAula(moduloIndex, aulaIndex, aulaData);
      }, 1000);
      
      return true;
    } else if (aulaData.tipo_conteudo === 'video' && !aulaData.video_url) {
      this.showNotify('error', 'Para conteúdo de vídeo, é necessário informar uma URL ou enviar um arquivo.');
      return false;
    } else {
      // Se não houver arquivo para upload, salva diretamente
      return this.finalizarSalvamentoAula(moduloIndex, aulaIndex, aulaData);
    }
  },
  
  // Finaliza o salvamento da aula após o upload do arquivo (se houver)
  finalizarSalvamentoAula(moduloIndex, aulaIndex, aulaData) {
    // Atualiza ou adiciona a aula
    if (aulaIndex !== null && !isNaN(aulaIndex) && this.modulos[moduloIndex]?.aulas?.[aulaIndex]) {
      // Mantém o ID se estiver editando
      aulaData.ID_AULA = this.modulos[moduloIndex].aulas[aulaIndex].ID_AULA;
      this.modulos[moduloIndex].aulas[aulaIndex] = { ...this.modulos[moduloIndex].aulas[aulaIndex], ...aulaData };
    } else {
      // Adiciona nova aula
      this.modulos[moduloIndex].aulas = this.modulos[moduloIndex].aulas || [];
      this.modulos[moduloIndex].aulas.push(aulaData);
    }
    
    // Reorganiza as aulas pela ordem
    this.modulos[moduloIndex].aulas.sort((a, b) => a.ordem - b.ordem);
    
    // Atualiza a interface
    this.renderModulos();
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('aulaModal'));
    if (modal) modal.hide();
    
    this.showNotify('success', 'Aula salva com sucesso!');
    return true;
  },
  
  // Alterna a visibilidade dos campos de vídeo
  toggleVideoFields() {
    const tipoConteudo = document.querySelector('#aulaForm select[name="tipo_conteudo"]');
    const videoUrlGroup = document.querySelector('#videoUrlGroup');
    
    if (tipoConteudo && videoUrlGroup) {
      if (tipoConteudo.value === 'video') {
        videoUrlGroup.style.display = 'block';
      } else {
        videoUrlGroup.style.display = 'none';
      }
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

// ============================================
// FRONTEND MASTER PATH - SISTEMA PRINCIPAL
// ============================================

// Configurações Globais
const CONFIG = {
  tema: "dark-tech",
  progressoInicial: 15,
  pontosPorMissao: 50,
  localStorageKeys: {
    progresso: "frontendMasterProgresso",
    codigoSalvo: "frontendLabCode",
    interacoes: "labInteracoes",
    tema: "temaTech",
    conquistas: "conquistasDesbloqueadas",
  },
};

// Estado da Aplicação
const AppState = {
  progresso: {
    pontos: 0,
    nivel: "Iniciante",
    conclusao: 0,
  },
  temaAtivo: "dark-tech",
  codigoSalvo: null,
  conquistas: new Set(),
};

// Sistema de Módulos
const FrontEndMaster = (function () {
  // Elementos DOM
  let elementos = {};

  // Inicialização
  function init() {
    console.log("🚀 FrontEnd Master Path Inicializado");

    // Coletar elementos DOM
    cacheElementos();

    // Carregar estado salvo
    carregarEstado();

    // Configurar eventos
    configurarEventos();

    // Inicializar sistemas
    initSistemaNavegacao();
    initLaboratorio();
    initSistemaMissoes();
    initSistemaConquistas();

    // Efeitos visuais
    initEfeitosVisuais();

    // Atualizar UI inicial
    atualizarUI();

    console.log("✅ Sistema inicializado com sucesso");
  }

  // Cache de elementos DOM
  function cacheElementos() {
    elementos = {
      // Navegação
      navLinks: document.querySelectorAll(".nav-link"),
      menuToggle: document.querySelector(".menu-toggle"),
      navLinksContainer: document.querySelector(".nav-links"),

      // Laboratório
      tabs: document.querySelectorAll(".tab"),
      codeEditors: document.querySelectorAll(".code-editor"),
      htmlCode: document.getElementById("html-code"),
      cssCode: document.getElementById("css-code"),
      jsCode: document.getElementById("js-code"),
      previewFrame: document.getElementById("preview-frame"),
      btnExecutar: document.getElementById("btn-executar"),
      btnReset: document.getElementById("btn-reset"),
      btnSolution: document.getElementById("btn-solution"),
      btnSave: document.getElementById("btn-save"),
      runButtons: document.querySelectorAll(".btn-run"),

      // Missões
      btnMissoes: document.querySelectorAll(".btn-missao"),
      progressoFill: document.querySelector(".progresso-fill"),
      pontosElement: document.querySelector(".pontos"),
      nivelTag: document.querySelector(".nivel-tag"),

      // Conquistas
      conquistas: document.querySelectorAll(".conquista"),

      // Desafios
      desafioBotoes: document.querySelectorAll(".lab-challenges .btn-small"),

      // Progresso
      heroTitle: document.querySelector(".hero-title"),

      // Controles
      btnResettar: document.querySelector(".btn-reset"),
      btnSolucao: document.querySelector(".btn-solution"),
    };
  }

  // Carregar estado salvo
  function carregarEstado() {
    // Progresso
    const progressoSalvo = localStorage.getItem(
      CONFIG.localStorageKeys.progresso
    );
    if (progressoSalvo) {
      AppState.progresso = JSON.parse(progressoSalvo);
    } else {
      AppState.progresso = {
        pontos: 150,
        nivel: "Iniciante",
        conclusao: CONFIG.progressoInicial,
      };
    }

    // Tema
    AppState.temaAtivo =
      localStorage.getItem(CONFIG.localStorageKeys.tema) || CONFIG.tema;

    // Código salvo
    const codigoSalvo = localStorage.getItem(
      CONFIG.localStorageKeys.codigoSalvo
    );
    if (codigoSalvo) {
      AppState.codigoSalvo = JSON.parse(codigoSalvo);
      if (elementos.htmlCode && AppState.codigoSalvo.html) {
        elementos.htmlCode.value = AppState.codigoSalvo.html;
      }
      if (elementos.cssCode && AppState.codigoSalvo.css) {
        elementos.cssCode.value = AppState.codigoSalvo.css;
      }
      if (elementos.jsCode && AppState.codigoSalvo.js) {
        elementos.jsCode.value = AppState.codigoSalvo.js;
      }
    }

    // Conquistas
    const conquistasSalvas = localStorage.getItem(
      CONFIG.localStorageKeys.conquistas
    );
    if (conquistasSalvas) {
      AppState.conquistas = new Set(JSON.parse(conquistasSalvas));
    }

    // Interações
    AppState.interacoes = parseInt(
      localStorage.getItem(CONFIG.localStorageKeys.interacoes) || "0"
    );
  }

  // Salvar estado
  function salvarEstado() {
    localStorage.setItem(
      CONFIG.localStorageKeys.progresso,
      JSON.stringify(AppState.progresso)
    );
    localStorage.setItem(CONFIG.localStorageKeys.tema, AppState.temaAtivo);
    localStorage.setItem(
      CONFIG.localStorageKeys.conquistas,
      JSON.stringify([...AppState.conquistas])
    );
    localStorage.setItem(
      CONFIG.localStorageKeys.interacoes,
      AppState.interacoes?.toString() || "0"
    );
  }

  // Configurar eventos
  function configurarEventos() {
    // Salvar estado antes de fechar a página
    window.addEventListener("beforeunload", salvarEstado);

    // Salvar estado periodicamente
    setInterval(salvarEstado, 30000); // A cada 30 segundos

    // Registrar interações
    document.addEventListener("click", registrarInteracao);
    document.addEventListener("keydown", registrarInteracao);
  }

  // Registrar interação do usuário
  function registrarInteracao() {
    AppState.interacoes = (AppState.interacoes || 0) + 1;
    localStorage.setItem(
      CONFIG.localStorageKeys.interacoes,
      AppState.interacoes.toString()
    );

    // Verificar conquistas baseadas em interações
    verificarConquistasInteracao();
  }

  // ============================================
  // SISTEMA DE NAVEGAÇÃO
  // ============================================

  function initSistemaNavegacao() {
    if (!elementos.navLinks || !elementos.menuToggle) return;

    // Navegação suave
    elementos.navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (this.hash) {
          e.preventDefault();
          navegarPara(this.hash, this);
        }
      });
    });

    // Menu mobile
    elementos.menuToggle.addEventListener("click", toggleMenuMobile);

    // Fechar menu ao clicar fora (para mobile)
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar") && window.innerWidth < 768) {
        if (elementos.navLinksContainer.style.display === "flex") {
          elementos.navLinksContainer.style.display = "none";
        }
      }
    });

    // Atualizar link ativo baseado no scroll
    window.addEventListener("scroll", atualizarLinkAtivo);
  }

  function navegarPara(hash, linkElement) {
    const target = document.querySelector(hash);
    if (!target) return;

    // Atualizar link ativo
    elementos.navLinks.forEach((l) => l.classList.remove("active"));
    linkElement.classList.add("active");

    // Scroll suave
    const offset = 80;
    const targetPosition = target.offsetTop - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Fechar menu mobile
    if (window.innerWidth < 768 && elementos.navLinksContainer) {
      elementos.navLinksContainer.style.display = "none";
    }
  }

  function toggleMenuMobile() {
    const nav = elementos.navLinksContainer;
    if (!nav) return;

    if (nav.style.display === "flex") {
      nav.style.display = "none";
    } else {
      nav.style.display = "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "100%";
      nav.style.left = "0";
      nav.style.width = "100%";
      nav.style.backgroundColor = "var(--bg-primary)";
      nav.style.padding = "20px";
      nav.style.borderTop = "1px solid var(--border-color)";
      nav.style.gap = "15px";
      nav.style.zIndex = "1000";
    }
  }

  function atualizarLinkAtivo() {
    const scrollPosition = window.scrollY + 100;

    elementos.navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  // ============================================
  // LABORATÓRIO DE CÓDIGO
  // ============================================

  function initLaboratorio() {
    if (!elementos.tabs || elementos.tabs.length === 0) return;

    // Sistema de abas
    elementos.tabs.forEach((tab) => {
      tab.addEventListener("click", () => ativarAba(tab.dataset.tab));
    });

    // Botões de execução
    elementos.runButtons.forEach((btn) => {
      btn.addEventListener("click", executarCodigo);
    });

    if (elementos.btnExecutar) {
      elementos.btnExecutar.addEventListener("click", executarCodigo);
    }

    // Botão resetar
    if (elementos.btnReset) {
      elementos.btnReset.addEventListener("click", resetarCodigo);
    }

    if (elementos.btnResettar) {
      elementos.btnResettar.addEventListener("click", resetarCodigo);
    }

    // Botão solução
    if (elementos.btnSolution) {
      elementos.btnSolution.addEventListener("click", mostrarSolucaoCompleta);
    }

    if (elementos.btnSolucao) {
      elementos.btnSolucao.addEventListener("click", mostrarSolucaoCompleta);
    }

    // Botão salvar
    if (elementos.btnSave) {
      elementos.btnSave.addEventListener("click", salvarCodigo);
    }

    // Desafios rápidos
    if (elementos.desafioBotoes) {
      elementos.desafioBotoes.forEach((botao, index) => {
        botao.addEventListener("click", () => aplicarDesafio(index));
      });
    }

    // Auto-executar ao digitar (com debounce)
    if (elementos.htmlCode) {
      elementos.htmlCode.addEventListener(
        "input",
        debounce(executarCodigo, 1000)
      );
    }
    if (elementos.cssCode) {
      elementos.cssCode.addEventListener(
        "input",
        debounce(executarCodigo, 1000)
      );
    }
    if (elementos.jsCode) {
      elementos.jsCode.addEventListener(
        "input",
        debounce(executarCodigo, 1000)
      );
    }

    // Inicializar preview
    setTimeout(executarCodigo, 500);
  }

  function ativarAba(abaId) {
    // Ativar tab
    elementos.tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === abaId);
    });

    // Mostrar editor correspondente
    elementos.codeEditors.forEach((editor) => {
      editor.classList.toggle("active", editor.id === `${abaId}-editor`);
    });

    // Se for a aba de resultado, atualizar
    if (abaId === "result") {
      executarCodigo();
    }
  }

  function executarCodigo() {
    if (!elementos.htmlCode || !elementos.previewFrame) return;

    const html = elementos.htmlCode.value;
    const css = elementos.cssCode
      ? `<style>${elementos.cssCode.value}</style>`
      : "";
    const js = elementos.jsCode
      ? `<script>${elementos.jsCode.value}<\/script>`
      : "";

    const fullCode = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${css}
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #1a1a2e;
                        color: #fff;
                        min-height: 100vh;
                        box-sizing: border-box;
                    }
                    * {
                        box-sizing: border-box;
                    }
                </style>
            </head>
            <body>
                ${html}
                ${js}
            </body>
            </html>
        `;

    elementos.previewFrame.srcdoc = fullCode;

    // Registrar execução
    AppState.interacoes++;
    verificarConquista("executor");
  }

  function resetarCodigo() {
    if (!elementos.htmlCode) return;

    // Código padrão
    const codigoPadrao = {
      html: `<!DOCTYPE html>
<html>
<head>
    <title>Meu Laboratório</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #1a1a2e;
            color: #fff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
            padding: 30px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            background: linear-gradient(90deg, #00dbde, #fc00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 2.5rem;
        }
        p {
            line-height: 1.6;
            font-size: 1.1rem;
            color: #b0b0d0;
            margin: 20px 0;
        }
        button {
            background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(106, 17, 203, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Olá, Dev!</h1>
        <p>Este é seu laboratório de código interativo.</p>
        <p id="mensagem">Clique no botão para ver a mágica acontecer.</p>
        <button onclick="mudarMensagem()">Clique Aqui</button>
    </div>
    
    <script>
        function mudarMensagem() {
            const mensagem = document.getElementById("mensagem");
            mensagem.textContent = "JavaScript executado com sucesso! 🎉";
            mensagem.style.color = "#00ff88";
            mensagem.style.fontSize = "1.3rem";
            mensagem.style.fontWeight = "bold";
        }
    </script>
</body>
</html>`,

      css: `/* Adicione seus estilos CSS aqui */
.container {
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

h1 {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

#mensagem {
    transition: all 0.3s ease;
    min-height: 24px;
}`,

      js: `// Adicione sua lógica JavaScript aqui

console.log('Laboratório pronto! ✨');

function mudarMensagem() {
    const mensagem = document.getElementById("mensagem");
    const cores = ['#00ff88', '#00dbde', '#fc00ff', '#ffcc00', '#ff0055'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    
    mensagem.textContent = "JavaScript executado com sucesso! 🎉";
    mensagem.style.color = corAleatoria;
    mensagem.style.fontSize = "1.3rem";
    mensagem.style.fontWeight = "bold";
    
    // Efeito adicional
    mensagem.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.1)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
    ], {
        duration: 300,
        iterations: 1
    });
    
    // Adicionar notificação visual
    criarNotificacao('Código executado!', 'success');
}

function criarNotificacao(texto, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.textContent = texto;
    notificacao.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: \${tipo === 'success' ? '#00ff88' : '#6a11cb'};
        color: #1a1a2e;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        animation: slideIn 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    \`;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    }, 2000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = \`
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
\`;
document.head.appendChild(style);`,
    };

    // Aplicar código padrão
    elementos.htmlCode.value = codigoPadrao.html;
    if (elementos.cssCode) elementos.cssCode.value = codigoPadrao.css;
    if (elementos.jsCode) elementos.jsCode.value = codigoPadrao.js;

    // Executar
    executarCodigo();

    // Feedback
    mostrarNotificacao(
      "Código Resetado",
      "O laboratório foi reiniciado com o código padrão.",
      "info"
    );
  }

  function mostrarSolucaoCompleta() {
    if (!elementos.htmlCode) return;

    const solucao = {
      html: `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solução Avançada - FrontEnd Master</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #fff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .app-container {
            max-width: 800px;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 40px;
            border: 1px solid rgba(106, 17, 203, 0.3);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .title {
            font-size: 2.8rem;
            background: linear-gradient(90deg, #00dbde, #fc00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #b0b0d0;
            font-size: 1.1rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .card:hover {
            transform: translateY(-5px);
            border-color: #6a11cb;
            box-shadow: 0 10px 20px rgba(106, 17, 203, 0.2);
        }
        
        .card i {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #00dbde;
        }
        
        .card h3 {
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .card p {
            color: #8888aa;
            font-size: 0.9rem;
        }
        
        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 30px;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(90deg, #6a11cb, #2575fc);
            color: white;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(106, 17, 203, 0.3);
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            background: linear-gradient(90deg, #00ff88, #00dbde);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .stat-label {
            color: #8888aa;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .counter {
            text-align: center;
            margin: 30px 0;
            font-size: 1.2rem;
        }
        
        #contador {
            font-size: 2rem;
            color: #00ff88;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .dynamic-content {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            min-height: 100px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .app-container {
            animation: fadeIn 0.8s ease;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="header">
            <h1 class="title">Solução Avançada</h1>
            <p class="subtitle">Demonstração completa de HTML, CSS e JavaScript integrados</p>
        </div>
        
        <div class="dashboard">
            <div class="card" onclick="showAlert('HTML5', 'Estrutura semântica e organização do conteúdo')">
                <i class="fas fa-code"></i>
                <h3>HTML5</h3>
                <p>Estrutura semântica e acessibilidade</p>
            </div>
            
            <div class="card" onclick="showAlert('CSS3', 'Estilização moderna e responsiva')">
                <i class="fas fa-palette"></i>
                <h3>CSS3</h3>
                <p>Design responsivo e animações</p>
            </div>
            
            <div class="card" onclick="showAlert('JavaScript', 'Lógica e interatividade avançada')">
                <i class="fas fa-cogs"></i>
                <h3>JavaScript</h3>
                <p>Manipulação dinâmica do DOM</p>
            </div>
            
            <div class="card" onclick="addDynamicCard()">
                <i class="fas fa-plus-circle"></i>
                <h3>Dinâmico</h3>
                <p>Clique para adicionar cards</p>
            </div>
        </div>
        
        <div class="controls">
            <button class="btn btn-primary" onclick="incrementCounter()">
                <i class="fas fa-plus"></i> Incrementar
            </button>
            <button class="btn btn-secondary" onclick="changeTheme()">
                <i class="fas fa-moon"></i> Alterar Tema
            </button>
            <button class="btn btn-primary" onclick="fetchData()">
                <i class="fas fa-cloud-download-alt"></i> Buscar Dados
            </button>
            <button class="btn btn-secondary" onclick="resetAll()">
                <i class="fas fa-redo"></i> Resetar
            </button>
        </div>
        
        <div class="counter">
            <p>Contador de Interações:</p>
            <div id="contador">0</div>
            <button class="btn btn-secondary" onclick="startAutoCounter()">
                <i class="fas fa-play"></i> Auto Contador
            </button>
        </div>
        
        <div class="dynamic-content" id="dynamicContent">
            <p>Conteúdo dinâmico aparecerá aqui...</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-value" id="cardsCount">4</div>
                <div class="stat-label">Cards</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="clicksCount">0</div>
                <div class="stat-label">Cliques</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="themeCount">1</div>
                <div class="stat-label">Temas</div>
            </div>
        </div>
    </div>
    
    <script>
        let counter = 0;
        let clickCount = 0;
        let themeCount = 1;
        let cardsCount = 4;
        let autoCounterInterval = null;
        const themes = ['default', 'dark', 'light', 'purple'];
        let currentTheme = 0;
        
        // Atualizar display
        function updateDisplay() {
            document.getElementById('contador').textContent = counter;
            document.getElementById('clicksCount').textContent = clickCount;
            document.getElementById('themeCount').textContent = themeCount;
            document.getElementById('cardsCount').textContent = cardsCount;
        }
        
        // Incrementar contador
        function incrementCounter() {
            counter++;
            clickCount++;
            updateDisplay();
            animateCounter();
        }
        
        // Animação do contador
        function animateCounter() {
            const counterEl = document.getElementById('contador');
            counterEl.style.transform = 'scale(1.2)';
            counterEl.style.color = getRandomColor();
            
            setTimeout(() => {
                counterEl.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Gerar cor aleatória
        function getRandomColor() {
            const colors = ['#00ff88', '#00dbde', '#fc00ff', '#ffcc00', '#ff0055', '#6a11cb'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Mostrar alerta
        function showAlert(title, message) {
            clickCount++;
            const alertEl = document.createElement('div');
            alertEl.className = 'alert-card';
            alertEl.innerHTML = \`
                <h4>\${title}</h4>
                <p>\${message}</p>
                <button onclick="this.parentElement.remove(); updateCardsCount(-1)">Fechar</button>
            \`;
            alertEl.style.cssText = \`
                background: rgba(106, 17, 203, 0.2);
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                border-left: 4px solid #6a11cb;
                animation: fadeIn 0.3s ease;
            \`;
            
            document.getElementById('dynamicContent').appendChild(alertEl);
            updateDisplay();
        }
        
        // Adicionar card dinâmico
        function addDynamicCard() {
            clickCount++;
            cardsCount++;
            
            const colors = ['#6a11cb', '#2575fc', '#00dbde', '#fc00ff', '#00ff88'];
            const color = colors[cardsCount % colors.length];
            
            const card = document.createElement('div');
            card.className = 'dynamic-card';
            card.innerHTML = \`
                <h4>Card #\${cardsCount}</h4>
                <p>Adicionado dinamicamente</p>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button onclick="likeCard(this)" style="background: \${color}">👍 Like</button>
                    <button onclick="this.parentElement.parentElement.remove(); updateCardsCount(-1)" 
                            style="background: rgba(255,0,85,0.2); color: #ff0055">
                        Remover
                    </button>
                </div>
            \`;
            
            card.style.cssText = \`
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                border: 1px solid \${color};
                animation: fadeIn 0.3s ease;
            \`;
            
            document.getElementById('dynamicContent').appendChild(card);
            updateDisplay();
        }
        
        // Atualizar contagem de cards
        function updateCardsCount(change) {
            cardsCount += change;
            updateDisplay();
        }
        
        // Like em card
        function likeCard(button) {
            button.textContent = '👍 Liked!';
            button.style.background = '#00ff88';
            button.style.color = '#1a1a2e';
            button.disabled = true;
        }
        
        // Alterar tema
        function changeTheme() {
            clickCount++;
            themeCount++;
            currentTheme = (currentTheme + 1) % themes.length;
            
            const theme = themes[currentTheme];
            const body = document.body;
            
            switch(theme) {
                case 'dark':
                    body.style.background = 'linear-gradient(135deg, #0a0a1a, #1a1a2e)';
                    break;
                case 'light':
                    body.style.background = 'linear-gradient(135deg, #f0f0f0, #ffffff)';
                    body.style.color = '#333';
                    break;
                case 'purple':
                    body.style.background = 'linear-gradient(135deg, #2d1b69, #6a11cb)';
                    break;
                default:
                    body.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
                    body.style.color = '#fff';
            }
            
            updateDisplay();
            showAlert('Tema Alterado', \`Tema mudado para: \${theme}\`);
        }
        
        // Buscar dados (simulado)
        function fetchData() {
            clickCount++;
            showAlert('Dados Buscados', 'Dados simulados carregados com sucesso!');
            
            // Simular delay de rede
            setTimeout(() => {
                const dataEl = document.createElement('div');
                dataEl.innerHTML = \`
                    <div style="margin-top: 10px; padding: 10px; background: rgba(0,255,136,0.1); border-radius: 6px;">
                        <strong>Dados Recebidos:</strong>
                        <p>Usuários: 42</p>
                        <p>Projetos: 15</p>
                        <p>Conquistas: 7</p>
                    </div>
                \`;
                document.getElementById('dynamicContent').appendChild(dataEl);
                updateDisplay();
            }, 500);
        }
        
        // Iniciar auto contador
        function startAutoCounter() {
            if (autoCounterInterval) {
                clearInterval(autoCounterInterval);
                autoCounterInterval = null;
                showAlert('Auto Contador', 'Auto contador parado.');
                return;
            }
            
            autoCounterInterval = setInterval(() => {
                counter++;
                updateDisplay();
                
                // Mudar cor a cada 5 incrementos
                if (counter % 5 === 0) {
                    animateCounter();
                }
                
                // Parar automaticamente em 50
                if (counter >= 50) {
                    clearInterval(autoCounterInterval);
                    autoCounterInterval = null;
                    showAlert('Auto Contador', 'Auto contador parado (atingiu 50).');
                }
            }, 500);
            
            showAlert('Auto Contador', 'Auto contador iniciado!');
        }
        
        // Resetar tudo
        function resetAll() {
            counter = 0;
            clickCount = 0;
            themeCount = 1;
            cardsCount = 4;
            currentTheme = 0;
            
            if (autoCounterInterval) {
                clearInterval(autoCounterInterval);
                autoCounterInterval = null;
            }
            
            document.body.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            document.body.style.color = '#fff';
            
            document.getElementById('dynamicContent').innerHTML = '<p>Conteúdo dinâmico aparecerá aqui...</p>';
            
            updateDisplay();
            showAlert('Reset Completo', 'Todos os dados foram resetados.');
        }
        
        // Inicializar
        updateDisplay();
        console.log('Solução avançada carregada!');
    </script>
</body>
</html>`,

      css: `/* Estilos adicionais para a solução */
.alert-card {
    animation: slideIn 0.3s ease;
}

.dynamic-card {
    transition: all 0.3s ease;
}

.dynamic-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

button {
    transition: all 0.2s ease;
}

button:active {
    transform: scale(0.95);
}

/* Responsividade */
@media (max-width: 768px) {
    .app-container {
        padding: 20px;
    }
    
    .title {
        font-size: 2rem;
    }
    
    .dashboard {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .controls {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
}

/* Animações de entrada */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.app-container > * {
    animation: fadeInUp 0.6s ease backwards;
}

.app-container > *:nth-child(1) { animation-delay: 0.1s; }
.app-container > *:nth-child(2) { animation-delay: 0.2s; }
.app-container > *:nth-child(3) { animation-delay: 0.3s; }
.app-container > *:nth-child(4) { animation-delay: 0.4s; }
.app-container > *:nth-child(5) { animation-delay: 0.5s; }`,

      js: `// Código JavaScript adicional para a solução
console.log('Solução avançada inicializada!');

// Adicionar efeito de digitação no título
function typeWriterEffect() {
    const title = document.querySelector('.title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    setTimeout(type, 1000);
}

// Adicionar efeito de partículas
function addParticles() {
    const container = document.querySelector('.app-container');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = \`
            position: absolute;
            width: \${Math.random() * 4 + 1}px;
            height: \${Math.random() * 4 + 1}px;
            background: \${getRandomColor()};
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: \${Math.random() * 0.5 + 0.2};
        \`;
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = \`\${x}%\`;
        particle.style.top = \`\${y}%\`;
        
        container.style.position = 'relative';
        container.appendChild(particle);
        
        // Animar partícula
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;
    
    function move() {
        x += dx;
        y += dy;
        
        // Rebater nas bordas
        if (x <= 0 || x >= 100) dx = -dx;
        if (y <= 0 || y >= 100) dy = -dy;
        
        particle.style.left = \`\${x}%\`;
        particle.style.top = \`\${y}%\`;
        
        requestAnimationFrame(move);
    }
    
    move();
}

// Adicionar data e hora
function addDateTime() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const dateTimeEl = document.createElement('div');
    dateTimeEl.id = 'dateTime';
    dateTimeEl.style.cssText = \`
        color: #8888aa;
        font-size: 0.9rem;
        margin-top: 5px;
    \`;
    
    function updateDateTime() {
        const now = new Date();
        dateTimeEl.textContent = now.toLocaleString('pt-BR');
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    header.appendChild(dateTimeEl);
}

// Efeito de confete
function createConfetti() {
    const colors = ['#00ff88', '#00dbde', '#fc00ff', '#ffcc00', '#ff0055', '#6a11cb'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = \`
            position: fixed;
            width: 10px;
            height: 10px;
            background: \${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            top: -20px;
            left: \${Math.random() * 100}vw;
            opacity: 0.8;
        \`;
        
        document.body.appendChild(confetti);
        
        // Animar
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
            { transform: \`translateY(\${window.innerHeight}px) rotate(\${Math.random() * 360}deg)\`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Inicializar efeitos especiais
setTimeout(() => {
    typeWriterEffect();
    addParticles();
    addDateTime();
    
    // Adicionar confete após 3 segundos
    setTimeout(createConfetti, 3000);
}, 500);

// Adicionar atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        incrementCounter();
    } else if (e.key === 'r' && e.ctrlKey) {
        resetAll();
    } else if (e.key === 't' && e.ctrlKey) {
        changeTheme();
    }
});

// Log de interações
console.log('🔧 Recursos disponíveis:');
console.log('- incrementCounter()');
console.log('- changeTheme()');
console.log('- fetchData()');
console.log('- resetAll()');
console.log('- startAutoCounter()');
console.log('- addDynamicCard()');
console.log('- showAlert(título, mensagem)');`,
    };

    // Aplicar solução
    elementos.htmlCode.value = solucao.html;
    if (elementos.cssCode) elementos.cssCode.value = solucao.css;
    if (elementos.jsCode) elementos.jsCode.value = solucao.js;

    // Executar
    executarCodigo();

    // Feedback
    mostrarNotificacao(
      "Solução Carregada",
      "Solução avançada carregada com sucesso!",
      "success"
    );
    verificarConquista("solucionador");
  }

  function salvarCodigo() {
    if (!elementos.htmlCode) return;

    const codigo = {
      html: elementos.htmlCode.value,
      css: elementos.cssCode ? elementos.cssCode.value : "",
      js: elementos.jsCode ? elementos.jsCode.value : "",
      data: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Salvar no localStorage
    localStorage.setItem(
      CONFIG.localStorageKeys.codigoSalvo,
      JSON.stringify(codigo)
    );
    AppState.codigoSalvo = codigo;

    // Feedback visual
    if (elementos.btnSave) {
      const originalHTML = elementos.btnSave.innerHTML;
      elementos.btnSave.innerHTML = '<i class="fas fa-check"></i> Salvo!';
      elementos.btnSave.style.background = "var(--accent-success)";

      setTimeout(() => {
        elementos.btnSave.innerHTML = originalHTML;
        elementos.btnSave.style.background = "";
      }, 2000);
    }

    // Notificação
    mostrarNotificacao(
      "Código Salvo",
      "Seu código foi salvo localmente.",
      "success"
    );
    verificarConquista("organizado");
  }

  function aplicarDesafio(index) {
    if (!elementos.htmlCode) return;

    const desafios = [
      {
        nome: "Botão Verde",
        css: "\nbutton { background: linear-gradient(90deg, #00b09b, #96c93d) !important; }",
        mensagem: "Botão alterado para verde!",
      },
      {
        nome: "Contador de Cliques",
        js: `\n\n// Contador de cliques
let contadorCliques = 0;
function contarCliques() {
    contadorCliques++;
    const mensagem = document.getElementById("mensagem");
    if (mensagem) {
        mensagem.textContent = \`Cliques: \${contadorCliques}\`;
        mensagem.style.color = contadorCliques % 2 === 0 ? '#00ff88' : '#fc00ff';
    }
}

// Atualizar botão existente
const botao = document.querySelector("button");
if (botao) {
    const onclickOriginal = botao.getAttribute("onclick") || "";
    botao.setAttribute("onclick", onclickOriginal + "; contarCliques();");
}

// Adicionar display do contador
const container = document.querySelector(".container");
if (container && !document.getElementById("contadorDisplay")) {
    const contadorDisplay = document.createElement("div");
    contadorDisplay.id = "contadorDisplay";
    contadorDisplay.style.cssText = \`
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        font-size: 0.9rem;
        color: #b0b0d0;
    \`;
    contadorDisplay.innerHTML = '<strong>Contador de Cliques:</strong> <span id="contadorValor">0</span>';
    container.appendChild(contadorDisplay);
    
    // Atualizar função para mostrar no display
    const contarCliquesOriginal = contarCliques;
    contarCliques = function() {
        contarCliquesOriginal();
        const valor = document.getElementById("contadorValor");
        if (valor) {
            valor.textContent = contadorCliques;
            valor.style.fontWeight = "bold";
            valor.style.color = "#00ff88";
        }
    };
}`,
        mensagem: "Contador de cliques adicionado!",
      },
      {
        nome: "Lista Dinâmica",
        html: `\n\n<div class="lista-container" style="margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
    <h3 style="margin-top: 0; color: #00dbde;">Lista Dinâmica</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <input type="text" id="itemInput" placeholder="Digite um item" 
               style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid rgba(106, 17, 203, 0.3); background: rgba(255, 255, 255, 0.1); color: white;">
        <button onclick="adicionarItem()" style="padding: 10px 20px; background: #6a11cb; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Adicionar
        </button>
    </div>
    <ul id="listaItens" style="list-style: none; padding: 0; max-height: 200px; overflow-y: auto;"></ul>
</div>`,
        js: `\n\n// Lista dinâmica
function adicionarItem() {
    const input = document.getElementById("itemInput");
    const valor = input.value.trim();
    
    if (valor) {
        const lista = document.getElementById("listaItens");
        const item = document.createElement("li");
        item.style.cssText = \`
            padding: 10px;
            margin: 5px 0;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            border-left: 4px solid #00ff88;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeIn 0.3s ease;
        \`;
        
        item.innerHTML = \`
            <span>\${valor}</span>
            <button onclick="this.parentElement.remove(); atualizarContadorLista();" 
                    style="padding: 5px 10px; background: rgba(255,0,85,0.2); color: #ff0055; border: none; border-radius: 4px; cursor: pointer;">
                Remover
            </button>
        \`;
        
        lista.appendChild(item);
        input.value = "";
        input.focus();
        atualizarContadorLista();
    }
}

function atualizarContadorLista() {
    const lista = document.getElementById("listaItens");
    const titulo = document.querySelector(".lista-container h3");
    if (lista && titulo) {
        const count = lista.children.length;
        titulo.textContent = \`Lista Dinâmica (\${count} itens)\`;
    }
}

// Permitir adicionar com Enter
const itemInput = document.getElementById("itemInput");
if (itemInput) {
    itemInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            adicionarItem();
        }
    });
}

// Estilos para animação
if (!document.querySelector("#listaEstilos")) {
    const style = document.createElement("style");
    style.id = "listaEstilos";
    style.textContent = \`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #listaItens {
            scrollbar-width: thin;
            scrollbar-color: #6a11cb transparent;
        }
        
        #listaItens::-webkit-scrollbar {
            width: 6px;
        }
        
        #listaItens::-webkit-scrollbar-track {
            background: transparent;
        }
        
        #listaItens::-webkit-scrollbar-thumb {
            background: #6a11cb;
            border-radius: 3px;
        }
    \`;
    document.head.appendChild(style);
}`,
        mensagem: "Lista dinâmica adicionada!",
      },
    ];

    if (index >= desafios.length) return;

    const desafio = desafios[index];

    // Aplicar CSS
    if (desafio.css && elementos.cssCode) {
      elementos.cssCode.value += desafio.css;
    }

    // Aplicar HTML
    if (desafio.html && elementos.htmlCode) {
      elementos.htmlCode.value += desafio.html;
    }

    // Aplicar JS
    if (desafio.js && elementos.jsCode) {
      elementos.jsCode.value += desafio.js;
    }

    // Executar
    executarCodigo();

    // Feedback
    if (elementos.desafioBotoes && elementos.desafioBotoes[index]) {
      const botao = elementos.desafioBotoes[index];
      const originalText = botao.textContent;
      botao.textContent = "✓ Aplicado!";
      botao.style.background = "var(--accent-success)";

      setTimeout(() => {
        botao.textContent = originalText;
        botao.style.background = "";
      }, 2000);
    }

    mostrarNotificacao("Desafio Aplicado", desafio.mensagem, "info");
    verificarConquista("explorador");
  }

  // ============================================
  // SISTEMA DE MISSÕES
  // ============================================

  function initSistemaMissoes() {
    if (!elementos.btnMissoes || elementos.btnMissoes.length === 0) return;

    elementos.btnMissoes.forEach((btn, index) => {
      btn.addEventListener("click", () => iniciarMissao(index));
    });

    // Atualizar UI inicial
    atualizarProgressoUI();
  }

  function iniciarMissao(index) {
    const missoes = [
      { nome: "Página HTML Completa", pontos: 50, badge: "HTML Básico" },
      { nome: "Estilizar com Flexbox", pontos: 75, badge: "CSS Intermediário" },
      { nome: "To-Do List em JavaScript", pontos: 100, badge: "JavaScript" },
    ];

    if (index >= missoes.length) return;

    const missao = missoes[index];
    const btn = elementos.btnMissoes[index];

    // Atualizar progresso
    AppState.progresso.pontos += missao.pontos;

    // Atualizar barra de progresso
    if (elementos.progressoFill) {
      const novaConclusao = Math.min(AppState.progresso.conclusao + 5, 100);
      AppState.progresso.conclusao = novaConclusao;
      elementos.progressoFill.style.width = `${novaConclusao}%`;
    }

    // Atualizar pontos na UI
    atualizarProgressoUI();

    // Verificar promoção de nível
    verificarPromocaoNivel();

    // Feedback
    const originalText = btn.textContent;
    btn.textContent = "Missão Iniciada!";
    btn.style.background = "var(--accent-success)";

    // Notificação
    mostrarNotificacao(
      "Missão Iniciada!",
      `"${missao.nome}" iniciada com sucesso! +${missao.pontos} pontos.`,
      "success"
    );

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
    }, 2000);

    // Registrar conquista
    verificarConquista("missao");
  }

  function atualizarProgressoUI() {
    if (elementos.pontosElement) {
      elementos.pontosElement.textContent = `${AppState.progresso.pontos}/1000 pontos`;
    }

    if (elementos.progressoFill) {
      elementos.progressoFill.style.width = `${AppState.progresso.conclusao}%`;
    }
  }

  function verificarPromocaoNivel() {
    if (!elementos.nivelTag) return;

    const niveis = [
      {
        pontos: 0,
        nome: "Iniciante",
        cor: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
      },
      {
        pontos: 300,
        nome: "Dev Júnior",
        cor: "linear-gradient(90deg, #2575fc, #00dbde)",
      },
      {
        pontos: 600,
        nome: "Dev Pleno",
        cor: "linear-gradient(90deg, #00dbde, #fc00ff)",
      },
      {
        pontos: 900,
        nome: "Dev Avançado",
        cor: "linear-gradient(90deg, #fc00ff, #00ff88)",
      },
    ];

    // Encontrar nível atual baseado nos pontos
    let nivelAtual = niveis[0];
    for (let i = niveis.length - 1; i >= 0; i--) {
      if (AppState.progresso.pontos >= niveis[i].pontos) {
        nivelAtual = niveis[i];
        break;
      }
    }

    // Atualizar se mudou
    if (AppState.progresso.nivel !== nivelAtual.nome) {
      AppState.progresso.nivel = nivelAtual.nome;
      elementos.nivelTag.textContent = nivelAtual.nome;
      elementos.nivelTag.style.background = nivelAtual.cor;

      // Notificação
      mostrarNotificacao(
        "Parabéns! 🎉",
        `Você avançou para o nível: ${nivelAtual.nome}`,
        "success"
      );

      // Registrar conquista
      verificarConquista(
        `nivel_${nivelAtual.nome.toLowerCase().replace(" ", "_")}`
      );
    }
  }

  // ============================================
  // SISTEMA DE CONQUISTAS
  // ============================================

  function initSistemaConquistas() {
    // Carregar conquistas desbloqueadas
    atualizarConquistasUI();

    // Desbloquear conquista inicial após delay
    setTimeout(() => {
      verificarConquista("iniciante");
    }, 1000);

    // Verificar conquistas baseadas em interações
    setInterval(verificarConquistasInteracao, 10000);
  }

  function verificarConquista(codigo) {
    if (AppState.conquistas.has(codigo)) return;

    const conquistas = {
      iniciante: {
        nome: "Primeiro Código",
        desc: "Executou seu primeiro código",
      },
      explorador: { nome: "Explorador", desc: "Experimentou um desafio" },
      executor: { nome: "Executor", desc: "Executou código 10 vezes" },
      organizado: {
        nome: "Organizado",
        desc: "Salvou código pela primeira vez",
      },
      solucionador: {
        nome: "Solucionador",
        desc: "Visualizou uma solução completa",
      },
      missao: { nome: "Missonário", desc: "Iniciou uma missão" },
      nivel_dev_júnior: { nome: "Júnior", desc: "Alcançou nível Dev Júnior" },
      nivel_dev_pleno: { nome: "Pleno", desc: "Alcançou nível Dev Pleno" },
      nivel_dev_avançado: {
        nome: "Avançado",
        desc: "Alcançou nível Dev Avançado",
      },
      interacoes_50: { nome: "Dedicado", desc: "50 interações no site" },
      interacoes_100: { nome: "Veterano", desc: "100 interações no site" },
    };

    if (conquistas[codigo]) {
      AppState.conquistas.add(codigo);
      desbloquearConquistaUI(codigo, conquistas[codigo]);
      salvarEstado();
    }
  }

  function verificarConquistasInteracao() {
    const interacoes = AppState.interacoes || 0;

    if (interacoes >= 50 && interacoes < 100) {
      verificarConquista("interacoes_50");
    } else if (interacoes >= 100) {
      verificarConquista("interacoes_100");
    }
  }

  function desbloquearConquistaUI(codigo, conquista) {
    // Encontrar elemento da conquista
    if (elementos.conquistas) {
      elementos.conquistas.forEach((el, index) => {
        const span = el.querySelector("span");
        if (span && span.textContent === conquista.nome) {
          el.classList.add("conquista-desbloqueada");
          el.style.opacity = "1";
          el.style.borderColor = "var(--accent-primary)";

          // Animar
          el.style.transform = "scale(1.1)";
          setTimeout(() => {
            el.style.transform = "scale(1)";
          }, 300);
        }
      });
    }

    // Notificação
    mostrarNotificacao(
      "Conquista Desbloqueada! 🏆",
      `${conquista.nome}: ${conquista.desc}`,
      "success"
    );
  }

  function atualizarConquistasUI() {
    if (!elementos.conquistas) return;

    elementos.conquistas.forEach((el) => {
      const span = el.querySelector("span");
      if (span) {
        const nomeConquista = span.textContent;
        // Marcar como desbloqueada se estiver no estado
        const codigo = Object.keys(conquistasMap).find(
          (key) => conquistasMap[key].nome === nomeConquista
        );
        if (codigo && AppState.conquistas.has(codigo)) {
          el.classList.add("conquista-desbloqueada");
          el.style.opacity = "1";
        }
      }
    });
  }

  const conquistasMap = {
    iniciante: {
      nome: "Primeiro Código",
      desc: "Executou seu primeiro código",
    },
    explorador: { nome: "Explorador", desc: "Experimentou um desafio" },
    executor: { nome: "Executor", desc: "Executou código 10 vezes" },
    organizado: { nome: "Organizado", desc: "Salvou código pela primeira vez" },
    solucionador: {
      nome: "Solucionador",
      desc: "Visualizou uma solução completa",
    },
    missao: { nome: "Missonário", desc: "Iniciou uma missão" },
    nivel_dev_júnior: { nome: "Dev Júnior", desc: "Alcançou nível Dev Júnior" },
    nivel_dev_pleno: { nome: "Dev Pleno", desc: "Alcançou nível Dev Pleno" },
    nivel_dev_avançado: {
      nome: "Dev Avançado",
      desc: "Alcançou nível Dev Avançado",
    },
    interacoes_50: { nome: "Dedicado", desc: "50 interações no site" },
    interacoes_100: { nome: "Veterano", desc: "100 interações no site" },
  };

  // ============================================
  // EFEITOS VISUAIS
  // ============================================

  function initEfeitosVisuais() {
    // Efeito de digitação no hero
    if (elementos.heroTitle) {
      iniciarEfeitoDigitacao();
    }

    // Observador de interseção para animações
    iniciarObserverAnimacoes();

    // Efeitos de hover nos cards
    iniciarEfeitosHover();

    // Sistema de notificações
    criarEstiloNotificacoes();
  }

  function iniciarEfeitoDigitacao() {
    const textoOriginal = elementos.heroTitle.innerHTML;
    elementos.heroTitle.innerHTML = "";

    let i = 0;
    const velocidade = 50;

    function digitar() {
      if (i < textoOriginal.length) {
        // Verificar se é um span com gradient
        if (textoOriginal.substring(i, i + 6) === "<span ") {
          const fimSpan = textoOriginal.indexOf("</span>", i) + 7;
          elementos.heroTitle.innerHTML = textoOriginal.substring(0, fimSpan);
          i = fimSpan;
        } else {
          elementos.heroTitle.innerHTML += textoOriginal.charAt(i);
          i++;
        }
        setTimeout(digitar, velocidade);
      }
    }

    // Delay inicial
    setTimeout(digitar, 1000);
  }

  function iniciarObserverAnimacoes() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observar elementos para animação
    document
      .querySelectorAll(".curso-card, .metodo-card, .projeto-card, .missao")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  function iniciarEfeitosHover() {
    // Efeito de brilho nos botões
    document
      .querySelectorAll(".btn-primary, .btn-curso, .btn-missao")
      .forEach((btn) => {
        btn.addEventListener("mouseenter", function () {
          this.style.filter = "brightness(1.2)";
        });

        btn.addEventListener("mouseleave", function () {
          this.style.filter = "brightness(1)";
        });
      });
  }

  // ============================================
  // SISTEMA DE NOTIFICAÇÕES
  // ============================================

  function criarEstiloNotificacoes() {
    if (document.getElementById("notificacoes-estilo")) return;

    const estilo = document.createElement("style");
    estilo.id = "notificacoes-estilo";
    estilo.textContent = `
            .notificacao-frontend {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-card);
                border-left: 4px solid;
                border-radius: 8px;
                padding: 15px 20px;
                margin-bottom: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                max-width: 350px;
                animation: slideInRight 0.3s ease;
                display: flex;
                flex-direction: column;
                gap: 5px;
                border-color: var(--accent-primary);
            }
            
            .notificacao-frontend.success {
                border-color: var(--accent-success);
            }
            
            .notificacao-frontend.error {
                border-color: var(--accent-danger);
            }
            
            .notificacao-frontend.warning {
                border-color: var(--accent-warning);
            }
            
            .notificacao-frontend.info {
                border-color: var(--accent-primary);
            }
            
            .notificacao-titulo {
                font-weight: 600;
                color: var(--text-primary);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notificacao-mensagem {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .notificacao-fechar {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1.2rem;
                line-height: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notificacao-saindo {
                animation: slideOutRight 0.3s ease forwards;
            }
        `;

    document.head.appendChild(estilo);
  }

  function mostrarNotificacao(titulo, mensagem, tipo = "info") {
    // Criar elemento
    const notificacao = document.createElement("div");
    notificacao.className = `notificacao-frontend ${tipo}`;
    notificacao.innerHTML = `
            <button class="notificacao-fechar">&times;</button>
            <div class="notificacao-titulo">
                ${
                  tipo === "success"
                    ? "🎉"
                    : tipo === "error"
                    ? "❌"
                    : tipo === "warning"
                    ? "⚠️"
                    : "ℹ️"
                }
                ${titulo}
            </div>
            <div class="notificacao-mensagem">${mensagem}</div>
        `;

    // Adicionar ao body
    document.body.appendChild(notificacao);

    // Botão fechar
    const btnFechar = notificacao.querySelector(".notificacao-fechar");
    btnFechar.addEventListener("click", () => removerNotificacao(notificacao));

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (document.body.contains(notificacao)) {
        removerNotificacao(notificacao);
      }
    }, 5000);

    return notificacao;
  }

  function removerNotificacao(notificacao) {
    notificacao.classList.add("notificacao-saindo");
    setTimeout(() => {
      if (document.body.contains(notificacao)) {
        notificacao.remove();
      }
    }, 300);
  }

  // ============================================
  // FUNÇÕES UTILITÁRIAS
  // ============================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function atualizarUI() {
    // Aplicar tema
    document.body.setAttribute("data-tema", AppState.temaAtivo);

    // Atualizar progresso
    atualizarProgressoUI();

    // Atualizar conquistas
    atualizarConquistasUI();
  }

  // ============================================
  // API PÚBLICA
  // ============================================

  return {
    // Inicialização
    init,

    // Progresso
    getProgresso: () => ({ ...AppState.progresso }),
    adicionarPontos: (pontos) => {
      AppState.progresso.pontos += pontos;
      atualizarProgressoUI();
      verificarPromocaoNivel();
      salvarEstado();
    },

    // Laboratório
    executarCodigo,
    resetarCodigo,
    salvarCodigo,

    // Missões
    iniciarMissao,

    // Conquistas
    verificarConquista,

    // Notificações
    mostrarNotificacao,

    // Utilitários
    debounce,
  };
})();

// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

// Aguardar DOM carregado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", FrontEndMaster.init);
} else {
  FrontEndMaster.init();
}

// Exportar para uso global
window.FrontEndMaster = FrontEndMaster;

// Adicionar estilos para animações
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: fadeIn 0.6s ease forwards;
        }
        
        /* Melhorias de usabilidade */
        .code-input:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: -2px;
        }
        
        /* Scrollbar personalizada */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-secondary);
        }
        
        /* Seleção de texto */
        ::selection {
            background: rgba(106, 17, 203, 0.5);
            color: white;
        }
    </style>
`
);

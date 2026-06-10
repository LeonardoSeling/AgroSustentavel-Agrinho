/**
 * ================================================
 * SCRIPT PRINCIPAL - FUNCIONALIDADES GLOBAIS
 * ================================================
 * 
 * Este script gerencia funcionalidades que são compartilhadas entre
 * todas as páginas do site (index.html, mapa.html, calculadora.html)
 * 
 * Funcionalidades incluídas:
 * - Efeito visual de brilho no cursor (cursor glow)
 * - Modo escuro (dark mode) com persistência via localStorage
 * - Animação dos números das estatísticas na página inicial
 * - Controle de tamanho de fonte (acessibilidade)
 */

// ================================================
// INICIALIZAÇÃO PRINCIPAL
// ================================================
// Aguarda o carregamento completo do DOM antes de executar qualquer manipulação
document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // 1. EFEITO DE BRILHO DO CURSOR (CURSOR GLOW)
    // ================================================
    // Cria um efeito visual de "brilho" que acompanha o movimento do mouse
    // Melhora a experiência estética do site
    
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        // Adiciona evento de movimento do mouse
        document.addEventListener('mousemove', (e) => {
            // Move o elemento glow para a posição atual do cursor
            // O CSS já possui transform: translate(-50%, -50%) para centralizar
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }

    // ================================================
    // 2. MODO ESCURO (DARK MODE)
    // ================================================
    // Gerencia a alternância entre tema claro e escuro
    // Persiste a preferência do usuário no localStorage
    // Também respeita a preferência do sistema operacional
    
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    /**
     * Função para ativar/desativar o modo escuro
     * @param {boolean} isDark - true para modo escuro, false para modo claro
     */
    function setDarkMode(isDark) {
        if (isDark) {
            // Ativa modo escuro: adiciona classe CSS e altera ícone para sol
            document.body.classList.add('dark-mode');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                toggleBtn.setAttribute('aria-label', 'Modo claro');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            // Desativa modo escuro: remove classe e altera ícone para lua
            document.body.classList.remove('dark-mode');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                toggleBtn.setAttribute('aria-label', 'Modo escuro');
            }
            localStorage.setItem('theme', 'light');
        }
    }

    /**
     * Lógica de prioridade para o tema inicial:
     * 1º - Tema salvo no localStorage (preferência do usuário)
     * 2º - Preferência do sistema operacional (dark/light)
     * 3º - Padrão: modo claro
     */
    if (storedTheme === 'dark') {
        setDarkMode(true);
    } else if (storedTheme === 'light') {
        setDarkMode(false);
    } else if (prefersDark) {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }

    // Evento de clique no botão de alternância
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            setDarkMode(!isDark);
        });
    }
});

// ================================================
// 3. ANIMAÇÃO DOS NÚMEROS DAS ESTATÍSTICAS
// ================================================
// Cria um efeito de contagem progressiva quando os números
// da seção hero entram na área visível da tela

/**
 * Função que anima os números das estatísticas
 * Utiliza Intersection Observer para detectar quando os elementos
 * são visualizados pelo usuário
 */
function animateStats() {
    const stats = document.querySelectorAll('.hero-stats div span');
    if (!stats.length) return;

    // Cria um observer que monitora quando os elementos entram na tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetText = el.innerText;
                const targetNumber = parseInt(targetText);
                
                // Se não for um número válido, não anima
                if (isNaN(targetNumber)) return;

                // Animação de contagem progressiva
                let current = 0;
                const step = Math.ceil(targetNumber / 70); // Divide em ~70 passos
                const timer = setInterval(() => {
                    current += step;
                    if (current >= targetNumber) {
                        // Quando atinge o alvo, restaura o texto original (mantém "+" se houver)
                        el.innerText = targetText;
                        clearInterval(timer);
                    } else {
                        // Atualiza o número atual, preservando o símbolo "+" se existir
                        el.innerText = current + (targetText.includes('+') ? '+' : '');
                    }
                }, 30); // Atualiza a cada 30ms (~33 atualizações por segundo)
                
                // Para de observar este elemento após animar
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 }); // Dispara quando 50% do elemento está visível

    // Inicia a observação de cada estatística
    stats.forEach(stat => observer.observe(stat));
}

// Inicia a animação das estatísticas
animateStats();

// ================================================
// 4. CONTROLE DE TAMANHO DA FONTE (ACESSIBILIDADE)
// ================================================
// Permite que o usuário aumente ou diminua o tamanho da fonte
// Atende às diretrizes de acessibilidade (WCAG)
// A preferência é salva no localStorage

/**
 * Inicializa os controles de tamanho de fonte
 * Botões de aumentar (+) e diminuir (-) com limites de 80% a 130%
 * O tamanho base é aplicado ao elemento <html> via font-size em %
 */
function initFontControl() {
    const fontMinus = document.getElementById('font-minus');
    const fontPlus = document.getElementById('font-plus');
    
    // Se os botões não existirem na página, sai da função
    if (!fontMinus || !fontPlus) return;
    
    // Carrega o tamanho de fonte salvo anteriormente no localStorage
    let currentFontSize = localStorage.getItem('fontSize');
    if (currentFontSize) {
        document.documentElement.style.fontSize = currentFontSize + '%';
    } else {
        // Valor padrão: 100%
        document.documentElement.style.fontSize = '100%';
    }
    
    /**
     * Botão A+ (Aumentar fonte)
     * Aumenta em 10% a cada clique, até o limite máximo de 130%
     */
    fontPlus.addEventListener('click', () => {
        let current = parseInt(document.documentElement.style.fontSize) || 100;
        if (current < 130) {
            let novo = current + 10;
            document.documentElement.style.fontSize = novo + '%';
            localStorage.setItem('fontSize', novo);
        }
    });
    
    /**
     * Botão A- (Diminuir fonte)
     * Diminui em 10% a cada clique, até o limite mínimo de 80%
     */
    fontMinus.addEventListener('click', () => {
        let current = parseInt(document.documentElement.style.fontSize) || 100;
        if (current > 80) {
            let novo = current - 10;
            document.documentElement.style.fontSize = novo + '%';
            localStorage.setItem('fontSize', novo);
        }
    });
}

/**
 * Garante que o controle de fonte seja inicializado
 * Verifica se o DOM já está carregado ou se ainda está em loading
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontControl);
} else {
    initFontControl();
}
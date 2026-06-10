/**
 * ================================================
 * SCRIPT DA CALCULADORA DE SUSTENTABILIDADE RURAL
 * ================================================
 * 
 * Este script gerencia um quiz interativo de 5 etapas que avalia
 * a sustentabilidade de uma propriedade rural em 5 categorias:
 * - Agrotóxicos
 * - Matriz Energética
 * - Conservação do Solo
 * - Uso da Água
 * - Biodiversidade
 * 
 * Ao final, gera um relatório detalhado com pontuação, pontos fortes,
 * pontos fracos e recomendações personalizadas.
 */

/**
 * ================================================
 * INICIALIZAÇÃO E VARIÁVEIS GLOBAIS
 * ================================================
 */

// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', function() {
    
    // ---------- CONTROLE DE NAVEGAÇÃO DO QUIZ ----------
    let currentStep = 1;           // Etapa atual do quiz (1 a 5)
    const totalSteps = 5;          // Número total de perguntas
    
    // Elementos do DOM para navegação
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('progress-fill');
    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');
    const quizCard = document.getElementById('quiz-card');

    /**
     * Estrutura de dados que armazena as respostas detalhadas do usuário
     * Cada categoria contém:
     * - valor: pontuação (0-10)
     * - texto: descrição da prática adotada
     * - nivel: classificação (Excelente, Bom, Regular, Crítico)
     */
    let respostasDetalhadas = {
        agrotoxicos: { valor: 0, texto: '', nivel: '' },
        energia: { valor: 0, texto: '', nivel: '' },
        solo: { valor: 0, texto: '', nivel: '' },
        agua: { valor: 0, texto: '', nivel: '' },
        biodiversidade: { valor: 0, texto: '', nivel: '' }
    };

    /**
     * ================================================
     * FUNÇÕES DE NAVEGAÇÃO E PROGRESSO
     * ================================================
     */

    /**
     * Atualiza a barra de progresso visual do quiz
     * Calcula a porcentagem com base na etapa atual
     */
    function updateProgress() {
        const percent = (currentStep / totalSteps) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
    }

    /**
     * Exibe a etapa atual do quiz e controla a visibilidade dos botões
     * @param {number} step - Número da etapa a ser exibida (1-5)
     */
    function showStep(step) {
        // Esconde todas as etapas e mostra apenas a atual
        for (let i = 1; i <= totalSteps; i++) {
            const stepDiv = document.getElementById(`step-${i}`);
            if (stepDiv) stepDiv.classList.toggle('active', i === step);
        }
        
        // Controle dos botões de navegação
        if (prevBtn) prevBtn.disabled = (step === 1);
        if (nextBtn) nextBtn.style.display = (step === totalSteps) ? 'none' : 'inline-flex';
        if (submitBtn) submitBtn.style.display = (step === totalSteps) ? 'inline-flex' : 'none';
        
        // Atualiza a barra de progresso
        updateProgress();
    }

    /**
     * Verifica se o usuário selecionou alguma opção na etapa atual
     * @returns {boolean} - true se alguma opção estiver selecionada
     */
    function checkStepValid() {
        const stepDiv = document.getElementById(`step-${currentStep}`);
        if (!stepDiv) return false;
        const radios = stepDiv.querySelectorAll('input[type="radio"]');
        return Array.from(radios).some(r => r.checked);
    }

    /**
     * ================================================
     * FUNÇÕES DE PROCESSAMENTO DE RESPOSTAS
     * ================================================
     */

    /**
     * Salva a resposta do usuário na estrutura de dados
     * @param {string} pergunta - Identificador da pergunta (q1, q2, q3, q4, q5)
     * @param {number} valor - Pontuação associada à resposta (0-10)
     * @param {string} texto - Descrição textual da prática
     */
    function salvarResposta(pergunta, valor, texto) {
        // Mapeia o ID da pergunta para a categoria correspondente
        const mapaCategoria = {
            q1: 'agrotoxicos', 
            q2: 'energia', 
            q3: 'solo',
            q4: 'agua', 
            q5: 'biodiversidade'
        };
        const categoria = mapaCategoria[pergunta];
        if (!categoria) return;

        // Determina o nível com base na pontuação
        let nivel = '';
        if (valor >= 8) nivel = 'Excelente';
        else if (valor >= 6) nivel = 'Bom';
        else if (valor >= 4) nivel = 'Regular';
        else nivel = 'Crítico';

        // Armazena os dados
        respostasDetalhadas[categoria] = { valor, texto, nivel };
    }

    /**
     * Configura os listeners para os botões de rádio
     * Quando selecionados, salva a resposta e aplica destaque visual
     */
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const name = this.name;           // Ex: 'q1', 'q2'...
            const valor = parseInt(this.value);
            const parent = this.closest('.option-card');
            const titulo = parent?.querySelector('.option-title')?.innerText || '';
            const desc = parent?.querySelector('.option-desc')?.innerText || '';
            
            // Salva a resposta no objeto
            salvarResposta(name, valor, `${titulo}: ${desc}`);
            
            // Remove seleção anterior e marca o card atual
            const grid = this.closest('.options-grid');
            if (grid) {
                grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                parent?.classList.add('selected');
            }
        });
    });

    /**
     * ================================================
     * EVENTOS DE NAVEGAÇÃO
     * ================================================
     */

    // Botão "Próximo" - avança para a próxima etapa se válido
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!checkStepValid()) {
                alert('Por favor, selecione uma opção antes de continuar.');
                return;
            }
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
    }

    // Botão "Anterior" - volta para a etapa anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    /**
     * ================================================
     * GERAÇÃO DO RELATÓRIO DETALHADO
     * ================================================
     */

    /**
     * Analisa as respostas e gera recomendações personalizadas
     * @param {number} total - Pontuação total obtida
     * @param {number} maxScore - Pontuação máxima possível (50)
     * @param {number} percent - Percentual de acerto
     * @returns {object} Objeto contendo análise, mensagem geral e classe CSS
     */
    function gerarAnaliseDetalhada(total, maxScore, percent) {
        const analise = { 
            pontosFortes: [],   // Práticas que o produtor já acerta
            pontosFracos: [],   // Práticas que precisam de atenção
            observacoes: []     // Recomendações específicas
        };
        const cats = respostasDetalhadas;

        // ---------- ANÁLISE POR CATEGORIA ----------
        
        // 1. Agrotóxicos
        if (cats.agrotoxicos.valor >= 8) {
            analise.pontosFortes.push('Uso reduzido ou nulo de agrotóxicos sintéticos – excelente para solo e consumidor.');
        } else if (cats.agrotoxicos.valor <= 3) {
            analise.pontosFracos.push('Alto uso de agrotóxicos – prejudica a biodiversidade e pode contaminar a água.');
            analise.observacoes.push('Migre para manejo integrado de pragas (MIP) e produtos biológicos.');
        } else {
            analise.observacoes.push('Uso moderado de defensivos – reduza ainda mais com práticas preventivas.');
        }

        // 2. Matriz Energética
        if (cats.energia.valor >= 8) {
            analise.pontosFortes.push('Matriz energética renovável – reduz custos e emissões.');
        } else if (cats.energia.valor <= 3) {
            analise.pontosFracos.push('Dependência de fontes fósseis – alto custo e impacto ambiental.');
            analise.observacoes.push('Invista em energia solar ou biogás (há linhas de crédito rural).');
        } else {
            analise.observacoes.push('Você usa energia da rede – considere fontes renováveis para economia a longo prazo.');
        }

        // 3. Conservação do Solo
        if (cats.solo.valor >= 8) {
            analise.pontosFortes.push('Sistema de conservação do solo exemplar (plantio direto, rotação, cobertura).');
        } else if (cats.solo.valor <= 3) {
            analise.pontosFracos.push('Manejo do solo inadequado – risco de erosão e perda de fertilidade.');
            analise.observacoes.push('Adote plantio direto e rotação de culturas urgentemente.');
        } else {
            analise.observacoes.push('Suas práticas de solo são parciais – avance para sistema completo de conservação.');
        }

        // 4. Uso da Água
        if (cats.agua.valor >= 8) {
            analise.pontosFortes.push('Eficiência hídrica total – gotejamento e captação de chuva é referência.');
        } else if (cats.agua.valor <= 3) {
            analise.pontosFracos.push('Desperdício de água – risco de escassez e multas.');
            analise.observacoes.push('Instale sistemas de irrigação eficiente e capte água da chuva.');
        } else {
            analise.observacoes.push('Você controla a irrigação, mas ainda há perdas – otimize o sistema.');
        }

        // 5. Biodiversidade
        if (cats.biodiversidade.valor >= 8) {
            analise.pontosFortes.push('Excelente preservação ambiental – APPs, reserva legal e corredores ecológicos.');
        } else if (cats.biodiversidade.valor <= 3) {
            analise.pontosFracos.push('Baixa diversidade – monocultura extensiva sem áreas preservadas.');
            analise.observacoes.push('Recupere matas ciliares e crie corredores ecológicos para atrair polinizadores.');
        } else {
            analise.observacoes.push('Você preserva parte da área – amplie as zonas de vegetação nativa.');
        }

        // ---------- CLASSIFICAÇÃO GERAL ----------
        let mensagemGeral = '', classeNota = '';
        if (percent >= 80) { 
            mensagemGeral = 'PROPRIEDADE EXEMPLAR! Você é referência em sustentabilidade.'; 
            classeNota = 'nota-excelente'; 
        } else if (percent >= 60) { 
            mensagemGeral = 'BOM DESEMPENHO! Você está no caminho certo, mas pode melhorar.'; 
            classeNota = 'nota-bom'; 
        } else if (percent >= 40) { 
            mensagemGeral = 'ATENÇÃO! Sua propriedade tem impacto ambiental médio-alto.'; 
            classeNota = 'nota-atencao'; 
        } else { 
            mensagemGeral = 'URGENTE! Sua propriedade precisa de melhorias significativas.'; 
            classeNota = 'nota-urgente'; 
        }

        return { analise, mensagemGeral, classeNota };
    }

    /**
     * ================================================
     * SUBMISSÃO DO QUIZ E EXIBIÇÃO DO RESULTADO
     * ================================================
     */

    // Botão de "Ver Resultado" / Enviar
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Valida se a última pergunta foi respondida
            if (!checkStepValid()) {
                alert('Por favor, selecione uma opção na última pergunta.');
                return;
            }

            // Calcula a pontuação total somando os valores das respostas
            let total = 0;
            for (let i = 1; i <= totalSteps; i++) {
                const selected = document.querySelector(`input[name="q${i}"]:checked`);
                if (selected) total += parseInt(selected.value);
            }

            const percent = (total / 50) * 100;  // 50 é a pontuação máxima (5 perguntas x 10 pontos)
            const { analise, mensagemGeral, classeNota } = gerarAnaliseDetalhada(total, 50, percent);

            // Salva os dados no localStorage para possível uso em outras páginas (ex: mapa de comparação)
            localStorage.setItem('dadosFazenda', JSON.stringify({
                nota: percent.toFixed(0),
                mensagem: mensagemGeral,
                categorias: respostasDetalhadas
            }));

            /**
             * Constrói o HTML do relatório completo
             * Inclui:
             * - Nota circular com percentual
             * - Mensagem de classificação
             * - Pontos fortes, fracos e recomendações
             * - Tabela de desempenho por categoria
             * - Botão para comparar no mapa
             */
            const resultadoHTML = `
                <div class="resultado-completo">
                    <div class="resultado-cabecalho">
                        <i class="fas fa-chart-line"></i>
                        <h3>Relatório da Propriedade</h3>
                    </div>
                    
                    <div class="resultado-nota-circular ${classeNota}">
                        <div class="nota-valor">${percent.toFixed(0)}<span>%</span></div>
                        <div class="nota-rotulo">Índice de Sustentabilidade</div>
                    </div>
                    
                    <div class="resultado-mensagem ${classeNota}">
                        <i class="fas fa-info-circle"></i>
                        <p>${mensagemGeral}</p>
                    </div>
                    
                    <div class="resultado-analise-grid">
                        <!-- Pontos Fortes -->
                        <div class="analise-card pontos-fortes">
                            <div class="analise-titulo"><i class="fas fa-thumbs-up"></i><h4>Pontos Fortes</h4></div>
                            <ul>${analise.pontosFortes.length ? 
                                analise.pontosFortes.map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('') : 
                                '<li><i class="fas fa-minus-circle"></i> Nenhum ponto forte identificado ainda</li>'}</ul>
                        </div>
                        
                        <!-- Pontos a Melhorar -->
                        <div class="analise-card pontos-fracos">
                            <div class="analise-titulo"><i class="fas fa-exclamation-triangle"></i><h4>Pontos a Melhorar</h4></div>
                            <ul>${analise.pontosFracos.length ? 
                                analise.pontosFracos.map(item => `<li><i class="fas fa-arrow-up"></i> ${item}</li>`).join('') : 
                                '<li><i class="fas fa-check-circle"></i> Nenhum ponto crítico identificado!</li>'}</ul>
                        </div>
                        
                        <!-- Recomendações -->
                        <div class="analise-card observacoes">
                            <div class="analise-titulo"><i class="fas fa-clipboard-list"></i><h4>Observações e Recomendações</h4></div>
                            <ul>${analise.observacoes.length ? 
                                analise.observacoes.map(item => `<li><i class="fas fa-seedling"></i> ${item}</li>`).join('') : 
                                '<li><i class="fas fa-check-circle"></i> Parabéns! Todas as práticas estão adequadas.</li>'}</ul>
                        </div>
                    </div>
                    
                    <!-- Tabela de Desempenho por Categoria -->
                    <div class="tabela-desempenho">
                        <div class="tabela-titulo"><i class="fas fa-table"></i><h4>Desempenho por Categoria</h4></div>
                        <table>
                            <thead>
                                <tr><th>Categoria</th><th>Prática adotada</th><th>Nível</th><th>Pontuação</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><i class="fas fa-leaf"></i> Agrotóxicos</td>
                                    <td>${respostasDetalhadas.agrotoxicos.texto || 'Não informado'}</td>
                                    <td class="nivel-${respostasDetalhadas.agrotoxicos.nivel?.toLowerCase()}">${respostasDetalhadas.agrotoxicos.nivel || '-'}</td>
                                    <td><strong>${respostasDetalhadas.agrotoxicos.valor}</strong> / 10</td></tr>
                                <tr><td><i class="fas fa-bolt"></i> Matriz Energética</td>
                                    <td>${respostasDetalhadas.energia.texto || 'Não informado'}</td>
                                    <td class="nivel-${respostasDetalhadas.energia.nivel?.toLowerCase()}">${respostasDetalhadas.energia.nivel || '-'}</td>
                                    <td><strong>${respostasDetalhadas.energia.valor}</strong> / 10</td></tr>
                                <tr><td><i class="fas fa-mountain"></i> Conservação do Solo</td>
                                    <td>${respostasDetalhadas.solo.texto || 'Não informado'}</td>
                                    <td class="nivel-${respostasDetalhadas.solo.nivel?.toLowerCase()}">${respostasDetalhadas.solo.nivel || '-'}</td>
                                    <td><strong>${respostasDetalhadas.solo.valor}</strong> / 10</td></tr>
                                <tr><td><i class="fas fa-tint"></i> Uso da Água</td>
                                    <td>${respostasDetalhadas.agua.texto || 'Não informado'}</td>
                                    <td class="nivel-${respostasDetalhadas.agua.nivel?.toLowerCase()}">${respostasDetalhadas.agua.nivel || '-'}</td>
                                    <td><strong>${respostasDetalhadas.agua.valor}</strong> / 10</td></tr>
                                <tr><td><i class="fas fa-tree"></i> Biodiversidade</td>
                                    <td>${respostasDetalhadas.biodiversidade.texto || 'Não informado'}</td>
                                    <td class="nivel-${respostasDetalhadas.biodiversidade.nivel?.toLowerCase()}">${respostasDetalhadas.biodiversidade.nivel || '-'}</td>
                                    <td><strong>${respostasDetalhadas.biodiversidade.valor}</strong> / 10</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="resultado-rodape">
                        <i class="fas fa-calendar-alt"></i> Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}
                        <i class="fas fa-database"></i> Dados baseados nas respostas fornecidas
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="btn-primary" onclick="window.location.href='mapa.html'">
                            <i class="fas fa-map-marked-alt"></i> Comparar minha fazenda com regiões
                        </button>
                    </div>
                </div>
            `;

            // Exibe o resultado e esconde o formulário do quiz
            const scoreMessage = document.getElementById('score-message');
            if (scoreMessage) scoreMessage.innerHTML = resultadoHTML;
            if (resultDiv) resultDiv.style.display = 'block';
            if (quizForm) quizForm.style.display = 'none';
            
            // Rola a página suavemente para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /**
     * ================================================
     * FUNÇÃO PARA REINICIAR O QUIZ
     * ================================================
     * Esta função é chamada pelo botão "Refazer teste"
     * e está disponível globalmente via window
     */
    window.restartQuiz = function() {
        // Reseta o objeto de respostas
        respostasDetalhadas = {
            agrotoxicos: { valor: 0, texto: '', nivel: '' },
            energia: { valor: 0, texto: '', nivel: '' },
            solo: { valor: 0, texto: '', nivel: '' },
            agua: { valor: 0, texto: '', nivel: '' },
            biodiversidade: { valor: 0, texto: '', nivel: '' }
        };
        
        // Limpa todas as seleções de rádio e remove destaques visuais
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        
        // Mostra o formulário e esconde o resultado
        if (resultDiv) resultDiv.style.display = 'none';
        if (quizForm) quizForm.style.display = 'block';
        
        // Reinicia na primeira etapa
        currentStep = 1;
        showStep(1);
        
        // Rola suavemente para o início do quiz
        window.scrollTo({ top: (quizCard?.offsetTop || 0) - 20, behavior: 'smooth' });
    };

    /**
     * ================================================
     * INICIALIZAÇÃO
     * ================================================
     * Exibe a primeira etapa do quiz ao carregar a página
     */
    showStep(1);
    
});
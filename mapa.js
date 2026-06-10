/**
 * ================================================
 * SCRIPT DO MAPA INTERATIVO - COMPARAÇÃO ENTRE FAZENDAS E REGIÕES
 * ================================================
 * 
 * Este script gerencia o mapa interativo do Paraná, permitindo que o usuário
 * clique em cada região (mesorregião) para visualizar informações detalhadas
 * sobre práticas de sustentabilidade.
 * 
 * Funcionalidades principais:
 * - Exibe informações específicas de cada região (agrotóxicos, energia, solo, água, biodiversidade)
 * - Compara os dados da fazenda do usuário (quando disponíveis) com a região selecionada
 * - Gera recomendações personalizadas baseadas nas práticas da região
 * - Modal responsivo com design adaptado para modo escuro
 * - Animações de fade-in para as regiões do mapa
 */

/**
 * ================================================
 * BASE DE DADOS DAS REGIÕES DO PARANÁ
 * ================================================
 * 
 * Cada região contém:
 * - nome: Nome da mesorregião
 * - agrotoxicos: Descrição do uso de defensivos agrícolas
 * - agrotoxicosNota: Pontuação (0-10) para agrotóxicos
 * - energia: Descrição da matriz energética regional
 * - energiaNota: Pontuação (0-10) para energia
 * - solo: Descrição das práticas de conservação do solo
 * - soloNota: Pontuação (0-10) para solo
 * - agua: Descrição do uso e manejo da água
 * - aguaNota: Pontuação (0-10) para água
 * - biodiversidade: Descrição da preservação da biodiversidade
 * - biodiversidadeNota: Pontuação (0-10) para biodiversidade
 * - nota: Nota geral da região (0-10)
 * - notaPercentual: Percentual geral (0-100)
 * - fontes: Fontes dos dados utilizados
 * - praticaSugerida: Recomendação específica para a região
 * - area: Extensão territorial em km²
 * - municipios: Quantidade de municípios na região
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ---------- DADOS DETALHADOS DE CADA MESORREGIÃO ----------
    const regioesInfo = {
        // Região Norte Pioneiro - Agricultura tradicional em transição
        nortepioneiro: { 
            nome: "Norte Pioneiro", 
            agrotoxicos: "Uso elevado de defensivos (café, feijão, milho), mas com crescente adoção de manejo integrado e produtos biológicos.",
            agrotoxicosNota: 4.2,
            energia: "Hidrelétrica e biomassa (resíduos de café, cana e madeira).",
            energiaNota: 6.5,
            solo: "Plantio direto em 50% da área, necessidade de maior rotação de culturas.",
            soloNota: 5.8,
            agua: "Irrigação predominante por aspersão, baixa captação de chuva.",
            aguaNota: 4.5,
            biodiversidade: "Preservação de APP em 35% das propriedades, desmatamento reduzido nos últimos anos.",
            biodiversidadeNota: 6.0,
            nota: "6.2",
            notaPercentual: 62,
            fontes: "ADAPAR/SIAGRO 2021-2023; UNICAMP 2018.",
            praticaSugerida: "Adotar controle biológico de pragas e incentivar a agricultura orgânica.",
            area: "13.500 km²",
            municipios: "65 municípios"
        },
        
        // Região Sudeste - Cultivo tradicional de tabaco e erva-mate
        sudeste: { 
            nome: "Sudeste Paranaense", 
            agrotoxicos: "Cultivo tradicional de tabaco e erva-mate com uso moderado de defensivos.",
            agrotoxicosNota: 6.5,
            energia: "Hidrelétrica predominante, com potencial para biomassa florestal e solar.",
            energiaNota: 7.0,
            solo: "Preservação de encostas, porém com práticas conservacionistas limitadas.",
            soloNota: 7.2,
            agua: "Nascentes preservadas, irrigação por microaspersão em culturas perenes.",
            aguaNota: 7.5,
            biodiversidade: "Mata de Araucárias preservada em 45% da região, corredores ecológicos em desenvolvimento.",
            biodiversidadeNota: 7.8,
            nota: "7.0",
            notaPercentual: 70,
            fontes: "IPARDES (2004, 2021); EMBRAPA; SEAB/DERAL",
            praticaSugerida: "Fortalecer o cultivo de erva-mate orgânica e o turismo rural.",
            area: "17.800 km²",
            municipios: "58 municípios"
        },
        
        // Região Metropolitana de Curitiba - Destaque em agricultura orgânica
        curitiba: { 
            nome: "Região Metropolitana de Curitiba", 
            agrotoxicos: "Agricultura periurbana e orgânica em destaque, uso reduzido de agroquímicos.",
            agrotoxicosNota: 8.5,
            energia: "Hidrelétrica predominante, com forte expansão de energia solar e eólica.",
            energiaNota: 8.0,
            solo: "Agricultura orgânica em alta, compostagem e manejo ecológico do solo.",
            soloNota: 8.5,
            agua: "Reuso de água em propriedades certificadas, captação de chuva comum.",
            aguaNota: 8.5,
            biodiversidade: "Unidades de conservação na região metropolitana, projetos de recuperação de nascentes.",
            biodiversidadeNota: 9.0,
            nota: "8.7",
            notaPercentual: 87,
            fontes: "Censo Agro 2017 - IBGE; Emater/IDR-PR 2020.",
            praticaSugerida: "Expandir a agricultura urbana e os telhados verdes.",
            area: "15.400 km²",
            municipios: "29 municípios"
        },
        
        // Região Centro Ocidental - Alta dependência de insumos
        centroocidente: { 
            nome: "Centro Ocidental", 
            agrotoxicos: "Alta dependência de insumos industrializados (soja, milho, trigo).",
            agrotoxicosNota: 4.0,
            energia: "Hidrelétrica e termelétrica a biomassa (bagaço de cana).",
            energiaNota: 6.0,
            solo: "Plantio direto em 70% da área, mas com baixa rotação de culturas.",
            soloNota: 5.5,
            agua: "Irrigação intensiva por pivô central, sem sistemas de reuso.",
            aguaNota: 4.0,
            biodiversidade: "APPs reduzidas, perda significativa de vegetação nativa nas últimas décadas.",
            biodiversidadeNota: 4.5,
            nota: "5.2",
            notaPercentual: 52,
            fontes: "SEAB/DERAL 2021-2024; IPARDES 2020.",
            praticaSugerida: "Investir em energia solar e práticas de Integração Lavoura-Pecuária-Floresta.",
            area: "16.200 km²",
            municipios: "47 municípios"
        },
        
        // Região Noroeste - Maior perímetro irrigado do estado
        noroeste: { 
            nome: "Noroeste", 
            agrotoxicos: "Uso intensivo de defensivos (soja, milho, algodão) em áreas irrigadas.",
            agrotoxicosNota: 3.8,
            energia: "Hidrelétrica e pequenas centrais solares.",
            energiaNota: 5.5,
            solo: "Erosão em áreas de arenito, necessidade de terraceamento.",
            soloNota: 5.0,
            agua: "Maior perímetro irrigado do estado, sem captação de chuva significativa.",
            aguaNota: 4.5,
            biodiversidade: "Desmatamento histórico, áreas de preservação reduzidas a 20% da propriedade média.",
            biodiversidadeNota: 4.0,
            nota: "5.8",
            notaPercentual: 58,
            fontes: "IDR-PR/SEAB; ADAPAR/SIAGRO.",
            praticaSugerida: "Implementar irrigação por gotejamento e reuso de água.",
            area: "22.000 km²",
            municipios: "85 municípios"
        },
        
        // Região Norte Central - Cana-de-açúcar e grãos
        nortecentral: { 
            nome: "Norte Central", 
            agrotoxicos: "Cana-de-açúcar e grãos com médio consumo de agroquímicos.",
            agrotoxicosNota: 5.5,
            energia: "Bioeletricidade (cana-de-açúcar) e hidrelétrica.",
            energiaNota: 7.0,
            solo: "Queimadas controladas na cana, plantio direto em grãos.",
            soloNota: 6.0,
            agua: "Irrigação por aspersão, usinas com reuso de água da lavagem.",
            aguaNota: 6.0,
            biodiversidade: "Áreas de mata ciliar preservadas ao longo dos rios, projetos de recuperação.",
            biodiversidadeNota: 6.5,
            nota: "6.0",
            notaPercentual: 60,
            fontes: "IBGE/PAM 2023; UNICA 2022.",
            praticaSugerida: "Ampliar a produção de energia a partir de resíduos da cana.",
            area: "11.800 km²",
            municipios: "52 municípios"
        },
        
        // Região Sudoeste - Integração aves/suínos com biogás
        sudoeste: { 
            nome: "Sudoeste", 
            agrotoxicos: "Cultivo de grãos e integração aves/suínos; uso expressivo de agroquímicos.",
            agrotoxicosNota: 5.0,
            energia: "Biogás de resíduos animais, hidrelétrica e solar.",
            energiaNota: 8.0,
            solo: "Integração lavoura-pecuária, manejo de dejetos como fertilizante.",
            soloNota: 7.5,
            agua: "Tratamento de dejetos evita contaminação, porém consumo elevado.",
            aguaNota: 6.5,
            biodiversidade: "Áreas de mata preservadas nas cabeceiras, projetos de corredores ecológicos.",
            biodiversidadeNota: 7.0,
            nota: "7.1",
            notaPercentual: 71,
            fontes: "SEAB/DERAL 2023; UNIOESTE 2021.",
            praticaSugerida: "Expandir o uso de biogás para geração de eletricidade.",
            area: "18.500 km²",
            municipios: "64 municípios"
        },
        
        // Região Oeste - Grande produtor de grãos
        oeste: { 
            nome: "Oeste", 
            agrotoxicos: "Grande produtor de grãos e aves, com utilização majoritária de agroquímicos.",
            agrotoxicosNota: 4.5,
            energia: "Hidrelétrica, solar e biogás de dejetos.",
            energiaNota: 7.0,
            solo: "Plantio direto consolidado, rotação de culturas em expansão.",
            soloNota: 6.5,
            agua: "Irrigação por gotejamento em crescimento, captação de chuva incipiente.",
            aguaNota: 5.5,
            biodiversidade: "APPs em recuperação, projetos de adequação ambiental em andamento.",
            biodiversidadeNota: 6.0,
            nota: "6.3",
            notaPercentual: 63,
            fontes: "IPARDES 2022; RenovaPR.",
            praticaSugerida: "Aumentar a área de plantio direto e a diversificação de culturas.",
            area: "24.500 km²",
            municipios: "78 municípios"
        },
        
        // Região Centro Oriental - Destaque em agricultura orgânica
        centrooriente: { 
            nome: "Centro Oriental", 
            agrotoxicos: "Agricultura familiar e produção orgânica em alta, baixa utilização de agroquímicos.",
            agrotoxicosNota: 9.0,
            energia: "Solar, pequenas eólicas e hidrelétrica.",
            energiaNota: 8.5,
            solo: "Práticas agroecológicas consolidadas, compostagem e adubação verde.",
            soloNota: 9.0,
            agua: "Captação de chuva generalizada, irrigação eficiente por gotejamento.",
            aguaNota: 9.0,
            biodiversidade: "Maior número de propriedades orgânicas, mata nativa preservada em 60% da área.",
            biodiversidadeNota: 9.5,
            nota: "9.0",
            notaPercentual: 90,
            fontes: "IBGE (agricultura familiar); COPEL 2023.",
            praticaSugerida: "Criar cooperativas de comercialização direta de orgânicos.",
            area: "12.300 km²",
            municipios: "39 municípios"
        },
        
        // Região Centro Sul - Pecuária e silvicultura
        centrosul: { 
            nome: "Centro Sul", 
            agrotoxicos: "Pecuária e silvicultura, baixo uso de agroquímicos, baseado em pastagens naturais.",
            agrotoxicosNota: 8.0,
            energia: "Biomassa florestal e hidrelétrica.",
            energiaNota: 7.5,
            solo: "Sistemas silvipastoris, manejo de baixo carbono em desenvolvimento.",
            soloNota: 8.0,
            agua: "Proteção de nascentes, pastagens com manejo hídrico.",
            aguaNota: 8.0,
            biodiversidade: "Maior área contínua de reflorestamento de pinus, com corredores ecológicos.",
            biodiversidadeNota: 8.5,
            nota: "7.8",
            notaPercentual: 78,
            fontes: "IAP/EMBRAPA 2021; SEAB/DERAL 2023.",
            praticaSugerida: "Expandir sistemas silvipastoris e o manejo de baixo carbono.",
            area: "10.900 km²",
            municipios: "30 municípios"
        }
    };

    // ---------- ELEMENTOS DO DOM ----------
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalContentDiv = document.getElementById('modal-content');

    // Recupera os dados da fazenda armazenados na calculadora (localStorage)
    let dadosFazenda = JSON.parse(localStorage.getItem('dadosFazenda'));

    /**
     * ================================================
     * FUNÇÕES AUXILIARES
     * ================================================
     */

    /**
     * Retorna a classe CSS correspondente à nota (para estilização de cores)
     * @param {number} nota - Nota de 0 a 10
     * @returns {string} - Classe CSS (nota-excelente, nota-bom, nota-atencao, nota-urgente)
     */
    function getNotaClassPorValor(nota) {
        if (nota >= 8) return 'nota-excelente';
        if (nota >= 6) return 'nota-bom';
        if (nota >= 4) return 'nota-atencao';
        return 'nota-urgente';
    }

    /**
     * Gera o HTML da barra de progresso visual
     * @param {number} percentual - Percentual de 0 a 100
     * @returns {string} - HTML da barra de progresso
     */
    function getBarraProgresso(percentual) {
        // Define a cor da barra baseada no percentual
        const cor = percentual >= 80 ? '#2E7D32' :    // Verde escuro (excelente)
                    percentual >= 60 ? '#E6B91E' :    // Amarelo/dourado (bom)
                    percentual >= 40 ? '#FF9800' :    // Laranja (atenção)
                    '#D32F2F';                        // Vermelho (urgente)
        
        return `<div class="progresso-barra">
                    <div class="progresso-preenchido" style="width: ${percentual}%; background: ${cor};"></div>
                </div>`;
    }

    /**
     * ================================================
     * FUNÇÕES DE MODAL
     * ================================================
     */

    /**
     * Abre o modal com informações normais (sem comparação)
     * Usado quando o usuário NÃO preencheu a calculadora
     * @param {string} regiaoId - ID da região clicada
     */
    function abrirModalNormal(regiaoId) {
        const info = regioesInfo[regiaoId];
        if (!info) {
            modalContentDiv.innerHTML = `<p>Informações não disponíveis para esta região.</p>`;
            modalOverlay.classList.add('active');
            return;
        }

        // Constrói o HTML do modal com informações detalhadas da região
        modalContentDiv.innerHTML = `
            <div class="modal-normal">
                <div class="modal-header">
                    <h2><i class="fas fa-map-marker-alt"></i> ${info.nome}</h2>
                    <button class="modal-close-btn" onclick="fecharModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Card: Agrotóxicos -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-leaf"></i></div>
                        <div class="info-card-content">
                            <h4>Agrotóxicos</h4>
                            <span class="nota-categoria ${getNotaClassPorValor(info.agrotoxicosNota)}">${info.agrotoxicosNota}/10</span>
                            <p>${info.agrotoxicos}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Matriz Energética -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-bolt"></i></div>
                        <div class="info-card-content">
                            <h4>Matriz Energética</h4>
                            <span class="nota-categoria ${getNotaClassPorValor(info.energiaNota)}">${info.energiaNota}/10</span>
                            <p>${info.energia}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Conservação do Solo -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-mountain"></i></div>
                        <div class="info-card-content">
                            <h4>Conservação do Solo</h4>
                            <span class="nota-categoria ${getNotaClassPorValor(info.soloNota)}">${info.soloNota}/10</span>
                            <p>${info.solo}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Uso da Água -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-tint"></i></div>
                        <div class="info-card-content">
                            <h4>Uso da Água</h4>
                            <span class="nota-categoria ${getNotaClassPorValor(info.aguaNota)}">${info.aguaNota}/10</span>
                            <p>${info.agua}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Biodiversidade -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-tree"></i></div>
                        <div class="info-card-content">
                            <h4>Biodiversidade</h4>
                            <span class="nota-categoria ${getNotaClassPorValor(info.biodiversidadeNota)}">${info.biodiversidadeNota}/10</span>
                            <p>${info.biodiversidade}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Prática Sugerida -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-seedling"></i></div>
                        <div class="info-card-content">
                            <h4>Prática Sugerida</h4>
                            <p>${info.praticaSugerida}</p>
                        </div>
                    </div>
                    
                    <!-- Card: Dados Geográficos -->
                    <div class="info-card">
                        <div class="info-card-icon"><i class="fas fa-draw-polygon"></i></div>
                        <div class="info-card-content">
                            <h4>Dados Geográficos</h4>
                            <p><strong>Área:</strong> ${info.area} | <strong>Municípios:</strong> ${info.municipios}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <i class="fas fa-book-open"></i> Fontes: ${info.fontes}
                </div>
            </div>
        `;
        modalOverlay.classList.add('active');
    }

    /**
     * Abre o modal com comparação entre a fazenda do usuário e a região
     * Usado quando o usuário JÁ preencheu a calculadora
     * @param {string} regiaoId - ID da região clicada
     */
    function abrirModalComparacao(regiaoId) {
        const info = regioesInfo[regiaoId];
        if (!info) return;
        
        const fazenda = dadosFazenda;
        const cats = fazenda.categorias;  // Categorias da fazenda (agrotoxicos, energia, solo, agua, biodiversidade)
        const notaFazendaDecimal = (parseInt(fazenda.nota) / 10).toFixed(1);
        
        modalContentDiv.innerHTML = `
            <div class="modal-comparacao">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-line"></i> Comparação: Sua Fazenda vs ${info.nome}</h2>
                    <button class="modal-close-btn" onclick="fecharModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Resumo comparativo das notas gerais -->
                    <div class="comparacao-resumo">
                        <div class="resumo-item resumo-fazenda">
                            <div class="resumo-titulo"><i class="fas fa-tractor"></i> Sua Propriedade</div>
                            <div class="resumo-nota ${getNotaClassPorValor(parseFloat(notaFazendaDecimal))}">
                                <span class="nota-grande">${notaFazendaDecimal}/10</span>
                                <span class="nota-label">Índice de Sustentabilidade</span>
                            </div>
                            <div class="resumo-mensagem">${fazenda.mensagem}</div>
                        </div>
                        <div class="resumo-item resumo-regiao">
                            <div class="resumo-titulo"><i class="fas fa-map-marked-alt"></i> Região ${info.nome}</div>
                            <div class="resumo-nota ${getNotaClassPorValor(parseFloat(info.nota))}">
                                <span class="nota-grande">${info.nota}/10</span>
                                <span class="nota-label">Índice Regional</span>
                            </div>
                            <div class="resumo-barra">${getBarraProgresso(info.notaPercentual)}</div>
                        </div>
                    </div>
                    
                    <!-- Tabela comparativa por categoria -->
                    <div class="comparacao-tabela">
                        <h3>Comparativo por Categoria</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Sua Fazenda</th>
                                    <th>Região ${info.nome}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Agrotóxicos -->
                                <tr>
                                    <td class="categoria-nome"><i class="fas fa-leaf"></i> Agrotóxicos</td>
                                    <td class="detalhe-fazenda">
                                        <div class="pontuacao ${getNotaClassPorValor(cats.agrotoxicos.valor)}">${cats.agrotoxicos.valor}/10</div>
                                        <div class="descricao">${cats.agrotoxicos.texto || 'Não informado'}</div>
                                    </td>
                                    <td class="detalhe-regiao">
                                        <div class="pontuacao ${getNotaClassPorValor(info.agrotoxicosNota)}">${info.agrotoxicosNota}/10</div>
                                        <div class="descricao">${info.agrotoxicos}</div>
                                    </td>
                                </tr>
                                <!-- Matriz Energética -->
                                <tr>
                                    <td class="categoria-nome"><i class="fas fa-bolt"></i> Matriz Energética</td>
                                    <td class="detalhe-fazenda">
                                        <div class="pontuacao ${getNotaClassPorValor(cats.energia.valor)}">${cats.energia.valor}/10</div>
                                        <div class="descricao">${cats.energia.texto || 'Não informado'}</div>
                                    </td>
                                    <td class="detalhe-regiao">
                                        <div class="pontuacao ${getNotaClassPorValor(info.energiaNota)}">${info.energiaNota}/10</div>
                                        <div class="descricao">${info.energia}</div>
                                    </td>
                                </tr>
                                <!-- Conservação do Solo -->
                                <tr>
                                    <td class="categoria-nome"><i class="fas fa-mountain"></i> Conservação do Solo</td>
                                    <td class="detalhe-fazenda">
                                        <div class="pontuacao ${getNotaClassPorValor(cats.solo.valor)}">${cats.solo.valor}/10</div>
                                        <div class="descricao">${cats.solo.texto || 'Não informado'}</div>
                                    </td>
                                    <td class="detalhe-regiao">
                                        <div class="pontuacao ${getNotaClassPorValor(info.soloNota)}">${info.soloNota}/10</div>
                                        <div class="descricao">${info.solo}</div>
                                    </td>
                                </tr>
                                <!-- Uso da Água -->
                                <tr>
                                    <td class="categoria-nome"><i class="fas fa-tint"></i> Uso da Água</td>
                                    <td class="detalhe-fazenda">
                                        <div class="pontuacao ${getNotaClassPorValor(cats.agua.valor)}">${cats.agua.valor}/10</div>
                                        <div class="descricao">${cats.agua.texto || 'Não informado'}</div>
                                    </td>
                                    <td class="detalhe-regiao">
                                        <div class="pontuacao ${getNotaClassPorValor(info.aguaNota)}">${info.aguaNota}/10</div>
                                        <div class="descricao">${info.agua}</div>
                                    </td>
                                </tr>
                                <!-- Biodiversidade -->
                                <tr>
                                    <td class="categoria-nome"><i class="fas fa-tree"></i> Biodiversidade</td>
                                    <td class="detalhe-fazenda">
                                        <div class="pontuacao ${getNotaClassPorValor(cats.biodiversidade.valor)}">${cats.biodiversidade.valor}/10</div>
                                        <div class="descricao">${cats.biodiversidade.texto || 'Não informado'}</div>
                                    </td>
                                    <td class="detalhe-regiao">
                                        <div class="pontuacao ${getNotaClassPorValor(info.biodiversidadeNota)}">${info.biodiversidadeNota}/10</div>
                                        <div class="descricao">${info.biodiversidade}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Recomendação personalizada com base na região -->
                    <div class="recomendacao-destaque">
                        <i class="fas fa-lightbulb"></i>
                        <div>
                            <strong>Recomendação para sua propriedade:</strong><br>
                            ${info.praticaSugerida}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <i class="fas fa-book-open"></i> Fontes: ${info.fontes}
                </div>
                <div class="comparacao-aviso">
                    <i class="fas fa-info-circle"></i> Comparação baseada nas respostas da calculadora e dados oficiais da região.
                </div>
            </div>
        `;
        modalOverlay.classList.add('active');
    }

    /**
     * Função global para fechar o modal
     * Está disponível no escopo global (window) para ser chamada pelo onclick
     */
    window.fecharModal = function() {
        modalOverlay.classList.remove('active');
    };

    /**
     * Função principal que decide qual tipo de modal abrir
     * Se existem dados da fazenda -> abre comparação
     * Caso contrário -> abre informações normais
     * @param {string} regiaoId - ID da região clicada
     */
    function abrirModal(regiaoId) {
        dadosFazenda ? abrirModalComparacao(regiaoId) : abrirModalNormal(regiaoId);
    }

    /**
     * ================================================
     * EVENTOS DO MODAL
     * ================================================
     */

    // Fechar modal pelo botão X
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    }
    
    // Fechar modal ao clicar no overlay (fundo escuro)
    modalOverlay.addEventListener('click', (e) => { 
        if (e.target === modalOverlay) modalOverlay.classList.remove('active'); 
    });
    
    // Fechar modal ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
        }
    });

    /**
     * ================================================
     * CONFIGURAÇÃO DOS EVENTOS DE CLIQUE NO MAPA
     * ================================================
     */

    // Lista de todos os IDs das regiões no mapa SVG
    const regioesIds = [
        'sudeste', 'nortepioneiro', 'curitiba', 'centroocidente', 'noroeste',
        'nortecentral', 'sudoeste', 'oeste', 'centrooriente', 'centrosul'
    ];

    /**
     * Adiciona evento de clique para cada região do mapa
     * Quando clicado, aplica um pequeno efeito de escala e abre o modal
     */
    regioesIds.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('click', (e) => {
                // Efeito visual de clique (feedback tátil)
                elemento.style.transform = 'scale(1.02)';
                elemento.style.transition = 'transform 0.2s ease';
                setTimeout(() => { 
                    if (elemento) elemento.style.transform = ''; 
                }, 200);
                
                // Abre o modal com as informações da região
                abrirModal(id);
            });
        }
    });

    /**
     * ================================================
     * ESTILOS DINÂMICOS INJETADOS VIA JAVASCRIPT
     * ================================================
     * 
     * Estes estilos são adicionados dinamicamente para:
     * - Animar o fade-in das regiões no carregamento
     * - Estilizar os modais de comparação e informação normal
     * - Garantir compatibilidade com modo escuro
     */
    const style = document.createElement('style');
    style.textContent = `
        /* Animação de fade-in para as regiões do mapa SVG */
        svg path { 
            opacity: 0; 
            animation: fadeInRegions 0.6s ease forwards; 
        }
        
        @keyframes fadeInRegions { 
            from { 
                opacity: 0; 
                transform: translateY(10px); 
            } 
            to { 
                opacity: 1; 
                transform: translateY(0); 
            } 
        }
        
        /* Aplica delays progressivos para cada região (efeito cascata) */
        ${regioesIds.map((id, idx) => `#${id} { animation-delay: ${0.05 * (idx+1)}s; }`).join('')}
        
        /* Estilos base dos modais */
        .modal-comparacao, .modal-normal {
            background: white;
            border-radius: 24px;
            max-width: 950px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .dark-mode .modal-comparacao, .dark-mode .modal-normal { background: #1A2A1A; }
        
        /* Cabeçalho do modal */
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #E6B91E;
            position: sticky;
            top: 0;
            background: white;
            z-index: 10;
        }
        .dark-mode .modal-header { background: #1A2A1A; }
        .modal-header h2 { margin: 0; font-size: 1.4rem; color: #0B3B2F; }
        .dark-mode .modal-header h2 { color: #F0F7EA; }
        
        /* Botão de fechar */
        .modal-close-btn {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #666;
            transition: all 0.2s;
            line-height: 1;
        }
        .modal-close-btn:hover { color: #E6B91E; }
        
        /* Corpo do modal */
        .modal-body { padding: 1.5rem 2rem; }
        
        /* Layout do resumo comparativo (grid 2 colunas) */
        .comparacao-resumo {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        /* Cards do resumo */
        .resumo-item {
            background: #F9F9F7;
            border-radius: 16px;
            padding: 1.5rem;
            text-align: center;
            border: 1px solid #E2E8E0;
        }
        .dark-mode .resumo-item { background: #1C2A1C; border-color: #2C3E2C; }
        .resumo-titulo { font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; color: #0B3B2F; }
        .dark-mode .resumo-titulo { color: #F0F7EA; }
        .resumo-nota { margin: 1rem 0; }
        .nota-grande { font-size: 2.5rem; font-weight: 800; display: block; }
        .nota-label { font-size: 0.8rem; color: #5B6E8C; }
        .resumo-mensagem { font-size: 0.85rem; color: #5B6E8C; margin-top: 0.5rem; }
        .resumo-barra { margin-top: 1rem; }
        
        /* Barra de progresso */
        .progresso-barra { background: #E2E8E0; border-radius: 4px; height: 8px; width: 100%; overflow: hidden; }
        .progresso-preenchido { border-radius: 4px; height: 8px; }
        
        /* Tabela comparativa */
        .comparacao-tabela { margin-bottom: 1.5rem; }
        .comparacao-tabela h3 { margin-bottom: 1rem; color: #0B3B2F; font-size: 1.2rem; }
        .dark-mode .comparacao-tabela h3 { color: #F0F7EA; }
        .comparacao-tabela table { width: 100%; border-collapse: collapse; }
        .comparacao-tabela th, .comparacao-tabela td { 
            padding: 0.75rem; 
            text-align: left; 
            border-bottom: 1px solid #E2E8E0; 
            vertical-align: top; 
        }
        .dark-mode .comparacao-tabela th, .dark-mode .comparacao-tabela td { border-bottom-color: #2C3E2C; }
        .comparacao-tabela th { background: #F0F4EF; font-weight: 600; }
        .dark-mode .comparacao-tabela th { background: #2A3E2A; }
        .categoria-nome { font-weight: 600; width: 130px; }
        .detalhe-fazenda, .detalhe-regiao { width: 40%; }
        .pontuacao { 
            font-weight: 700; 
            margin-bottom: 0.5rem; 
            font-size: 1rem; 
            display: inline-block; 
            padding: 0.2rem 0.6rem; 
            border-radius: 20px; 
            background: rgba(0,0,0,0.05); 
        }
        .descricao { font-size: 0.8rem; line-height: 1.4; color: #5B6E8C; }
        .dark-mode .descricao { color: #A8C3A8; }
        
        /* Caixa de recomendação em destaque */
        .recomendacao-destaque {
            background: #FFF9E6;
            border-left: 4px solid #E6B91E;
            padding: 1rem;
            border-radius: 12px;
            display: flex;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .recomendacao-destaque i { font-size: 1.5rem; color: #E6B91E; }
        .dark-mode .recomendacao-destaque { background: #2A3E2A; }
        
        /* Rodapé do modal */
        .modal-footer { 
            padding: 1rem 2rem; 
            border-top: 1px solid #E2E8E0; 
            font-size: 0.7rem; 
            color: #8B9BA8; 
            background: white; 
        }
        .dark-mode .modal-footer { background: #1A2A1A; border-top-color: #2C3E2C; }
        
        /* Aviso da comparação */
        .comparacao-aviso { 
            padding: 0.75rem 2rem 1.5rem; 
            font-size: 0.7rem; 
            text-align: center; 
            color: #8B9BA8; 
        }
        
        /* Cores das notas */
        .nota-excelente .nota-grande, .nota-excelente .pontuacao { color: #2E7D32; }
        .nota-bom .nota-grande, .nota-bom .pontuacao { color: #E6B91E; }
        .nota-atencao .nota-grande, .nota-atencao .pontuacao { color: #FF9800; }
        .nota-urgente .nota-grande, .nota-urgente .pontuacao { color: #D32F2F; }
        
        /* Badge de nota por categoria */
        .nota-categoria {
            display: inline-block;
            font-weight: 700;
            padding: 0.2rem 0.6rem;
            border-radius: 20px;
            background: rgba(0,0,0,0.05);
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
        }
        
        /* Cards de informação (modo normal) */
        .info-card {
            display: flex;
            gap: 1rem;
            padding: 0.75rem;
            background: #F9F9F7;
            border-radius: 12px;
            border: 1px solid #E2E8E0;
            margin-bottom: 0.75rem;
        }
        .dark-mode .info-card { background: #1C2A1C; border-color: #2C3E2C; }
        .info-card-icon i { font-size: 1.5rem; color: #E6B91E; min-width: 32px; }
        .info-card-content { flex: 1; }
        .info-card-content h4 { margin: 0 0 0.25rem 0; font-size: 0.9rem; color: #0B3B2F; }
        .dark-mode .info-card-content h4 { color: #F0F7EA; }
        .info-card-content p { margin: 0.25rem 0 0 0; font-size: 0.85rem; line-height: 1.4; color: #5B6E8C; }
        .dark-mode .info-card-content p { color: #A8C3A8; }
        
        /* Responsividade para telas menores */
        @media (max-width: 700px) {
            .comparacao-resumo { grid-template-columns: 1fr; gap: 1rem; }
            .modal-body { padding: 1rem; }
            .comparacao-tabela th, .comparacao-tabela td { padding: 0.5rem; font-size: 0.75rem; }
            .categoria-nome { width: 100px; }
            .nota-grande { font-size: 1.8rem; }
            .resumo-item { padding: 1rem; }
            .modal-header { padding: 1rem; }
            .modal-header h2 { font-size: 1.1rem; }
        }
    `;
    document.head.appendChild(style);
    
}); // Fim do DOMContentLoaded
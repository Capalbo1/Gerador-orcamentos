// Importações
import { carregarDadosDasCirurgias } from './api.js';
import { calcularValorComDesconto, atualizarOrcamento } from './calcularConta.js';
import { mostrarDetalhes, configurarModal } from './detalhesModal.js';
import { gerarPDF } from './gerarPdf.js';

// Variáveis globais
let todasCirurgias = [];
let cirurgiasSelecionadas = []; // Array compartilhado com calcularConta.js

// Função para criar IDs únicos
function criarIdUnico(base, index) {
    return `${base.toLowerCase().replace(/\s+/g, '-')}-${index}`;
}

// Carrega e exibe as cirurgias
async function carregarEExibirCirurgias() {
    try {
        todasCirurgias = await carregarDadosDasCirurgias();
        criarNavegacaoCategorias();
        criarSecoesCirurgias();
        configurarModal();
        configurarEventos();
    } catch (error) {
        console.error('Erro ao carregar cirurgias:', error);
        alert('Não foi possível carregar os dados. Por favor, recarregue a página.');
    }
}

// Cria o menu de navegação por categorias
function criarNavegacaoCategorias() {
    const nav = document.getElementById('especialidades-nav');
    nav.innerHTML = '';
    const categorias = [...new Set(todasCirurgias.map(c => c.Categoria))];
    
    categorias.forEach((categoria, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = `nav-link ${index === 0 ? 'active' : ''}`;
        link.textContent = categoria;
        link.dataset.especialidade = categoria.toLowerCase().replace(/\s+/g, '-');
        nav.appendChild(link);
    });
}

// Cria as seções de cirurgias
function criarSecoesCirurgias() {
    const main = document.querySelector('main');
    document.querySelectorAll('.especialidade-section').forEach(section => section.remove());
    
    const cirurgiasPorCategoria = todasCirurgias.reduce((acc, cirurgia) => {
        const categoria = cirurgia.Categoria;
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(cirurgia);
        return acc;
    }, {});
    
    Object.entries(cirurgiasPorCategoria).forEach(([categoria, cirurgias]) => {
        const secaoId = categoria.toLowerCase().replace(/\s+/g, '-');
        const secao = document.createElement('section');
        secao.id = secaoId;
        secao.className = 'especialidade-section';
        
        let iconClass = 'fa-procedures';
        if (categoria === 'Parto') iconClass = 'fa-baby';
        if (categoria === 'Gineco') iconClass = 'fa-female';
        
        secao.innerHTML = `<h3><i class="fas ${iconClass}"></i> ${categoria}</h3>`;
        
        cirurgias.forEach((cirurgia, index) => {
            const cirurgiaId = criarIdUnico(cirurgia.Nome, index);
            secao.innerHTML += `
                <div class="cirurgia-item">
                    <input type="checkbox" class="cirurgia-checkbox" 
                           id="${cirurgiaId}" 
                           data-valor="${cirurgia.Valor}"
                           data-cirurgia-id="${cirurgiaId}">
                    <div class="cirurgia-info">
                        <div class="cirurgia-nome">${cirurgia.Nome}</div>
                        <div class="cirurgia-descricao">${cirurgia.Descrição}</div>
                        <div class="cirurgia-valor">R$ ${parseFloat(cirurgia.Valor).toFixed(2).replace('.', ',')}</div>
                    </div>
                    <button class="detalhes-btn" data-cirurgia-id="${cirurgiaId}">Detalhes</button>
                </div>
            `;
        });
        
        main.insertBefore(secao, document.querySelector('.orcamento-container'));
    });
    
    const primeiraSecao = document.querySelector('.especialidade-section');
    if (primeiraSecao) primeiraSecao.classList.add('active');
}

// Configura os eventos
function configurarEventos() {
    // Navegação por categorias
    document.getElementById('especialidades-nav').addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            const especialidade = e.target.dataset.especialidade;
            document.querySelectorAll('.especialidade-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(especialidade)?.classList.add('active');
        }
    });
    
    // Seleção de cirurgias (com ordenação para descontos)
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('cirurgia-checkbox')) {
            const checkbox = e.target;
            const cirurgiaId = checkbox.dataset.cirurgiaId;
            const valor = parseFloat(checkbox.dataset.valor);
            const nome = checkbox.closest('.cirurgia-item').querySelector('.cirurgia-nome').textContent;
            
            if (checkbox.checked) {
                cirurgiasSelecionadas.push({ id: cirurgiaId, nome, valor });
            } else {
                cirurgiasSelecionadas = cirurgiasSelecionadas.filter(item => item.id !== cirurgiaId);
            }
            
            // Ordena do maior para o menor valor (para aplicar descontos corretamente)
            cirurgiasSelecionadas.sort((a, b) => b.valor - a.valor);
            atualizarOrcamento();
        }
    });
    
    // Botão de detalhes
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('detalhes-btn')) {
            const cirurgiaId = e.target.dataset.cirurgiaId;
            const cirurgia = todasCirurgias.find(c => 
                criarIdUnico(c.Nome, todasCirurgias.indexOf(c)) === cirurgiaId
            );
            if (cirurgia) mostrarDetalhes(cirurgia);
        }
    });
    
    // Gerar PDF (com array explícito)
    document.getElementById('gerar-pdf').addEventListener('click', () => {
        gerarPDF([...cirurgiasSelecionadas]); // Passa uma cópia do array
    });
}

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', carregarEExibirCirurgias);
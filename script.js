// Dados completos das cirurgias
const cirurgiasData = {
    "parto-normal": {
        nome: "Parto Normal",
        descricao: "Parto vaginal sem complicações, com acompanhamento médico e equipe de enfermagem.",
        valor: 5000,
        inclui: [
            "Acompanhamento médico durante todo o trabalho de parto",
            "Equipe de enfermagem especializada",
            "Alojamento conjunto (mãe e bebê)",
            "Primeiros cuidados com o recém-nascido"
        ],
        naoInclui: [
            "Exames laboratoriais prévios",
            "Medicamentos específicos",
            "Complicações que requeiram procedimentos adicionais"
        ],
        internacao: "2 dias"
    },
    "cesariana": {
        nome: "Cesárea",
        descricao: "Parto cirúrgico realizado quando há indicação médica ou escolha da gestante.",
        valor: 8000,
        inclui: [
            "Procedimento cirúrgico",
            "Anestesia",
            "Equipe médica completa",
            "Alojamento conjunto (mãe e bebê)",
            "Primeiros cuidados com o recém-nascido"
        ],
        naoInclui: [
            "Exames pré-operatórios",
            "Medicamentos pós-operatórios",
            "Complicações que requeiram procedimentos adicionais"
        ],
        internacao: "3 dias"
    },
    // Adicione os dados das outras cirurgias seguindo o mesmo padrão
};

// Variáveis globais
let cirurgiasSelecionadas = [];
let totalOrcamento = 0;

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre especialidades
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe active apenas no link clicado
            this.classList.add('active');
            
            // Esconde todas as seções
            document.querySelectorAll('.especialidade-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostra apenas a seção correspondente
            const especialidade = this.getAttribute('data-especialidade');
            document.getElementById(especialidade).classList.add('active');
        });
    });
    
    // Evento para checkboxes de cirurgias
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('cirurgia-checkbox')) {
            const checkbox = e.target;
            const cirurgiaId = checkbox.id;
            const valor = parseFloat(checkbox.getAttribute('data-valor'));
            
            if (checkbox.checked) {
                // Adiciona ao orçamento
                cirurgiasSelecionadas.push({
                    id: cirurgiaId,
                    nome: checkbox.parentElement.querySelector('.cirurgia-nome').textContent,
                    valor: valor
                });
                totalOrcamento += valor;
            } else {
                // Remove do orçamento
                cirurgiasSelecionadas = cirurgiasSelecionadas.filter(item => item.id !== cirurgiaId);
                totalOrcamento -= valor;
            }
            
            atualizarOrcamento();
        }
    });
    
    // Evento para botões de detalhes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('detalhes-btn')) {
            const cirurgiaId = e.target.getAttribute('data-cirurgia');
            mostrarDetalhes(cirurgiaId);
        }
    });
    
    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('modal-detalhes').style.display = 'none';
    });
    
    // Gerar PDF
    document.getElementById('gerar-pdf').addEventListener('click', gerarPDF);
});

// Atualiza o painel de orçamento
function atualizarOrcamento() {
    const container = document.getElementById('cirurgias-selecionadas');
    
    if (cirurgiasSelecionadas.length === 0) {
        container.innerHTML = '<p class="nenhuma-selecionada">Nenhuma cirurgia selecionada ainda</p>';
    } else {
        container.innerHTML = '';
        cirurgiasSelecionadas.forEach(cirurgia => {
            const div = document.createElement('div');
            div.className = 'cirurgia-selecionada';
            div.innerHTML = `
                <span>${cirurgia.nome}</span>
                <span>R$ ${cirurgia.valor.toFixed(2).replace('.', ',')}</span>
            `;
            container.appendChild(div);
        });
    }
    
    // Atualiza o total
    document.getElementById('total-orcamento').textContent = 
        `R$ ${totalOrcamento.toFixed(2).replace('.', ',')}`;
}

// Mostra os detalhes da cirurgia no modal
function mostrarDetalhes(cirurgiaId) {
    const cirurgia = cirurgiasData[cirurgiaId];
    if (!cirurgia) return;
    
    document.getElementById('modal-titulo').textContent = cirurgia.nome;
    document.getElementById('modal-descricao').textContent = cirurgia.descricao;
    
    const incluiList = document.getElementById('modal-inclui');
    incluiList.innerHTML = '';
    cirurgia.inclui.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        incluiList.appendChild(li);
    });
    
    const naoIncluiList = document.getElementById('modal-nao-inclui');
    naoIncluiList.innerHTML = '';
    cirurgia.naoInclui.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        naoIncluiList.appendChild(li);
    });
    
    document.getElementById('modal-internacao').textContent = cirurgia.internacao;
    document.getElementById('modal-valor').textContent = 
        `R$ ${cirurgia.valor.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('modal-detalhes').style.display = 'flex';
}

// Gera o PDF do orçamento
function gerarPDF() {
    if (cirurgiasSelecionadas.length === 0) {
        alert('Por favor, selecione pelo menos uma cirurgia para gerar o orçamento.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text('Orçamento Cirúrgico', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Clínica Médica Especializada', 105, 30, { align: 'center' });
    doc.text('CNPJ: 00.000.000/0000-00', 105, 35, { align: 'center' });
    
    // Linha divisória
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Dados do paciente (simulado)
    doc.setFontSize(14);
    doc.text('Dados do Paciente:', 20, 50);
    
    doc.setFontSize(12);
    doc.text('Nome: _________________________________________', 20, 60);
    doc.text('CPF: ___________________________  Telefone: ________________', 20, 70);
    
    // Cirurgias selecionadas
    doc.setFontSize(14);
    doc.text('Procedimentos Selecionados:', 20, 85);
    
    doc.setFontSize(12);
    let y = 95;
    cirurgiasSelecionadas.forEach((cirurgia, index) => {
        doc.text(`${index + 1}. ${cirurgia.nome}`, 25, y);
        doc.text(`R$ ${cirurgia.valor.toFixed(2).replace('.', ',')}`, 180, y, { align: 'right' });
        y += 7;
    });
    
    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 160, y + 10);
    doc.text(`R$ ${totalOrcamento.toFixed(2).replace('.', ',')}`, 180, y + 10, { align: 'right' });
    
    // Termos e condições
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Termos e Condições:', 20, y + 25);
    doc.text('- Este orçamento tem validade de 30 dias a partir da data de emissão.', 20, y + 30);
    doc.text('- Valores sujeitos a alteração conforme necessidade de procedimentos adicionais.', 20, y + 35);
    doc.text('- O pagamento pode ser parcelado em até 12x no cartão de crédito.', 20, y + 40);
    
    // Assinaturas
    doc.setFontSize(12);
    doc.text('___________________________', 50, y + 60);
    doc.text('Assinatura do Paciente', 50, y + 65);
    
    doc.text('___________________________', 130, y + 60);
    doc.text('Responsável Médico', 130, y + 65);
    
    // Data
    const hoje = new Date();
    doc.text(`Data: ${hoje.toLocaleDateString('pt-BR')}`, 20, y + 80);
    
    // Salva o PDF
    doc.save(`Orçamento Cirúrgico - ${hoje.toLocaleDateString('pt-BR')}.pdf`);
}
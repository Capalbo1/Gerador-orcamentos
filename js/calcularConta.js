// Remova a importação de './data.js' (usaremos o array global de main.js)
let cirurgiasSelecionadas = []; // Será preenchido pelo main.js

// Função para calcular descontos (MANTIDA)
export function calcularValorComDesconto() {
    return cirurgiasSelecionadas.map((cirurgia, index) => {
        let percentual = 1.0;
        if (index === 1) percentual = 0.7;
        if (index >= 2) percentual = 0.5;
        
        return {
            ...cirurgia,
            valorComDesconto: cirurgia.valor * percentual,
            percentualAplicado: Math.round(percentual * 100),
            ordemSelecao: index
        };
    });
}

// Atualiza o orçamento (MANTIDA)
export function atualizarOrcamento() {
    const container = document.getElementById('cirurgias-selecionadas');
    
    if (cirurgiasSelecionadas.length === 0) {
        container.innerHTML = '<p class="nenhuma-selecionada">Nenhuma cirurgia selecionada ainda</p>';
        document.getElementById('total-orcamento').textContent = 'R$ 0,00';
        return 0;
    }

    container.innerHTML = '';
    const cirurgiasComDesconto = calcularValorComDesconto();
    let total = 0;
    
    cirurgiasComDesconto.forEach((cirurgia, index) => {
        total += cirurgia.valorComDesconto;
        
        const div = document.createElement('div');
        div.className = 'cirurgia-selecionada';
        div.innerHTML = `
            <div>
                <span>${cirurgia.nome}</span>
                ${index > 0 ? `<span class="desconto-badge">-${100 - cirurgia.percentualAplicado}%</span>` : ''}
            </div>
            <div>
                ${index > 0 ? `<span class="valor-original">R$ ${cirurgia.valor.toFixed(2).replace('.', ',')}</span>` : ''}
                <span>R$ ${cirurgia.valorComDesconto.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('total-orcamento').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    return total;
}
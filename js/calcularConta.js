// calcularConta.js - Versão Corrigida
export function calcularValorComDesconto(cirurgias) {
    return cirurgias.map((cirurgia, index) => {
        let percentual = 1.0;
        if (index === 1) percentual = 0.7;  // 30% de desconto
        if (index >= 2) percentual = 0.5;   // 50% de desconto
        
        return {
            ...cirurgia,
            valorComDesconto: cirurgia.valor * percentual,
            percentualAplicado: Math.round(percentual * 100)
        };
    });
}

// Modifique a função para receber explicitamente o array
export function atualizarOrcamento(cirurgias) {
    const container = document.getElementById('cirurgias-selecionadas');
    const totalElement = document.getElementById('total-orcamento');
    
    if (!cirurgias || cirurgias.length === 0) {
        container.innerHTML = '<p class="nenhuma-selecionada">Nenhuma cirurgia selecionada ainda</p>';
        totalElement.textContent = 'R$ 0,00';
        return;
    }

    const cirurgiasComDesconto = calcularValorComDesconto(cirurgias);
    let total = 0;
    
    container.innerHTML = cirurgiasComDesconto.map((cirurgia, index) => {
        total += cirurgia.valorComDesconto;
        return `
            <div class="cirurgia-selecionada">
                <div>
                    <span>${cirurgia.nome}</span>
                    ${index > 0 ? `<span class="desconto-badge">-${100 - cirurgia.percentualAplicado}%</span>` : ''}
                </div>
                <div>
                    ${index > 0 ? `<span class="valor-original">R$ ${cirurgia.valor.toFixed(2).replace('.', ',')}</span>` : ''}
                    <span>R$ ${cirurgia.valorComDesconto.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        `;
    }).join('');
    
    totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}
export function configurarModal() {
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('modal-detalhes').style.display = 'none';
    });
    
    document.getElementById('modal-detalhes').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-detalhes')) {
            document.getElementById('modal-detalhes').style.display = 'none';
        }
    });
}

export function mostrarDetalhes(cirurgia) {
    if (!cirurgia) return;
    
    document.getElementById('modal-titulo').textContent = cirurgia.Nome || 'Nome não disponível';
    document.getElementById('modal-descricao').textContent = cirurgia.Descrição || 'Descrição não disponível';
    
    const incluiList = document.getElementById('modal-inclui');
    incluiList.innerHTML = cirurgia['O que inclui'] 
        ? cirurgia['O que inclui'].split(';').map(item => `<li>${item.trim()}</li>`).join('')
        : '<li>Informações não disponíveis</li>';
    
    const naoIncluiList = document.getElementById('modal-nao-inclui');
    naoIncluiList.innerHTML = cirurgia['O que não inclui']
        ? cirurgia['O que não inclui'].split(';').map(item => `<li>${item.trim()}</li>`).join('')
        : '<li>Informações não disponíveis</li>';
    
    document.getElementById('modal-internacao').textContent = cirurgia['Dias Internação'] || 'Não informado';
    document.getElementById('modal-valor').textContent = cirurgia.Valor 
        ? `R$ ${parseFloat(cirurgia.Valor).toFixed(2).replace('.', ',')}`
        : 'Valor não disponível';
    
    document.getElementById('modal-detalhes').style.display = 'flex';
}
export function gerarPDF(cirurgiasSelecionadas) {
    if (!cirurgiasSelecionadas || cirurgiasSelecionadas.length === 0) {
        alert('Por favor, selecione pelo menos uma cirurgia para gerar o orçamento.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text('Orçamento Cirúrgico', 105, 20, { align: 'center' });
    
    // Cirurgias com descontos (usa a função importada)
    const cirurgiasComDesconto = calcularValorComDesconto();
    let y = 50;
    
    cirurgiasComDesconto.forEach((cirurgia, index) => {
        doc.text(`${index + 1}. ${cirurgia.nome}`, 20, y);
        
        if (index > 0) {
            doc.setTextColor(150, 150, 150);
            doc.text(`(Original: R$ ${cirurgia.valor.toFixed(2).replace('.', ',')})`, 120, y);
            doc.setTextColor(0, 0, 0);
            doc.text(`-${100 - cirurgia.percentualAplicado}%`, 160, y);
        }
        
        doc.text(`R$ ${cirurgia.valorComDesconto.toFixed(2).replace('.', ',')}`, 180, y, { align: 'right' });
        y += 10;
    });
    
    // Total
    const total = cirurgiasComDesconto.reduce((sum, c) => sum + c.valorComDesconto, 0);
    doc.setFontSize(14);
    doc.text(`Total: R$ ${total.toFixed(2).replace('.', ',')}`, 180, y + 10, { align: 'right' });
    
    doc.save(`Orçamento Cirúrgico - ${new Date().toLocaleDateString('pt-BR')}.pdf`);
}
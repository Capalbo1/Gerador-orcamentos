export async function carregarDadosDasCirurgias() {
    const planilhaId = '1YOyMdU9ktclYtm7xB0vYyK0n_8zKB6MXfOYo-B5hDVw';
    const aba = 'Página1'; // Ou o nome da sua aba se for diferente
    
    try {
      const response = await fetch(`https://opensheet.elk.sh/${planilhaId}/${aba}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados');
      }
      const dados = await response.json();
      return dados;
    } catch (error) {
      console.error('Erro ao carregar dados da planilha:', error);
      return []; // Retorna array vazio em caso de erro
    }
  }
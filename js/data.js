// dados.js - Armazena todas as informações das cirurgias
export const cirurgiasData = {
    "parto-normal": {
        nome: "Parto Normal (feto único)",
        descricao: "Parto vaginal sem complicações, com acompanhamento médico e equipe de enfermagem.",
        valor: 3000,
        inclui: ["Acompanhamento médico", "Equipe de enfermagem", "Alojamento conjunto"],
        naoInclui: ["Exames prévios", "Medicamentos extras"],
        internacao: "2 dias"
    },
    "cesariana": {
        nome: "Parto Cesárea",
        descricao: "Parto cirúrgico realizado com anestesia.",
        valor: 3000,
        inclui: ["Procedimento cirúrgico", "Anestesia", "Equipe médica"],
        naoInclui: ["Exames pré-operatórios", "Medicamentos"],
        internacao: "3 dias"
    },
    // ... outras cirurgias
};

// Variáveis globais compartilhadas
export let cirurgiasSelecionadas = [];
export let totalOrcamento = 0;
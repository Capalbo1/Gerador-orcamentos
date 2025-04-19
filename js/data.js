// data.js - APENAS dados estáticos das cirurgias
export const cirurgiasData = {
    "parto-normal": {
        nome: "Parto Normal (feto único)",
        descricao: "Parto vaginal sem complicações...",
        valor: 3000,
        inclui: ["Acompanhamento médico", "Equipe de enfermagem"],
        naoInclui: ["Exames prévios"],
        internacao: "2 dias"
    },
    "cesariana": {
        nome: "Parto Cesárea",
        descricao: "Parto cirúrgico realizado com anestesia...",
        valor: 3000,
        inclui: ["Procedimento cirúrgico", "Anestesia"],
        naoInclui: ["Exames pré-operatórios"],
        internacao: "3 dias"
    }
    // ... outras cirurgias
};
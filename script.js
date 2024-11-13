document.getElementById("converter-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const valor = parseFloat(document.getElementById("valor").value);
    const moeda = document.getElementById("moeda").value;
    
    if (!valor || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }
    
    let url = '';
    let moedaDestino = '';
    let resultado = 0;

    if (moeda === "BRL") {
        // Cotação de BRL para USD
        url = `https://economia.awesomeapi.com.br/last/USD-BRL`;
        moedaDestino = "USD";
    } else {
        // Cotação de USD para BRL
        url = `https://economia.awesomeapi.com.br/last/BRL-USD`;
        moedaDestino = "BRL";
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let cotacao = moeda === "BRL" ? parseFloat(data.USDBRL.ask) : parseFloat(data.BRLUSD.ask);
            
            if (moeda === "BRL") {
                // Para conversão de BRL para USD, dividimos o valor pelo valor da cotação
                resultado = valor / cotacao;
            } else {
                resultado = valor / cotacao;
            }

            document.getElementById("resultado").innerHTML = `Resultado: ${resultado.toFixed(2)} ${moedaDestino}`;
        })
        .catch(error => {
            console.error("Erro ao obter a cotação:", error);
            alert("Erro ao obter a cotação. Tente novamente.");
        });
});

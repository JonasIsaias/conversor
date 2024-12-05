document.getElementById("converter-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const valor = parseFloat(document.getElementById("valor").value);
    const moeda = document.getElementById("moeda").value;

    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    let url = '';
    let moedaDestino = '';
    let valorConvertido = 0;

    // Função para construir URL
    function obterCotacaoUrl(origem, destino) {
        return `https://economia.awesomeapi.com.br/last/${origem}-${destino}`;
    }

    if (moeda === "BRL") {
        url = obterCotacaoUrl("USD", "BRL");
        moedaDestino = "USD";
    } else {
        url = obterCotacaoUrl("BRL", "USD");
        moedaDestino = "BRL";
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let cotacao = moeda === "BRL" ? parseFloat(data.USDBRL.ask) : parseFloat(data.BRLUSD.ask);
            
            if (isNaN(cotacao)) {
                alert("Erro na obtenção da cotação.");
                return;
            }

            if (moeda === "BRL") {
                valorConvertido = valor * cotacao;
            } else {
                valorConvertido = valor / cotacao;
            }

            if (isNaN(valorConvertido) || !isFinite(valorConvertido)) {
                alert("Erro na conversão. Tente novamente.");
                return;
            }

            document.getElementById("resultado").innerHTML = `Resultado: ${valorConvertido.toFixed(2)} ${moedaDestino}`;
        })
        .catch(error => {
            console.error("Erro ao obter a cotação:", error);
            alert("Houve um problema ao obter a cotação. Verifique sua conexão ou tente novamente mais tarde.");
        });
});

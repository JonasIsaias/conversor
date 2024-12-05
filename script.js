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

    // Função para construir a URL para a API de conversão de moedas
    function obterCotacaoUrl(origem, destino) {
        return `https://economia.awesomeapi.com.br/last/${origem}-${destino}`;
    }

    if (moeda === "BRL") {
        // Cotação de BRL para USD
        url = obterCotacaoUrl("USD", "BRL");
        moedaDestino = "USD";
    } else {
        // Cotação de USD para BRL
        url = obterCotacaoUrl("BRL", "USD");
        moedaDestino = "BRL";
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Verificar se a resposta contém as cotações corretas
            let cotacao;
            if (moeda === "BRL") {
                // Cotação de BRL para USD (USDBRL.ask)
                cotacao = parseFloat(data.USDBRL.ask);
            } else {
                // Cotação de USD para BRL (BRLUSD.ask)
                cotacao = parseFloat(data.BRLUSD.ask);
            }

            if (isNaN(cotacao)) {
                alert("Erro na obtenção da cotação.");
                return;
            }

            // Lógica de conversão:
            if (moeda === "BRL") {
                // Convertendo de BRL para USD
                valorConvertido = valor / cotacao;  // BRL ÷ cotação = USD
            } else {
                // Convertendo de USD para BRL
                valorConvertido = valor * cotacao;  // USD × cotação = BRL
            }

            if (isNaN(valorConvertido) || !isFinite(valorConvertido)) {
                alert("Erro na conversão. Tente novamente.");
                return;
            }

            // Formatação para exibir a moeda de destino corretamente
            const formatador = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: moedaDestino === 'BRL' ? 'BRL' : 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            document.getElementById("resultado").innerHTML = `Resultado: ${formatador.format(valorConvertido)}`;
        })
        .catch(error => {
            console.error("Erro ao obter a cotação:", error);
            alert("Houve um problema ao obter a cotação. Verifique sua conexão ou tente novamente mais tarde.");
        });
});

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

    // Função para construir URL de acordo com a moeda de origem e destino
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
            // Verifica as cotações corretas dependendo da direção da conversão
            let cotacao;
            if (moeda === "BRL") {
                // Cotação de BRL para USD: A chave é USDBRL.ask
                cotacao = parseFloat(data.USDBRL.ask); // BRL para USD
            } else {
                // Cotação de USD para BRL: A chave é BRLUSD.ask
                cotacao = parseFloat(data.BRLUSD.ask); // USD para BRL
            }

            if (isNaN(cotacao)) {
                alert("Erro na obtenção da cotação.");
                return;
            }

            // Cálculo da conversão
            if (moeda === "BRL") {
                // Convertendo de BRL para USD: Divide o valor em BRL pela cotação USD-BRL
                valorConvertido = valor / cotacao;
            } else {
                // Convertendo de USD para BRL: Multiplica o valor em USD pela cotação BRL-USD
                valorConvertido = valor * cotacao;
            }

            if (isNaN(valorConvertido) || !isFinite(valorConvertido)) {
                alert("Erro na conversão. Tente novamente.");
                return;
            }

            // Formatação dos valores com base na moeda destino
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

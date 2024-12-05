document.getElementById("converter-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const valor = parseFloat(document.getElementById("valor").value);
    const moeda = document.getElementById("moeda").value;

    // Verifica se o valor inserido é válido
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    let url = '';
    let moedaDestino = '';
    let valorConvertido = 0;

    // Função para obter a URL da API
    function obterCotacaoUrl(origem, destino) {
        return `https://economia.awesomeapi.com.br/last/${origem}-${destino}`;
    }

    // Define a URL de acordo com a moeda de origem
    if (moeda === "BRL") {
        // Cotação de BRL para USD
        url = obterCotacaoUrl("USD", "BRL");
        moedaDestino = "USD";
    } else {
        // Cotação de USD para BRL
        url = obterCotacaoUrl("BRL", "USD");
        moedaDestino = "BRL";
    }

    // Exibe a URL da API no console para verificar se está correta
    console.log("URL da API:", url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Resposta da API:", data); // Verifica os dados recebidos da API

            // Verificar se as cotações estão corretas
            let cotacao;
            if (moeda === "BRL") {
                cotacao = parseFloat(data.USDBRL.ask); // BRL para USD (cotação de 1 USD em BRL)
            } else {
                cotacao = parseFloat(data.BRLUSD.ask); // USD para BRL (cotação de 1 BRL em USD)
            }

            // Verifica se a cotação foi obtida corretamente
            if (isNaN(cotacao)) {
                alert("Erro ao obter a cotação.");
                return;
            }

            // Lógica de conversão com base na cotação
            if (moeda === "BRL") {
                // Convertendo de BRL para USD: valor / cotação
                valorConvertido = valor / cotacao;
            } else {
                // Convertendo de USD para BRL: valor * cotação
                valorConvertido = valor * cotacao;
            }

            // Verifica se o valor convertido é válido
            if (isNaN(valorConvertido) || !isFinite(valorConvertido)) {
                alert("Erro na conversão. Tente novamente.");
                return;
            }

            // Formatação para exibir o valor de acordo com a moeda de destino
            const formatador = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: moedaDestino === 'BRL' ? 'BRL' : 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Exibe o valor convertido na tela
            document.getElementById("resultado").innerHTML = `Resultado: ${formatador.format(valorConvertido)}`;
        })
        .catch(error => {
            console.error("Erro ao obter a cotação:", error);
            alert("Houve um problema ao obter a cotação. Verifique sua conexão ou tente novamente mais tarde.");
        });
});

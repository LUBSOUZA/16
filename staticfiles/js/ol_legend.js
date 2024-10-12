//LEGENDA
//LEGENDA
//LEGENDA
//LEGENDA
// Função para adicionar a legenda da camada selecionada
function addLegend(layerName, url_ows, layerTitle) {
    var legendUrl = `${url_ows}?service=WMS&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=${layerName}`;

    var legendDiv = document.getElementById('legendContent');

    // Verifica se a legenda já existe para essa camada e remove antes de adicionar
    var existingLegend = document.getElementById('legend_' + layerName);
    if (existingLegend) {
        legendDiv.removeChild(existingLegend);
    }

    // Cria uma nova entrada de legenda
    var legendEntry = document.createElement('div');
    legendEntry.id = 'legend_' + layerName; // Atribui um ID exclusivo baseado no nome da camada
    legendEntry.className = 'legend-entry';

    // Adiciona o título da camada acima da legenda
    var title = document.createElement('p');
    title.innerHTML = layerTitle; // Aqui adiciona o título da camada
    legendEntry.appendChild(title);

    // Adiciona a imagem da legenda
    var img = document.createElement('img');
    img.src = legendUrl;
    img.alt = `Legenda da camada ${layerName}`;
    legendEntry.appendChild(img);

    legendDiv.appendChild(legendEntry); // Adiciona a nova legenda
}

// Função para remover a legenda da camada desmarcada
function removeLegend(layerName) {
    var legendDiv = document.getElementById('legendContent');
    var legendEntry = document.getElementById('legend_' + layerName); // Busca a legenda associada à camada
    if (legendEntry) {
        legendDiv.removeChild(legendEntry); // Remove a legenda se existir
    }
}
// Função para abrir/fechar a caixa de legendas, verificando se há camadas visíveis
document.getElementById('legendToggleBtn').addEventListener('click', function() {
    var legendPopup = document.getElementById('legendPopup');

    // Verifica se há camadas visíveis antes de abrir a caixa de legendas
    let hasVisibleLayer = false;
    for (let layer in layersObj) {
        if (layersObj[layer].getVisible()) {
            hasVisibleLayer = true;
            break;
        }
    }

    if (!hasVisibleLayer) {
        alert('Nenhuma camada visível. Ative uma camada para ver a legenda.');
        return; // Interrompe a execução se não houver camadas visíveis
    }

    // Se houver camadas visíveis, permite a abertura/fechamento da caixa de legendas
    if (legendPopup.classList.contains('show')) {
        legendPopup.classList.remove('show');
        setTimeout(function() {
            legendPopup.style.display = 'none';
        }, 400); // Duração da transição de ocultação
    } else {
        legendPopup.style.display = 'block';
        setTimeout(function() {
            legendPopup.classList.add('show');
        }, 10); // Atraso pequeno para ativar a transição de opacidade
    }
});

// Listener para o botão de fechar dentro da caixa de legendas
document.getElementById('closeLegendBtn').addEventListener('click', function() {
    var legendPopup = document.getElementById('legendPopup');
    legendPopup.classList.remove('show');
    setTimeout(function() {
        legendPopup.style.display = 'none';
    }, 400); // Duração da transição de ocultação
});

//LEGENDA
//LEGENDA
//LEGENDA
//LEGENDA


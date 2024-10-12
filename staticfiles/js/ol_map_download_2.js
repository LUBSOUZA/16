//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD

var currentInfoOverlay = null;
var measureActive = false;  // Variável para rastrear se a medição está ativa

// Função para exibir o popup de informações com transição suave
function showInfoPopup(coordinate, content) {
    if (measureActive) {
        return;  // Se a medição estiver ativa, não exibe o popup
    }

    // Se já houver um popup visível, faz a transição de saída
    if (currentInfoOverlay) {
        currentInfoOverlay.classList.remove('show'); // Esconde o popup atual
        setTimeout(function() {
            currentInfoOverlay.style.display = 'none'; // Esconde completamente
            currentInfoOverlay.innerHTML = ''; // Limpa o conteúdo anterior

            // Define o novo conteúdo do popup
            currentInfoOverlay.innerHTML = content;

            currentInfoOverlay.style.display = 'block'; // Garante que o popup reapareça

            addCloseButtonToPopup();

            // Reaplica a transição suave para exibir o novo conteúdo
            setTimeout(function() {
                currentInfoOverlay.classList.add('show'); // Aplica a transição de entrada
            }, 10);
        }, 400); // 400ms de transição de ocultação
    } else {
        // Cria o popup de informações se não houver um ativo
        var infoPopup = document.createElement('div');
        infoPopup.id = 'infoPopup';
        infoPopup.classList.add('show');
        infoPopup.innerHTML = content;

        document.body.appendChild(infoPopup); // Adiciona ao body
        currentInfoOverlay = infoPopup; // Armazena a referência do popup atual

        setTimeout(function() {
            infoPopup.style.display = 'block';
            infoPopup.classList.add('show'); // Exibe com transição suave
        }, 10);
    }

    // Adiciona o botão de fechar corretamente
    addCloseButtonToPopup();
}

// Função para adicionar o botão de fechar ao popup de informações
function addCloseButtonToPopup() {
    if (currentInfoOverlay) {
        var closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';

        console.log(currentInfoOverlay.className); // Imprime as classes do elemento
        console.log(currentInfoOverlay.id);        // Imprime o ID do elemento

        closeButton.onclick = function () {
            currentInfoOverlay.classList.remove('show'); // Esconde suavemente
            setTimeout(function() {
                currentInfoOverlay.style.display = 'none'; // Oculta
                currentInfoOverlay = null; // Reseta a referência
            }, 400); // Tempo de transição de ocultação
        };

        // Remove o botão de fechar existente, se houver, e adiciona o novo
        var existingCloseButton = currentInfoOverlay.querySelector('.close-button');
        if (existingCloseButton) {
            currentInfoOverlay.removeChild(existingCloseButton);
        }
        currentInfoOverlay.appendChild(closeButton);
    }
}

// Função para capturar cliques no mapa e mostrar informações
// Função para capturar cliques no mapa e mostrar informações
function handleGeometryClick(event) {
    if (measureActive) return;  // Não processa cliques se a medição estiver ativa

    closeDownloadBox();  // Fecha a caixa de download

    var viewResolution = mapView.getResolution();
    var coordinate = event.coordinate;
    var infoContent = '';
    var selectedLayer = document.querySelector('.layer-switcher input[name="extraLayer"]:checked');

    if (selectedLayer) {
        var layerName = selectedLayer.value;
        var layer = layersObj[layerName];

        if (layer) {
            var url_ows = selectedurl_ows; // Captura a URL correta
            console.log(url_ows);

            // Verificar se o workspace da camada é 'dsview'
            if (layerName.startsWith('dsview')) {
                // Executa o segundo trecho de código que usa o Django
                var url = layer.getSource().getFeatureInfoUrl(
                    coordinate,
                    viewResolution,
                    'EPSG:3857',
                    {'INFO_FORMAT': 'application/json'}
                );

                if (url) {
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.features && data.features.length > 0) {
                                data.features.forEach(function(feature) {
                                    var properties = feature.properties;
                                    infoContent += `<h4>Informações da Geometria</h4>`;
                                    for (var key in properties) {
                                        if (properties[key] !== null) {
                                            infoContent += `<p><strong>${key}:</strong> ${properties[key]}</p>`;
                                        }
                                    }

                                    // Adicionar link de download usando a view do Django
                                    var featureId = feature.id.split('.').pop(); // Extrai o ID da geometria
                                    var downloadLink = `/wri/shapefiles/download/${layerName}/${featureId}/`;
                                    infoContent += `<p><a href="${downloadLink}" target="_blank" style="color: yellow; font-weight: bold; text-decoration: none;">Download Shapefile</a></p>`;

                                    showInfoPopup(coordinate, infoContent); // Mostra o popup
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao obter informações da geometria:', error);
                        });
                }
            } else {
                // Executa o código padrão para usar o GeoServer WFS
                var url = layer.getSource().getFeatureInfoUrl(
                    coordinate,
                    viewResolution,
                    'EPSG:3857',
                    {'INFO_FORMAT': 'application/json'}
                );
                console.log(url);

                if (url) {
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.features && data.features.length > 0) {
                                data.features.forEach(function(feature) {
                                    var properties = feature.properties;
                                    infoContent += `<h4>Informações da Geometria</h4>`;
                                    for (var key in properties) {
                                        if (properties[key] !== null) {
                                            infoContent += `<p><strong>${key}:</strong> ${properties[key]}</p>`;
                                        }
                                    }

                                    // Adicionar links de download do GeoServer para WFS
                                    var wfsFormats = [
                                        {name: 'CSV', format: 'csv'},
                                        {name: 'GML2', format: 'gml2'},
                                        {name: 'GML3.1', format: 'gml3'},
                                        {name: 'GML3.2', format: 'gml32'},
                                        {name: 'GeoJSON', format: 'json'},
                                        {name: 'GeoPackage', format: 'geopackage'},
                                        {name: 'KML', format: 'kml'},
                                        {name: 'Shapefile', format: 'SHAPE-ZIP'}
                                    ];

                                    infoContent += `<div class="download-container">`;
                                    wfsFormats.forEach(function(format) {
                                        infoContent += `<a href="#" onclick="downloadGeometryWFS_ById('${layerName}', '${format.format}', '${feature.id}', '${url_ows}', true)" class="download-link">${format.name}</a>`;
                                    });
                                    infoContent += `</div>`;
                                    showInfoPopup(coordinate, infoContent);
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao obter informações da geometria:', error);
                        });
                }
            }
        }
    }

    if (infoContent === '') {
        return;
    }
}

//// Função para realizar o download dos dados específicos de uma geometria em WFS com base no ID
//function downloadGeometryWFS_ById(layerName, format, featureId, url_ows) {
//    var encodedLayerName = encodeURIComponent(layerName);
//    var baseUrl = `${url_ows}?service=WFS&version=2.0.0&request=GetFeature`;
//    var typeNameParam = `&typeName=${encodedLayerName}`;
//    var formatParam = `&outputFormat=${format}`;
//    var featureIdParam = `&featureId=${featureId}`;
//    var downloadLink = `${baseUrl}${typeNameParam}${formatParam}${featureIdParam}`;
//    window.open(downloadLink, '_blank');
//}
// Função para realizar o download dos dados específicos de uma geometria em WFS com base no ID e renomear o arquivo
function downloadGeometryWFS_ById(layerName, format, featureId, url_ows, rename = true) {
    var encodedLayerName = encodeURIComponent(layerName);
    var baseUrl = `${url_ows}?service=WFS&version=2.0.0&request=GetFeature`;
    var typeNameParam = `&typeName=${encodedLayerName}`;
    var formatParam = `&outputFormat=${format}`;
    var featureIdParam = `&featureId=${featureId}`;

    // Monta o link inicial de download
    var downloadLink = `${baseUrl}${typeNameParam}${formatParam}${featureIdParam}`;
  console.log(downloadLink);

    // Se for necessário renomear o arquivo
    if (rename) {
        // Determina a extensão do arquivo com base no formato
        var fileExtension = format === 'SHAPE-ZIP' ? 'zip' : format.split('/').pop();
        // Gera o nome do arquivo baseado no layerName e featureId
        var fileName = `${layerName}_${featureId}.${fileExtension}`;
        // Adiciona os parâmetros para renomear o arquivo no download
        downloadLink += `&rename=true&filename=${fileName}`;
    }

    // Abre o link em uma nova aba para realizar o download
    window.open(downloadLink, '_blank');
}
// Event listener para fechar o infoPopup ao mudar o SourceList
document.getElementById('sourceSelect').addEventListener('change', function() {
    if (currentInfoOverlay) {
        // Remove o popup de informações ao mudar a seleção
        currentInfoOverlay.classList.remove('show');
        setTimeout(function() {
            currentInfoOverlay.style.display = 'none';
            currentInfoOverlay = null; // Limpa a referência
        }, 400); // Tempo da transição de ocultação
    }
});

// Função para fechar a caixa de download
function closeDownloadBox() {
    downloadBox.classList.remove('show');
    setTimeout(function() {
        downloadBox.style.display = 'none';
    }, 400);
}



// Função para fechar o infoPopup
function closeInfoPopup() {
    if (currentInfoOverlay) {
        currentInfoOverlay.classList.remove('show');
        setTimeout(function() {
            currentInfoOverlay.style.display = 'none';
            currentInfoOverlay = null; // Limpa a referência
        }, 400); // Tempo da transição de ocultação
    }
}

// Fechar o infoPopup ao alterar o Source List
document.getElementById('sourceSelect').addEventListener('change', closeInfoPopup);

// Fechar o infoPopup ao clicar no Source List (abrir a lista suspensa)
document.getElementById('sourceSelect').addEventListener('click', closeInfoPopup);

// Fechar o infoPopup ao trocar camadas base
document.querySelectorAll('.layer-switcher input[name="baseLayer"]').forEach(function(input) {
    input.addEventListener('change', closeInfoPopup);
});

// Fechar o infoPopup ao trocar camadas temáticas
document.querySelectorAll('.layer-switcher input[name="extraLayer"]').forEach(function(input) {
    input.addEventListener('change', closeInfoPopup);
});

// Fechar o infoPopup ao clicar no botão de troca de camadas base
document.getElementById('baseLayerToggleBtn').addEventListener('click', closeInfoPopup);

// Fechar o infoPopup ao clicar no botão de troca de camadas temáticas
document.getElementById('extraLayerToggleBtn').addEventListener('click', closeInfoPopup);

//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD
//POPUP DE DOWNLOAD
// Função para realizar o download dos dados específicos de uma geometria em WFS
//function downloadGeometryWFS(layerName, format, featureId, rename) {
//    var downloadLink = `https://geoinfo.dados.embrapa.br/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=${layerName}&featureid=${featureId}&outputFormat=${format}`;
//    if (rename) {
//        var fileExtension = format === 'SHAPE-ZIP' ? 'zip' : format.split('/').pop();
//        var fileName = `${layerName}_${featureId}.${fileExtension}`;
//        downloadLink += `&rename=true&filename=${fileName}`;
//    }
//    window.open(downloadLink, '_blank');
//}

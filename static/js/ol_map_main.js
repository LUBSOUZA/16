// Função para popular o select com as fontes de dados
function populateSourceSelect() {
    const sourceSelect = document.getElementById('sourceSelect');
    for (let source in layerSources) {
        const option = document.createElement('option');
        option.value = source;
        option.text = source;
        sourceSelect.appendChild(option);
    }
}
populateSourceSelect();

// Formatos para download via WFS
var wfsFormats = [
    { name: 'Shapefile', format: 'SHAPE-ZIP' },
    { name: 'CSV', format: 'csv' },
    { name: 'GeoJSON', format: 'json' },
    { name: 'GML2', format: 'gml2' },
    { name: 'GML3.1', format: 'gml3' },
    { name: 'GML3.2', format: 'gml32' },
    { name: 'GeoPackage', format: 'geopackage' },
    { name: 'KML', format: 'kml' }
];

var layersObj = {};
function createLayersAndDownloadBox(source) {
    var url_ows = layerSources[source].url;
    var layersList = layerSources[source].layers;

    layersList.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });

    var layerSwitcherDiv = document.getElementById('extraLayerSwitcher');
    layerSwitcherDiv.innerHTML = '';

    // Adiciona o campo de busca
    const layerSearchInput = document.createElement('input');
    layerSearchInput.id = 'layerSearchInput';
    layerSearchInput.type = 'text';
    layerSearchInput.placeholder = 'Buscar camada...';
    layerSearchInput.style.marginBottom = '10px';
    layerSwitcherDiv.appendChild(layerSearchInput);
    layerSearchInput.addEventListener('keyup', filterLayers);

    // Adiciona o botão de "Remover Todas" ao topo do extraLayerSwitcher
    var clearAllLayersButton = document.createElement('button');
    clearAllLayersButton.id = 'clearAllLayers';
    clearAllLayersButton.innerHTML = 'Remover Todas';
    clearAllLayersButton.className = 'btn-remover-extra-layer';
    clearAllLayersButton.style.marginBottom = '10px';
    layerSwitcherDiv.appendChild(clearAllLayersButton);

    // Listener para o botão de remover todas as camadas selecionadas
    clearAllLayersButton.addEventListener('click', removeAllLayers);

    // Itera sobre as camadas e cria os controles de seleção
    for (var i = 0; i < layersList.length; i++) {

        var layerName = layersList[i].layerName;
        var layerTitle = layersList[i].name; // Captura o título da camada
        console.log(layerName, "|", layerTitle);

        // Se o layerTitle ou layerName estiver vazio, não adiciona a camada
        if (!layerTitle || !layerName) {
            continue; // Ignora camadas sem nome ou layerName vazio
        }

        // Cria o container para a camada
        var layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        layerItem.style.display = 'flex';
        layerItem.style.alignItems = 'center';
        layerItem.style.marginBottom = '10px'; // Espaçamento entre os itens

        // Cria o label com o checkbox
        var label = document.createElement('label');
        label.style.flex = '1'; // O label ocupará todo o espaço disponível

        // Checkbox para ativar/desativar a camada
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'extraLayer';
        checkbox.value = layerName;

        // Verifica se a camada já está visível no mapa e ajusta o checkbox
        if (layersObj[layerName] && layersObj[layerName].getVisible()) {
            checkbox.checked = true; // Marca o checkbox se a camada estiver visível
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + layerTitle));

        layerItem.appendChild(label);

        // Cria o ícone de três pontinhos
        var threeDots = document.createElement('span');
        threeDots.className = 'three-dots';
        threeDots.innerHTML = '...';
        threeDots.style.cursor = 'pointer';
        threeDots.style.padding = '0 10px';
        threeDots.style.fontSize = '18px';
        layerItem.appendChild(threeDots);

        // Evento para abrir a caixa de download ao clicar nos três pontinhos
        threeDots.addEventListener('click', (function (layerName, layerTitle) {
            return function(event) {
                event.stopPropagation();
                updateDownloadBoxWithTransition(layerName, layerTitle, wfsFormats, url_ows);  // Atualiza a caixa de download com a URL da fonte selecionada
            };
        })(layerName, layerTitle));

        // Adiciona o item de camada ao div do layer switcher
        layerSwitcherDiv.appendChild(layerItem);

        // Verifica se a camada já existe no layersObj, se não, cria
        if (!layersObj[layerName]) {
            // Cria a camada WMS e armazena no objeto layersObj
            var layer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: url_ows,
                    params: { 'LAYERS': layerName, 'TILED': true },
                    serverType: 'geoserver',
                }),
                visible: false,
                title: layerName
            });
            layersObj[layerName] = layer;

            // Adiciona a camada ao mapa
            olMap.getLayers().push(layer);
        }

        checkbox.addEventListener('change', (function(layerName, layerTitle) {
            return function () {
                if (this.checked) {
                    // Se a camada não existe mais no layersObj (foi removida após o reset)
                    if (!layersObj[layerName]) {
                        // Recria a camada WMS e adiciona ao mapa
                        var layer = new ol.layer.Tile({
                            source: new ol.source.TileWMS({
                                url: url_ows,  // URL WMS correta
                                params: { 'LAYERS': layerName, 'TILED': true },
                                serverType: 'geoserver',
                            }),
                            visible: true,
                            title: layerName
                        });
                        layersObj[layerName] = layer;  // Armazena a nova camada no layersObj
                        olMap.addLayer(layer);  // Adiciona a camada ao mapa
                    } else {
                        // Se a camada já existe, torna-a visível
                        layersObj[layerName].setVisible(true);
                    }

                    // Atualiza o selectedLayerName e selectedUrlOws com base na camada selecionada
                    selectedLayerName = layerName;  // Define a camada atual como a selecionada
                    selectedurl_ows = url_ows;  // Atualiza a URL do WMS da camada selecionada

                    // Chama a função para obter os atributos da camada e popular a caixa de filtros
                    //getLayerAttributes(layerName, url_ows);
                  console.log(url_ows);

                    // Adiciona a legenda da camada
                    addLegend(layerName, url_ows, layerTitle);  // Passa o título correto da camada
                } else {
                    // Se o checkbox for desmarcado, remove a camada e a legenda
                    if (layersObj[layerName]) {
                        layersObj[layerName].setVisible(false);  // Torna a camada invisível
                    }
                    removeLegend(layerName);  // Remove a legenda
                    checkActiveLayersAndCloseLegend();
                }
            };
        })(layerName, layerTitle));  // Passa layerName e layerTitle para o closure
    }
}

// Função para criar a camada filtrada usando WFS
function createFilteredLayer(url_ows, layerName, filter) {
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),  // Usando o formato WFS
            url: function () {
                let cqlFilter = filter ? `&CQL_FILTER=${encodeURIComponent(filter)}` : ''; // Adiciona o filtro CQL se houver e o codifica
                let fullUrl = `${url_ows}?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}` +
                    `&outputFormat=application/json&srsname=EPSG:3857` + cqlFilter;

                console.log("WFS URL com Filtro:", fullUrl); // Verifique a URL gerada
                return fullUrl;
            },
            strategy: ol.loadingstrategy.bbox  // Carrega os dados por blocos (bbox)
        }),
        visible: true,  // Marca como visível automaticamente
        title: layerName
    });

    // Adiciona evento para verificar se os dados foram carregados corretamente
    layer.getSource().on('featuresloadend', function(evt) {
        console.log('Camada carregada com sucesso:', evt);
        if (evt.features.length === 0) {
            console.warn('Nenhuma feição carregada com o filtro fornecido.');
        } else {
            console.log('Número de feições carregadas:', evt.features.length);
        }
    });

    return layer;
}

// Função para obter os atributos dinâmicos de uma camada
//function getLayerAttributes(layerName, url_ows) {
//    var describeFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${layerName}`;
//
//    // Faz a requisição para obter os atributos da camada
//    fetch(describeFeatureUrl)
//        .then(response => response.text())
//        .then(data => {
//            // Parse da resposta XML para extrair os atributos
//            var parser = new DOMParser();
//            var xmlDoc = parser.parseFromString(data, 'text/xml');
//            var elements = xmlDoc.getElementsByTagName('xsd:element');
//            var attributes = [];
//
//            // Coleta os nomes dos atributos
//            for (var i = 0; i < elements.length; i++) {
//                var attributeName = elements[i].getAttribute('name');
//                attributes.push(attributeName);
//            }
//
//            // Agora vamos popular os dropdowns com base nos atributos
//            populateFilterDropdowns(attributes, layerName, url_ows);
//        });
//}

  //function getLayerAttributes(layerName, url_ows) {
  //    var describeFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${layerName}`;
  //
  //    // Faz a requisição para obter os atributos da camada
  //    fetch(describeFeatureUrl)
  //        .then(response => {
  //            // Detecta o tipo de conteúdo retornado pela API
  //            const contentType = response.headers.get('content-type');
  //            
  //            if (contentType.includes('application/json')) {
  //                // Se for JSON, retorna como JSON
  //                return response.json();
  //            } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
  //                // Se for XML, retorna como texto para fazer o parsing
  //                return response.text();
  //            } else {
  //                // Se for outro formato, retorna como texto bruto
  //                return response.text();
  //            }
  //        })
  //        .then(data => {
  //            const contentType = data instanceof Object ? 'json' : 'xml_or_text';
  //
  //            if (contentType === 'json') {
  //                // Caso seja JSON, você pode tratar diretamente
  //                console.log('Resposta JSON recebida:', data);
  //                // Realiza a operação necessária com o JSON
  //                handleJSONResponse(data);
  //
  //            } else {
  //                // Caso seja XML ou outro tipo de texto, faz o parse do XML
  //                console.log('Resposta XML ou texto recebida:', data);
  //                
  //                var parser = new DOMParser();
  //                var xmlDoc = parser.parseFromString(data, 'text/xml');
  //                var elements = xmlDoc.getElementsByTagName('xsd:element');
  //                var attributes = [];
  //
  //                // Coleta os nomes dos atributos no caso de XML
  //                for (var i = 0; i < elements.length; i++) {
  //                    var attributeName = elements[i].getAttribute('name');
  //                    attributes.push(attributeName);
  //                }
  //
  //                // Popula os dropdowns com os atributos coletados
  //                populateFilterDropdowns(attributes, layerName, url_ows);
  //            }
  //        })
  //        .catch(error => {
  //            console.error('Erro ao obter os atributos:', error);
  //        });
  //}
  //
  //function handleJSONResponse(jsonData) {
  //    // Exemplo de como processar os dados JSON
  //    // Aqui você pode realizar qualquer manipulação necessária no JSON
  //    console.log('Processando dados JSON:', jsonData);
  //    // Você pode extrair os dados que precisa e usá-los conforme necessário
  //}

//function getLayerAttributes(layerName, url_ows) {
//    var describeFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${layerName}`;
//
//    // Faz a requisição para obter os atributos da camada
//    fetch(describeFeatureUrl)
//        .then(response => {
//            // Detecta o tipo de conteúdo retornado pela API
//            const contentType = response.headers.get('content-type');
//            
//            // Verifica se o conteúdo é JSON
//            if (contentType && contentType.includes('application/json')) {
//                return response.json();  // Trata como JSON
//            } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
//                return response.text();  // Trata como texto XML
//            } else {
//                return response.text();  // Trata como texto padrão
//            }
//        })
//        .then(data => {
//            const contentType = typeof data === 'object' ? 'json' : 'xml_or_text';
//
//            if (contentType === 'json') {
//                // Caso seja JSON, você pode tratar diretamente
//                console.log('Resposta JSON recebida:', data);
//                handleJSONResponse(data);
//
//            } else {
//                // Caso seja XML ou outro tipo de texto, faz o parse do XML
//                console.log('Resposta XML ou texto recebida:', data);
//
//                var parser = new DOMParser();
//                var xmlDoc = parser.parseFromString(data, 'text/xml');
//                var elements = xmlDoc.getElementsByTagName('xsd:element');
//                var attributes = [];
//
//                // Coleta os nomes dos atributos no caso de XML
//                for (var i = 0; i < elements.length; i++) {
//                    var attributeName = elements[i].getAttribute('name');
//                    attributes.push(attributeName);
//                }
//
//                // Popula os dropdowns com os atributos coletados
//                populateFilterDropdowns(attributes, layerName, url_ows);
//            }
//        })
//        .catch(error => {
//            console.error('Erro ao obter os atributos:', error);
//        });
//}
//
//function handleJSONResponse(jsonData) {
//    // Exemplo de como processar os dados JSON
//    console.log('Processando dados JSON:', jsonData);
//    // Você pode extrair os dados que precisa e usá-los conforme necessário
//}
//var cachedAttributes = {};  // Armazena os atributos carregados no cache
//
//function getLayerAttributes(layerName, url_ows) {
//    // Verifica se os atributos já estão no cache
//    if (cachedAttributes[layerName]) {
//        console.log('Atributos carregados do cache para:', layerName);
//        populateFilterDropdowns(cachedAttributes[layerName], layerName, url_ows);
//        return;  // Não faz uma nova requisição se os atributos já estão no cache
//    }
//
//    var describeFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${layerName}`;
//
//    // Faz a requisição para obter os atributos da camada
//    fetch(describeFeatureUrl)
//        .then(response => {
//            // Detecta o tipo de conteúdo retornado pela API
//            const contentType = response.headers.get('content-type');
//            
//            // Verifica se o conteúdo é JSON
//            if (contentType && contentType.includes('application/json')) {
//                return response.json();  // Trata como JSON
//            } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
//                return response.text();  // Trata como texto XML
//            } else {
//                return response.text();  // Trata como texto padrão
//            }
//        })
//        .then(data => {
//            const contentType = typeof data === 'object' ? 'json' : 'xml_or_text';
//
//            if (contentType === 'json') {
//                // Caso seja JSON, você pode tratar diretamente
//                console.log('Resposta JSON recebida:', data);
//                handleJSONResponse(data);
//
//            } else {
//                // Caso seja XML ou outro tipo de texto, faz o parse do XML
//                console.log('Resposta XML ou texto recebida:', data);
//
//                var parser = new DOMParser();
//                var xmlDoc = parser.parseFromString(data, 'text/xml');
//                var elements = xmlDoc.getElementsByTagName('xsd:element');
//                var attributes = [];
//
//                // Coleta os nomes dos atributos no caso de XML
//                for (var i = 0; i < elements.length; i++) {
//                    var attributeName = elements[i].getAttribute('name');
//                    attributes.push(attributeName);
//                }
//
//                // Armazena os atributos no cache
//                cachedAttributes[layerName] = attributes;
//
//                // Popula os dropdowns com os atributos coletados
//                populateFilterDropdowns(attributes, layerName, url_ows);
//            }
//        })
//        .catch(error => {
//            console.error('Erro ao obter os atributos:', error);
//        });
//}
//
//function handleJSONResponse(jsonData) {
//    // Exemplo de como processar os dados JSON
//    console.log('Processando dados JSON:', jsonData);
//    // Você pode extrair os dados que precisa e usá-los conforme necessário
//}
//
//
//
//
//// Função para popular os dropdowns de filtro com base nos atributos
//function populateFilterDropdowns(attributes, layerName, url_ows) {
//    var dynamicFiltersDiv = document.getElementById('dynamicFilters');
//    dynamicFiltersDiv.innerHTML = ''; // Limpa os filtros anteriores
//
//    attributes.forEach(attribute => {
//        var filterDiv = document.createElement('div');
//        filterDiv.className = 'filter-group';
//
//        // Cria um label para o filtro
//        var label = document.createElement('label');
//        label.innerHTML = `Filtrar por ${attribute}:`;
//        label.setAttribute('for', `filter-${attribute}`);
//        filterDiv.appendChild(label);
//
//        // Cria um dropdown para os valores do atributo
//        var select = document.createElement('select');
//        select.id = `filter-${attribute}`;
//        var optionAll = document.createElement('option');
//        optionAll.value = '';
//        optionAll.innerHTML = 'Todos'; // Opção de selecionar todos
//        select.appendChild(optionAll); // Adiciona a opção de "Todos" ao dropdown
//
//        filterDiv.appendChild(select);
//
//        // Busca os valores únicos para o atributo e popula o dropdown
//        getUniqueValuesForAttribute(layerName, attribute, select, url_ows);
//
//        dynamicFiltersDiv.appendChild(filterDiv);
//    });
//}
//
// Função para buscar valores únicos para um atributo e popular o dropdown
//function getUniqueValuesForAttribute(layerName, attribute, selectElement, url_ows) {
//    var getFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${attribute}&outputFormat=application/json`;
//
//    // Faz a requisição para buscar os valores únicos
//    fetch(getFeatureUrl)
//        .then(response => response.json())
//        .then(data => {
//            var valuesSet = new Set();
//
//            // Coleta os valores únicos
//            data.features.forEach(feature => {
//                var value = feature.properties[attribute];
//                if (value) valuesSet.add(value);
//            });
//
//            // Adiciona as opções ao dropdown
//            valuesSet.forEach(value => {
//                var option = document.createElement('option');
//                option.value = value;
//                option.innerHTML = value;
//                selectElement.appendChild(option);
//            });
//        });
//}



//// Objeto para armazenar o cache
//var cache = {};
//
//// Função para buscar valores únicos para um atributo e popular o dropdown
//function getUniqueValuesForAttribute(layerName, attribute, selectElement, url_ows) {
//    // Chave única para armazenar no cache, baseada na camada e no atributo
//    var cacheKey = `${layerName}_${attribute}`;
//
//    // Verifica se o cache já tem os dados para essa camada e atributo
//    if (cache[cacheKey]) {
//        console.log('Usando valores do cache para:', cacheKey);
//        populateDropdownFromCache(cache[cacheKey], selectElement);
//        return; // Se os dados estão no cache, não faz nova requisição
//    }
//
//    // URL para buscar os valores únicos
//    var getFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${attribute}&outputFormat=application/json`;
//
//    // Faz a requisição para buscar os valores únicos
//    fetch(getFeatureUrl)
//        .then(response => {
//            // Verifica o tipo de conteúdo para garantir que estamos lidando com JSON ou XML
//            const contentType = response.headers.get('content-type');
//            if (contentType && contentType.includes('application/json')) {
//                return response.json(); // Se for JSON, processa como JSON
//            } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
//                return response.text(); // Se for XML, processa como texto
//            } else {
//                throw new Error('Formato de resposta não suportado. Esperado JSON ou XML.');
//            }
//        })
//        .then(data => {
//            let valuesSet = new Set();
//
//            if (typeof data === 'object') {
//                // Se a resposta é JSON, processa os valores normalmente
//                console.log('Resposta JSON recebida:', data);
//                if (data.features && data.features.length > 0) {
//                    data.features.forEach(feature => {
//                        var value = feature.properties[attribute];
//                        if (value) {
//                            valuesSet.add(value);
//                        }
//                    });
//                } else {
//                    console.error('Nenhum dado de features disponível na resposta JSON.');
//                }
//            } else {
//                // Se a resposta é XML, faz o parsing e coleta os valores
//                console.log('Resposta XML recebida:', data);
//
//                var parser = new DOMParser();
//                var xmlDoc = parser.parseFromString(data, 'text/xml');
//                var featureMembers = xmlDoc.getElementsByTagName('gml:featureMember');
//
//                // Itera sobre os membros de features no XML
//                for (var i = 0; i < featureMembers.length; i++) {
//                    var feature = featureMembers[i].getElementsByTagName(attribute)[0];
//                    if (feature && feature.textContent) {
//                        valuesSet.add(feature.textContent);
//                    }
//                }
//            }
//
//            // Converte o Set para um array para armazenar no cache
//            var valuesArray = Array.from(valuesSet);
//
//            // Armazena os valores no cache
//            cache[cacheKey] = valuesArray;
//
//            // Popula os dropdowns com os valores
//            populateDropdownFromCache(valuesArray, selectElement);
//        })
//        .catch(error => {
//            console.error('Erro ao buscar valores únicos:', error);
//        });
//}
//
//// Função para popular o dropdown a partir do cache ou de uma nova requisição
//function populateDropdownFromCache(valuesArray, selectElement) {
//    // Limpa o selectElement antes de adicionar novos valores
//    selectElement.innerHTML = '';
//
//    // Adiciona os valores únicos ao dropdown
//    valuesArray.forEach(value => {
//        var option = document.createElement('option');
//        option.value = value;
//        option.innerHTML = value;
//        selectElement.appendChild(option);
//    });
//}
//



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var cachedAttributes = {};  // Armazena os atributos carregados no cache

function getLayerAttributes(layerName, url_ows) {
    // Verifica se os atributos já estão no cache
    if (cachedAttributes[layerName]) {
        console.log('Atributos carregados do cache para:', layerName);
        populateFilterDropdowns(cachedAttributes[layerName], layerName, url_ows);
        return;  // Não faz uma nova requisição se os atributos já estão no cache
    }

    var describeFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${layerName}`;

    // Faz a requisição para obter os atributos da camada
    fetch(describeFeatureUrl)
        .then(response => {
            // Detecta o tipo de conteúdo retornado pela API
            const contentType = response.headers.get('content-type');
            
            // Verifica se o conteúdo é JSON
            if (contentType && contentType.includes('application/json')) {
                return response.json();  // Trata como JSON
            } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
                return response.text();  // Trata como texto XML
            } else {
                return response.text();  // Trata como texto padrão
            }
        })
        .then(data => {
            const contentType = typeof data === 'object' ? 'json' : 'xml_or_text';

            if (contentType === 'json') {
                // Caso seja JSON, você pode tratar diretamente
                console.log('Resposta JSON recebida:', data);
                handleJSONResponse(data);

            } else {
                // Caso seja XML ou outro tipo de texto, faz o parse do XML
                console.log('Resposta XML ou texto recebida:', data);

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, 'text/xml');
                var elements = xmlDoc.getElementsByTagName('xsd:element');
                var attributes = [];

                // Coleta os nomes dos atributos no caso de XML
                for (var i = 0; i < elements.length; i++) {
                    var attributeName = elements[i].getAttribute('name');
                    attributes.push(attributeName);
                }

                // Armazena os atributos no cache
                cachedAttributes[layerName] = attributes;

                // Popula os dropdowns com os atributos coletados
                populateFilterDropdowns(attributes, layerName, url_ows);
            }
        })
        .catch(error => {
            console.error('Erro ao obter os atributos:', error);
        });
}

function handleJSONResponse(jsonData) {
    // Exemplo de como processar os dados JSON
    console.log('Processando dados JSON:', jsonData);
    // Você pode extrair os dados que precisa e usá-los conforme necessário
}




// Função para popular os dropdowns de filtro com base nos atributos
function populateFilterDropdowns(attributes, layerName, url_ows) {
    var dynamicFiltersDiv = document.getElementById('dynamicFilters');
    dynamicFiltersDiv.innerHTML = ''; // Limpa os filtros anteriores

    attributes.forEach(attribute => {
        var filterDiv = document.createElement('div');
        filterDiv.className = 'filter-group';

        // Cria um label para o filtro
        var label = document.createElement('label');
        label.innerHTML = `Filtrar por ${attribute}:`;
        label.setAttribute('for', `filter-${attribute}`);
        filterDiv.appendChild(label);

        // Cria um dropdown para os valores do atributo
        var select = document.createElement('select');
        select.id = `filter-${attribute}`;
        var optionAll = document.createElement('option');
        optionAll.value = '';
        optionAll.innerHTML = 'Todos'; // Opção de selecionar todos
        select.appendChild(optionAll); // Adiciona a opção de "Todos" ao dropdown

        filterDiv.appendChild(select);

        // Busca os valores únicos para o atributo e popula o dropdown
        getUniqueValuesForAttribute(layerName, attribute, select, url_ows);

        dynamicFiltersDiv.appendChild(filterDiv);
    });
    // Log quando terminar de popular todos os filtros
    console.log(`População de filtros concluída para a camada ${layerName} com ${attributes.length} atributos.`);
}

// Objeto para armazenar o cache
var cache = {};

// Função para buscar valores únicos para um atributo e popular o dropdown
function getUniqueValuesForAttribute(layerName, attribute, selectElement, url_ows) {
    // Chave única para armazenar no cache, baseada na camada e no atributo
    var cacheKey = `${layerName}_${attribute}`;

    // Verifica se o cache já tem os dados para essa camada e atributo
    if (cache[cacheKey]) {
        console.log('Usando valores do cache para:', cacheKey);
        populateDropdownFromCache(cache[cacheKey], selectElement);
        return; // Se os dados estão no cache, não faz nova requisição
    }

    // URL para buscar os valores únicos
    var getFeatureUrl = `${url_ows}?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${attribute}&outputFormat=application/json`;

    // Faz a requisição para buscar os valores únicos
    fetch(getFeatureUrl)
        .then(response => {
            // Verifica o tipo de conteúdo para garantir que estamos lidando com JSON ou XML
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Se for JSON, processa como JSON
            } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
                return response.text(); // Se for XML, processa como texto
            } else {
                throw new Error('Formato de resposta não suportado. Esperado JSON ou XML.');
            }
        })
        .then(data => {
            let valuesSet = new Set();

            if (typeof data === 'object') {
                // Se a resposta é JSON, processa os valores normalmente
                console.log('Resposta JSON recebida:', data);
                if (data.features && data.features.length > 0) {
                    data.features.forEach(feature => {
                        var value = feature.properties[attribute];
                        if (value) {
                            valuesSet.add(value);
                        }
                    });
                } else {
                    console.error('Nenhum dado de features disponível na resposta JSON.');
                }
            } else {
                // Se a resposta é XML, faz o parsing e coleta os valores
                console.log('Resposta XML recebida:', data);

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, 'text/xml');
                var featureMembers = xmlDoc.getElementsByTagName('gml:featureMember');

                // Itera sobre os membros de features no XML
                for (var i = 0; i < featureMembers.length; i++) {
                    var feature = featureMembers[i].getElementsByTagName(attribute)[0];
                    if (feature && feature.textContent) {
                        valuesSet.add(feature.textContent);
                    }
                }
            }

            // Converte o Set para um array para armazenar no cache
            var valuesArray = Array.from(valuesSet);

            // Armazena os valores no cache
            cache[cacheKey] = valuesArray;

            // Popula os dropdowns com os valores
            populateDropdownFromCache(valuesArray, selectElement);
        })
        .catch(error => {
            console.error('Erro ao buscar valores únicos:', error);
        });
}

// Função para popular o dropdown a partir do cache ou de uma nova requisição
function populateDropdownFromCache(valuesArray, selectElement) {
    // Limpa o selectElement antes de adicionar novos valores
    selectElement.innerHTML = '';

    // Adiciona a opção de selecionar "Todos" ao dropdown
    var optionAll = document.createElement('option');
    optionAll.value = ''; // Valor vazio para "Todos"
    optionAll.innerHTML = 'Todos'; // Texto exibido
    selectElement.appendChild(optionAll);

    // Adiciona os valores únicos ao dropdown
    valuesArray.forEach(value => {
        var option = document.createElement('option');
        option.value = value;
        option.innerHTML = value;
        selectElement.appendChild(option);
    });
      // Log quando terminar de popular o dropdown
    console.log(`populateDropdownFromCache: Dropdown para o atributo foi populado com ${valuesArray.length} valores únicos.`);
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////












var layersObjFiltered = {}; // Objeto para armazenar as camadas filtradas
// Listener para aplicar os filtros ao clicar no botão de aplicar
document.getElementById('applyFilterButton').addEventListener('click', function () {
    // Aqui você deve coletar os valores dos filtros gerados dinamicamente
    var filterFields = document.querySelectorAll('#dynamicFilters select');
    var cqlFilter = '';

    filterFields.forEach((field, index) => {
        var selectedValue = field.value;
        var fieldName = field.id.split('filter-')[1];

        if (selectedValue && selectedValue !== 'todos') { // Se não for 'todos', adiciona ao filtro
            if (index > 0 && cqlFilter !== '') {
                cqlFilter += ' AND ';
            }
            cqlFilter += `${fieldName} = '${selectedValue}'`;
        }
    });


    // Certifica-se de que há uma camada selecionada
    if (!selectedLayerName) {
        alert('Por favor, selecione uma camada antes de aplicar o filtro.');
        return;
    }

    // Se nenhum filtro foi selecionado, trata como "Todos", ou seja, sem CQL_FILTER
    if (!cqlFilter) {
        // Carrega a camada completa sem filtros
        cqlFilter = ''; // Sem filtro CQL aplicado
    }

    // Cria a nova camada filtrada (ou sem filtro, caso não haja)
    var filteredLayer = createFilteredLayer(selectedurl_ows, selectedLayerName, cqlFilter);

    // Remove a camada antiga do mapa (se existir)
   // if (layersObj[selectedLayerName]) {
   //     olMap.removeLayer(layersObj[selectedLayerName]);
   // }
// Armazena a nova camada filtrada no objeto layersObjFiltered
layersObjFiltered[selectedLayerName] = filteredLayer;
    // Adiciona a nova camada filtrada ao mapa
    olMap.addLayer(filteredLayer);

    // Armazena a nova camada filtrada no objeto layersObj
    //layersObj[selectedLayerName] = filteredLayer;
    alert('Filtro aplicado com sucesso!');
});




// Adiciona um listener para o botão de remover camada filtrada
document.getElementById('removeFilterButton').addEventListener('click', function() {
    // Certifique-se de que uma camada foi filtrada antes de tentar removê-la
    if (layersObjFiltered[selectedLayerName]) {
        // Remove a camada filtrada do mapa
        olMap.removeLayer(layersObjFiltered[selectedLayerName]);

        // Remove a camada do objeto layersObjFiltered
        delete layersObjFiltered[selectedLayerName];

        // Exibe uma mensagem de sucesso
        alert('Camada filtrada removida com sucesso!');
    } else {
        // Caso não haja camada filtrada para remover
        alert('Nenhuma camada filtrada para remover.');
    }
});







// Listener para o botão de remover todas as camadas
document.getElementById('removeAllLayersButton').addEventListener('click', function() {
    for (var layerName in layersObj) {
        if (layersObj[layerName].getVisible()) {
            olMap.removeLayer(layersObj[layerName]);
            removeLegend(layerName); // Chama a função para remover a legenda
            layersObj[layerName].setVisible(false);
        }
    }
    for (var selectedLayerName in layersObjFiltered) {
        if (layersObjFiltered[selectedLayerName].getVisible()) {
            olMap.removeLayer(layersObjFiltered[selectedLayerName]);
            removeLegend(selectedLayerName); // Chama a função para remover a legenda
            layersObjFiltered[selectedLayerName].setVisible(false);
        }
    }

    if (selectedLayerName) {
        olMap.removeLayer(selectedLayerName);
        removeLegend(selectedLayerName); // Remove a legenda da camada filtrada
        selectedLayerName = null;  // Reseta a variável
    }

    layersObj = {};
    layersObjFiltered = {};

    closeLegendPopup();

    var checkboxes = document.querySelectorAll('#extraLayerSwitcher input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;  // Desmarca o checkbox
    });

    alert('Todas as camadas foram removidas e os checkboxes desmarcados!');
});


// Função para filtrar as camadas temáticas
function filterLayers() {
    const input = document.getElementById('layerSearchInput');
    const filter = input.value.toLowerCase();
    const layerItems = document.querySelectorAll('.layer-item');

    layerItems.forEach(function(item) {
        const label = item.querySelector('label');
        const text = label.textContent || label.innerText;
        if (text.toLowerCase().indexOf(filter) > -1) {
            item.style.display = "";  // Mostra o item se o texto corresponder à busca
        } else {
            item.style.display = "none";  // Esconde o item se o texto não corresponder
        }
    });
}

// Inicialização: quando a fonte for alterada, recria as camadas e os downloads
document.getElementById('sourceSelect').addEventListener('change', function() {
    var selectedSource = this.value;
    createLayersAndDownloadBox(selectedSource);
});


// Função para alternar a visibilidade das camadas temáticas
function switchExtraLayer(layer, visibility) {
    if (layersObj[layer]) {
        layersObj[layer].setVisible(visibility);
        if (visibility) {
            addLegend(layer, url_ows); // Adiciona a legenda ao selecionar a camada
        } else {
            removeLegend(layer); // Remove a legenda ao desmarcar a camada
        }
    }
}

// Listener para os checkboxes das camadas temáticas
document.querySelectorAll('.layer-switcher input[name="extraLayer"]').forEach(function(input) {
    input.addEventListener('change', function() {
        switchExtraLayer(this.value, this.checked);
    });
});


// Função para remover todas as camadas selecionadas
function removeAllLayers() {
    var checkboxes = document.querySelectorAll('.layer-switcher input[type="checkbox"]');

    //Checar se tem alguma camada de fato selecionada
    var anyChecked = false;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            anyChecked = true;
        }
    });
    if (!anyChecked) {
        alert('Nenhuma camada selecionada para remoção!');
        return; // Sai da função, não executa o restante
    }

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;  // Desmarca todos os checkboxes
        var layerName = checkbox.value;
        if (layersObj[layerName]) {
            layersObj[layerName].setVisible(false);  // Esconde as camadas associadas
        }
        removeLegend(layerName);  // Remove a legenda da camada
        checkActiveLayersAndCloseLegend();
    });
}

// Listener para o campo de busca expandido (filtro de camadas)
document.addEventListener('DOMContentLoaded', function() {
    var layerSearchInput = document.getElementById('layerSearchInput');
    if (layerSearchInput) {
        layerSearchInput.addEventListener('keyup', filterLayers);
    }
});

// Listener para o botão de remover todas as camadas selecionadas
document.addEventListener('DOMContentLoaded', function() {
    var clearAllLayersButton = document.getElementById('clearAllLayers');
    if (clearAllLayersButton) {
        clearAllLayersButton.addEventListener('click', removeAllLayers);
    }
});

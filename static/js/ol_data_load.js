const layerSources = {
    "WRI": {
        url: 'https://geoserver.dsview.org/geoserver/dsview/ows',
        layers: []
    },
    "IBGE Censo 2022": {
        url: 'https://geoservicoscenso2022.ibge.gov.br/geoserver/censo2022/ows',
        layers: []
    },
    "ICMBIO": {
        url: 'https://geoservicos.inde.gov.br/geoserver/ows',
        layers: []
    },
    "IBGE ODS": {
        url: 'https://geoservicos.ibge.gov.br/geoserver/ows',
        layers: []
    },
    "IBGE COMPLETO": {
        url: 'https://geoservicos.ibge.gov.br/geoserver/ows',
        layers: []
    },
    "Embrapa": {
        url: 'https://geoinfo.dados.embrapa.br/geoserver/ows',
        layers: []
    },
    "INPE": {
        url: 'https://terrabrasilis.dpi.inpe.br/geoserver/ows',
        layers: []
    },
    "SIPAM": {
        url: 'https://panorama.sipam.gov.br/geoserver/ows',
        layers: []
    },
};

//// Função para carregar e processar as camadas de cada fonte com cache e indicador de carregamento
//function loadLayersWithCacheAndLoadingIndicator(sourceName, filePath) {
//    const cacheKey = `layersCache_${sourceName}`;
//
//    // Exibe uma mensagem de carregamento
//    const loadingMessage = document.createElement('div');
//    loadingMessage.innerHTML = `Carregando camadas de ${sourceName}...`;
//    loadingMessage.id = `loading_${sourceName}`;
//    document.body.appendChild(loadingMessage);
//
//    // Verifica se o JSON já está no cache
//    const cachedData = localStorage.getItem(cacheKey);
//    if (cachedData) {
//        console.log(`Carregando camadas para ${sourceName} do cache`);
//        processLayers(sourceName, JSON.parse(cachedData));
//
//        // Remove a mensagem de carregamento
//        document.getElementById(`loading_${sourceName}`).remove();
//        return;
//    }
//
//    // Se não estiver no cache, faz o fetch
//    fetch(filePath)
//        .then(response => response.json())
//        .then(data => {
//            processLayers(sourceName, data.layersList);
//
//            // Armazena no cache
//            localStorage.setItem(cacheKey, JSON.stringify(data.layersList));
//
//            // Remove a mensagem de carregamento
//            document.getElementById(`loading_${sourceName}`).remove();
//        })
//        .catch(error => {
//            console.error(`Erro ao carregar camadas para ${sourceName}:`, error);
//
//            // Remove a mensagem de carregamento mesmo em caso de erro
//            document.getElementById(`loading_${sourceName}`).remove();
//        });
//}
//
//// Função para processar as camadas e adicionar ao layerSources
//function processLayers(sourceName, layersList) {
//    layersList.forEach(layerString => {
//        let [layerName, description] = layerString.split(":");
//        if (layerName && description) {
//            layerSources[sourceName].layers.push({
//                name: description,
//                layerName: `${layerName}:${description}`
//            });
//        }
//    });
//
//    // Verifica se é o IBGE Censo 2022 para carregar na inicialização
//    if (sourceName === "WRI") {
//        createLayersAndDownloadBox('WRI');  // Carrega a fonte IBGE na inicialização
//    }
//}







        // Função para carregar e processar os arquivos de camadas
        function loadLayers(sourceName, filePath) {
            console.log(`Carregando camadas para ${sourceName} do arquivo: ${filePath}`);
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar o arquivo de camadas: ${filePath}`);
                    }
                    return response.json(); // Supondo que o arquivo seja JSON
                })
                .then(data => {
                    // Verifica se há uma chave `layersList` no arquivo JSON carregado
                    if (!data.layersList) {
                        throw new Error(`Arquivo JSON mal formatado. 'layersList' não encontrado no arquivo ${filePath}`);
                    }
                    // Processa as camadas após o arquivo ser carregado
                    processLayers(sourceName, data.layersList);
                })
                .catch(error => {
                    console.error(`Erro ao carregar as camadas para ${sourceName}: `, error);
                });
        }













//  // Função para carregar e processar as camadas de cada fonte
//  function loadLayers(sourceName, filePath) {
//      fetch(filePath)
//          .then(response => response.json())
//          .then(data => processLayers(sourceName, data.layersList))
//          .catch(error => console.error(`Erro ao carregar camadas para ${sourceName}:`, error));
//  }

  // Função para processar as camadas e adicionar ao layerSources
  function processLayers(sourceName, layersList) {
      layersList.forEach(layerString => {
          let [namespace, layerName, description] = layerString.split(':');
          if (layerName && description) {
              layerSources[sourceName].layers.push({
                  name: description,
                  layerName: `${namespace}:${layerName}`
              });
          }
      });
      if (sourceName === "WRI") {
          createLayersAndDownloadBox('WRI'); // Carrega a fonte IBGE na inicialização
      }
  }
//
//  loadLayers("IBGE Censo 2022", "{% static 'json/layers_ibge.json' %}");
//  loadLayers("ICMBIO", "{% static 'json/layers_icmbio.json' %}");
//  loadLayers("IBGE ODS", "{% static 'json/layers_ibge_ods.json' %}");
//  loadLayers("Embrapa", "{% static 'json/layers_embrapa.json' %}");
//  loadLayers("INPE", "{% static 'json/layers_inpe.json' %}");
//  loadLayers("SIPAM", "{% static 'json/layers_sipam.json' %}");
//
//        // Função para carregar e processar os arquivos de camadas
//        function loadLayers(sourceName, filePath) {
//            console.log(`Carregando camadas para ${sourceName} do arquivo: ${filePath}`);
//            fetch(filePath)
//                .then(response => {
//                    if (!response.ok) {
//                        throw new Error(`Erro ao carregar o arquivo de camadas: ${filePath}`);
//                    }
//                    return response.json(); // Supondo que o arquivo seja JSON
//                })
//                .then(data => {
//                    // Verifica se há uma chave `layersList` no arquivo JSON carregado
//                    if (!data.layersList) {
//                        throw new Error(`Arquivo JSON mal formatado. 'layersList' não encontrado no arquivo ${filePath}`);
//                    }
//                    // Processa as camadas após o arquivo ser carregado
//                    processLayers(sourceName, data.layersList);
//                })
//                .catch(error => {
//                    console.error(`Erro ao carregar as camadas para ${sourceName}: `, error);
//                });
//        }
//        // Função para processar as camadas e adicioná-las ao layerSources
//        function processLayers(sourceName, layersList) {
//            console.log(`Processando camadas para ${sourceName}:`, layersList);
//            layersList.forEach(layerString => {
//                let parts = layerString.split(':');
//
//                if (parts.length !== 3) {
//                    console.error("Erro ao processar: camada mal formatada", layerString);
//                    return;  // Ignora camadas mal formatadas
//                }
//                let layerName = parts[1]; // O nome real da camada
//                let description = parts[2]; // Descrição da camada
//                let layerTitle = parts[0] + '|'  +parts[2]; // Descrição da camada
//                // Adiciona ao objeto layerSources
//                layerSources[sourceName].layers.push({
//                    name: description,
//                    layerName: parts[0] + ':' + layerName  // Recria o nome completo da camada
//                });
//            });
//            console.log(`Resultado final para ${sourceName}: `, layerSources[sourceName]);
//            if (sourceName === "IBGE Censo 2022") {
//                createLayersAndDownloadBox('IBGE Censo 2022'); // Carrega a fonte IBGE ao carregar a página
//            }
//        }


        // Configuração inicial do mapa
        const homeCenter = ol.proj.fromLonLat([-46.9836, -23.0297]);  // Coordenadas de Vinhedo
        const homeZoom = 12;  // Zoom ajustado para uma cidade

        var mapView = new ol.View({
            center: homeCenter,
            zoom: homeZoom
        });

        var olMap = new ol.Map({
            target: 'map',
            view: mapView
        });
      // Adicionar controle de escala ao mapa
      var scaleLineControl = new ol.control.ScaleLine({
          units: 'metric',
          bar: true,
          text: true,
          minWidth: 100,
      });
      olMap.addControl(scaleLineControl);

        // Camadas base OpenStreetMap
        const openStreetMapStandard = new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: '© OpenStreetMap contributors',
            }),
            visible: true,
            title: 'OSMStandard'
        });

        const openStreetMapHumanitarian = new ol.layer.Tile({
            source: new ol.source.OSM({
                url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                attributions: '© OpenStreetMap contributors, Tiles courtesy of Humanitarian OpenStreetMap Team',
            }),
            visible: false,
            title: 'OSMHumanitarian'
        });

        const cartoDarkMatter = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                attributions: '© OpenStreetMap contributors, © CartoDB',
            }),
            visible: false,
            title: 'CartoDarkMatter'
        });

        const esriWorldImagery = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attributions: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC',
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'ESRIWorldImagery'
        });

        const esriWorldStreetMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri, HERE, Garmin, FAO, NOAA, USGS'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriWorldStreetMap'
        });

        const esriTopographicMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriTopographicMap'
        });

        const esriNationalGeographicWorldMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
                attributions: '© National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriNationalGeographicWorldMap'
        });

        const esriWorldShadedRelief = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri, HERE, Garmin, FAO, USGS, NGA, EPA, NPS'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriWorldShadedRelief'
        });

        const esriDarkGrayCanvas = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri, HERE, Garmin, FAO, NOAA, USGS'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriDarkGrayCanvas'
        });

        const esriLightGrayCanvas = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                attributions: '© Esri, HERE, Garmin, FAO, NOAA, USGS'
            }),
            visible: false,  // ESRI World Imagery agora é a camada base padrão
            title: 'esriLightGrayCanvas'
        });

        // Adicionar as camadas base ao mapa
        olMap.addLayer(openStreetMapStandard);
        olMap.addLayer(openStreetMapHumanitarian);
        olMap.addLayer(cartoDarkMatter);
        olMap.addLayer(esriWorldImagery);
        olMap.addLayer(esriWorldStreetMap);
        olMap.addLayer(esriTopographicMap);
        olMap.addLayer(esriNationalGeographicWorldMap);
        olMap.addLayer(esriWorldShadedRelief);
        olMap.addLayer(esriDarkGrayCanvas);
        olMap.addLayer(esriLightGrayCanvas);

        // Função para alternar entre as camadas do mapa base
        function switchBaseLayer(layer) {
            openStreetMapStandard.setVisible(false);
            openStreetMapHumanitarian.setVisible(false);
            cartoDarkMatter.setVisible(false);
            esriWorldImagery.setVisible(false);
            esriWorldStreetMap.setVisible(false);
            esriTopographicMap.setVisible(false);
            esriNationalGeographicWorldMap.setVisible(false);
            esriWorldShadedRelief.setVisible(false);
            esriDarkGrayCanvas.setVisible(false);
            esriLightGrayCanvas.setVisible(false);

            if (layer === 'osmStandard') {
                openStreetMapStandard.setVisible(true);
            } else if (layer === 'osmHumanitarian') {
                openStreetMapHumanitarian.setVisible(true);
            } else if (layer === 'cartoDarkMatter') {
                cartoDarkMatter.setVisible(true);
            } else if (layer === 'esriWorldImagery') {
                esriWorldImagery.setVisible(true);
            } else if (layer === 'esriWorldStreetMap') {
                esriWorldStreetMap.setVisible(true);
            } else if (layer === 'esriTopographicMap') {
                esriTopographicMap.setVisible(true);
            } else if (layer === 'esriNationalGeographicWorldMap') {
                esriNationalGeographicWorldMap.setVisible(true);
            } else if (layer === 'esriWorldShadedRelief') {
                esriWorldShadedRelief.setVisible(true);
            } else if (layer === 'esriDarkGrayCanvas') {
                esriDarkGrayCanvas.setVisible(true);
            } else if (layer === 'esriLightGrayCanvas') {
                esriLightGrayCanvas.setVisible(true);
            }

        }

        // Listener para o controle de camadas do mapa base
        document.querySelectorAll('.layer-switcher input[name="baseLayer"]').forEach(function(input) {
            input.addEventListener('change', function() {
                switchBaseLayer(this.value);
            });
        });

        // Garantir que o mapa base padrão seja exibido corretamente e o controle esteja sincronizado
        window.addEventListener('load', function() {
            // Marcar o input correspondente à camada base padrão como selecionado
            document.querySelector('input[value="osmStandard"]').checked = true; // Marcar o OpenStreetMap Standard como padrão
        });


        // Função para retornar ao estado "Home"
        document.getElementById('homeButton').addEventListener('click', function() {
            mapView.setCenter(homeCenter);
            mapView.setZoom(homeZoom);
        });

        // Capturar o movimento do mouse e exibir as coordenadas
        olMap.on('pointermove', function (event) {
            var coords = ol.proj.toLonLat(event.coordinate);
            var lon = coords[0].toFixed(4);
            var lat = coords[1].toFixed(4);

            document.getElementById('coordinateDisplay').innerHTML = `Latitude: ${lat}, Longitude: ${lon}`;
        });




    // Função para adicionar pontos no mapa
    function addPointsToMap(vagas) {
        const features = vagas.map(function(vaga) {
            // Verifique se as coordenadas estão corretamente convertidas para EPSG:3857
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([parseFloat(vaga.longitude), parseFloat(vaga.latitude)])  // Converta corretamente
                ),
                nome: vaga.nome,
                empresa: vaga.empresa
            });
            return feature;
        });

        const vectorSource = new ol.source.Vector({
            features: features
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,  // Aumente o raio para garantir visibilidade
                    fill: new ol.style.Fill({ color: 'red' }),  // Cor do ponto
                    stroke: new ol.style.Stroke({ color: 'black', width: 2 })  // Contorno do ponto
                })
            })
        });

        olMap.addLayer(vectorLayer);
    }

    // Função para buscar os dados da API de vagas
    function loadVagaPoints() {
        fetch('/vaga_points/')
            .then(response => response.json())
            .then(data => {
                // Verifique se os dados foram carregados corretamente
                console.log('Dados carregados:', data);

                // Adicionar os pontos ao mapa
                addPointsToMap(data);
            })
            .catch(error => console.error('Erro ao carregar os dados das vagas:', error));
    }

    // Chamar a função para carregar os pontos das vagas
    loadVagaPoints();


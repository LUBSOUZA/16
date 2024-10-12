//MEDIÇÃO
//MEDIÇÃO
//MEDIÇÃO
//MEDIÇÃO

    // Funções de Medição
    var draw;  // Para gerenciar a interação de desenho
    var measureTooltipElement;
    var measureTooltip;
    var sketch;
    var singleClickListener;  // Armazena o listener original de clique

    // Função para desativar cliques nas geometrias
    function disableGeometryClick() {
        olMap.un('singleclick', handleGeometryClick);  // Remove o evento de clique ao desativar
    }

    // Função para reativar cliques nas geometrias
    function enableGeometryClick() {
        singleClickListener = olMap.on('singleclick', handleGeometryClick);  // Reativa o evento de clique nas geometrias
    }

    var measureSource = new ol.source.Vector();
    var measureLayer = new ol.layer.Vector({
        source: measureSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    });

    olMap.addLayer(measureLayer);

    // Função para criar uma ferramenta de medição
    function addInteraction(type) {
        disableGeometryClick();  // Desativa cliques nas geometrias ao ativar medição
        measureActive = true;  // Ativa o modo de medição

        draw = new ol.interaction.Draw({
            source: measureSource,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });
        olMap.addInteraction(draw);

        createMeasureTooltip();

        draw.on('drawstart', function (evt) {
            sketch = evt.feature;
            var tooltipCoord = evt.coordinate;
            sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', function () {
            measureTooltipElement.className = 'measure-tooltip measure-tooltip-static';
            measureTooltip.setOffset([0, -15]);
            sketch = null;
            measureTooltipElement = null;
            createMeasureTooltip();
        });
    }

    // Função para criar um tooltip de medição
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'measure-tooltip measure-tooltip-measure';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        olMap.addOverlay(measureTooltip);
    }

    // Funções de formatação de área e comprimento
    function formatLength(line) {
        var length = ol.sphere.getLength(line);
        return length > 100
            ? (Math.round(length / 1000 * 100) / 100) + ' km'
            : (Math.round(length * 100) / 100) + ' m';
    }

    function formatArea(polygon) {
        var area = ol.sphere.getArea(polygon);
        return area > 10000
            ? (Math.round(area / 1000000 * 100) / 100) + ' km²'
            : (Math.round(area * 100) / 100) + ' m²';
    }

    // Listeners para os botões de medição
    document.getElementById('measureLengthButton').addEventListener('click', function () {
        olMap.removeInteraction(draw);
        addInteraction('LineString');
    });

    document.getElementById('measureAreaButton').addEventListener('click', function () {
        olMap.removeInteraction(draw);
        addInteraction('Polygon');
    });

    document.getElementById('clearMeasurementsButton').addEventListener('click', function () {
        measureSource.clear();
        olMap.getOverlays().clear();
        olMap.removeInteraction(draw);
        measureActive = false;  // Desativa o modo de medição
        enableGeometryClick();  // Reativa o clique nas geometrias
    });

    olMap.on('singleclick', handleGeometryClick);  // Ativa o evento de clique nas geometrias
//MEDIÇÃO
//MEDIÇÃO
//MEDIÇÃO
//MEDIÇÃO


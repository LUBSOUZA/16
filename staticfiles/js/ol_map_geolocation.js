// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO
// Função para adicionar um marcador de geolocalização no mapa
function addGeolocationMarker(coordinate) {
    var geolocationMarker = new ol.Overlay({
        position: coordinate,
        positioning: 'center-center',
        element: document.createElement('div'),
        stopEvent: false
    });

    geolocationMarker.getElement().style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; // Fundo azul
    geolocationMarker.getElement().style.width = '10px';
    geolocationMarker.getElement().style.height = '10px';
    geolocationMarker.getElement().style.borderRadius = '50%';
    geolocationMarker.getElement().style.border = '2px solid white'; // Borda branca para destaque

    olMap.addOverlay(geolocationMarker);
}

// Evento de clique no botão de geolocalização
document.getElementById('geolocationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userCoordinate = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
            addGeolocationMarker(userCoordinate);
            mapView.setCenter(userCoordinate); // Centralizar no usuário sem alterar o zoom
        });
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
});

// Lógica para expandir o campo de busca ao clicar no ícone
document.getElementById('searchButton').addEventListener('click', function () {
    var searchContainer = document.querySelector('.search-container');
    searchContainer.classList.toggle('active');

    // Remover o marcador quando a caixa de busca é fechada
    if (!searchContainer.classList.contains('active') && marker) {
        olMap.removeOverlay(marker);
    }
});
let marker; // Definindo a variável globalmente para o marcador

// Função para buscar lugares usando a API Nominatim do OpenStreetMap
function searchPlace(query) {
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var firstResult = data[0];
                var lon = parseFloat(firstResult.lon);
                var lat = parseFloat(firstResult.lat);
                var coordinates = ol.proj.fromLonLat([lon, lat]);

                // Fazendo o zoom in gradual
                mapView.animate({
                    center: coordinates,
                    zoom: 10,
                    duration: 1000
                });

                // Adiciona um ponto no mapa para marcar a localização encontrada
                if (marker) {
                    olMap.removeOverlay(marker);
                }

                marker = new ol.Overlay({
                    position: coordinates,
                    positioning: 'center-center',
                    element: document.createElement('div'),
                    stopEvent: false
                });
                marker.element.style.width = '10px';
                marker.element.style.height = '10px';
                marker.element.style.backgroundColor = 'red';
                marker.element.style.borderRadius = '50%';
                olMap.addOverlay(marker);

            } else {
                alert("Lugar não encontrado. Tente outra busca.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o local:", error);
            alert("Erro ao buscar o local. Tente novamente mais tarde.");
        });
}

// Listener para o campo de busca expandido
document.getElementById('searchBox').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var query = e.target.value;
        if (query) {
            searchPlace(query);
        }
    }
});
// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO
// GEOLOCALIZAÇÃO


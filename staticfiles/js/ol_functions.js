// Função para fechar o legendPopup
function closeLegendPopup() {
    var legendPopup = document.getElementById('legendPopup');
    if (legendPopup && legendPopup.style.display === 'block') {
        legendPopup.style.display = 'none';
    }
}
// Função para verificar se há camadas temáticas ativas
function checkActiveLayersAndCloseLegend() {
    var hasActiveLayer = false;

    // Itera sobre as camadas temáticas no objeto layersObj
    for (var layerName in layersObj) {
        if (layersObj[layerName].getVisible()) {
            hasActiveLayer = true;
            break; // Se encontrar uma camada ativa, interrompe o loop
        }
    }

    // Se não houver camadas ativas, fecha o legendPopup
    if (!hasActiveLayer) {
        closeLegendPopup();
    }
}

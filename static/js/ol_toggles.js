//// Fechar camadas base e temáticas ao clicar em Source List
//document.getElementById('sourceSelect').addEventListener('click', function () {
//    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
//    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');
//    baseLayerSwitcher.classList.remove('active');  // Fecha camadas base
//    extraLayerSwitcher.classList.remove('active');  // Fecha camadas temáticas
//});
//
//// Toggle para mostrar/esconder o Layer Switcher de camadas temáticas
//var extraLayerToggleBtn = document.getElementById('extraLayerToggleBtn');
//extraLayerToggleBtn.addEventListener('click', function() {
//    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
//    var layerSwitcherDiv = document.getElementById('extraLayerSwitcher');
//    layerSwitcherDiv.classList.toggle('active');
//    baseLayerSwitcher.classList.remove('active'); // Fecha a caixa de camadas base se estiver aberta
//});
// Função para fechar todas as switchers (camadas base, camadas temáticas e filtro)

// Toggle para mostrar/esconder o Layer Switcher de camadas base
// Toggle para mostrar/esconder o Layer Switcher de camadas base
// Função para fechar todas as caixas
// Função para fechar todas as switchers (camadas base, camadas temáticas e filtro)
function closeAllSwitchers() {
    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');
    var filterBox = document.getElementById('filterBox');

    baseLayerSwitcher.classList.remove('active');
    extraLayerSwitcher.classList.remove('active');
    filterBox.classList.remove('active');
}

// Listener para o clique no Source List (fechando camadas base e temáticas)
document.getElementById('sourceSelect').addEventListener('click', function () {
    console.log('Source List clicada, fechando camadas base e temáticas.');
    closeAllSwitchers();
});

// Toggle para mostrar/esconder o Layer Switcher de camadas temáticas
var extraLayerToggleBtn = document.getElementById('extraLayerToggleBtn');
extraLayerToggleBtn.addEventListener('click', function () {
    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');
    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
    var filterBox = document.getElementById('filterBox');

    // Fecha as outras caixas e alterna a visibilidade da caixa de camadas temáticas
    if (!extraLayerSwitcher.classList.contains('active')) {
        closeAllSwitchers();
    }
    extraLayerSwitcher.classList.toggle('active'); // Alterna o estado
    console.log('Botão extraLayerToggleBtn clicado.');
});

// Toggle para mostrar/esconder o Layer Switcher de camadas base
var baseLayerToggleBtn = document.getElementById('baseLayerToggleBtn');
baseLayerToggleBtn.addEventListener('click', function () {
    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');
    var filterBox = document.getElementById('filterBox');

    // Fecha as outras caixas e alterna a visibilidade da caixa de camadas base
    if (!baseLayerSwitcher.classList.contains('active')) {
        closeAllSwitchers();
    }
    baseLayerSwitcher.classList.toggle('active'); // Alterna o estado
    console.log('Botão baseLayerToggleBtn clicado.');
});


// Toggle para mostrar/esconder o Filter Box
var filterToggleBtn = document.getElementById('filterToggle');
filterToggleBtn.addEventListener('click', function () {
    var filterBox = document.getElementById('filterBox');
    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');

    // Verifica se há camadas visíveis antes de abrir a caixa de legendas
    let hasVisibleLayer = false;
    for (let layer in layersObj) {
        if (layersObj[layer].getVisible()) {
            hasVisibleLayer = true;
            break;
        }
    }

    if (!hasVisibleLayer) {
        alert('Nenhuma camada visível para ser filtrada!');
        return; // Interrompe a execução se não houver camadas visíveis
    }

    // Fecha as outras caixas e alterna a visibilidade da caixa de filtro
    if (!filterBox.classList.contains('active')) {
        closeAllSwitchers();
    }
    filterBox.classList.toggle('active'); // Alterna o estado

    if (filterBox.classList.contains('active')) {
        // Carrega os atributos da camada selecionada apenas quando a caixa de filtro for aberta
        if (selectedLayerName && selectedurl_ows) {
            console.log("Carregando Atributos da Camanda");
            getLayerAttributes(selectedLayerName, selectedurl_ows);
        } else {
            alert('Por favor, selecione uma camada antes de aplicar o filtro.');
        }
    }

    console.log('Botão filterToggleBtn clicado.');
});


//Cliques fora
document.addEventListener('click', function(event) {
    var baseLayerSwitcher = document.getElementById('baseLayerSwitcher');
    // Verifica se o baseLayerSwitcher está ativo
    if (baseLayerSwitcher.classList.contains('active')) {
        // Verifica se o clique foi fora do baseLayerSwitcher
        if (!baseLayerSwitcher.contains(event.target) && !document.getElementById('baseLayerToggleBtn').contains(event.target)) {
            // Remove a classe 'active' para fechar o baseLayerSwitcher
            baseLayerSwitcher.classList.remove('active');
            console.log('baseLayerSwitcher fechado ao clicar fora.');
        }
    }
    var extraLayerSwitcher = document.getElementById('extraLayerSwitcher');
    // Verifica se o baseLayerSwitcher está ativo
    if (extraLayerSwitcher.classList.contains('active')) {
        // Verifica se o clique foi fora do baseLayerSwitcher
        if (!extraLayerSwitcher.contains(event.target) && !document.getElementById('extraLayerToggleBtn').contains(event.target)) {
            // Remove a classe 'active' para fechar o baseLayerSwitcher
            extraLayerSwitcher.classList.remove('active');
            console.log('extraLayerSwitcher fechado ao clicar fora.');
        }
    }

    var filterBox = document.getElementById('filterBox');
    // Verifica se o baseLayerSwitcher está ativo
    if (filterBox.classList.contains('active')) {
        // Verifica se o clique foi fora do baseLayerSwitcher
        if (!filterBox.contains(event.target) && !document.getElementById('filterToggle').contains(event.target)) {
            // Remove a classe 'active' para fechar o baseLayerSwitcher
            filterBox.classList.remove('active');
            console.log('extraLayerSwitcher fechado ao clicar fora.');
        }
    }
});


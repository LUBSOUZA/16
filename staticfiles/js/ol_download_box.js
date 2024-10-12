// Criação do novo div para a caixa de download fora do extraLayerSwitcher
var downloadBox = document.createElement('div');
downloadBox.id = 'downloadBox';
document.body.appendChild(downloadBox); // Adiciona ao body

// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// Função para exibir a caixa de download no centro da tela com transição suave
function updateDownloadBoxWithTransition(layerName, layerTitle, formatList, url_ows) {
    // Oculta a caixa de download com transição suave antes de atualizar o conteúdo
    downloadBox.classList.remove('show');

    setTimeout(function() {
        // Limpa o conteúdo anterior
        downloadBox.innerHTML = '';

        // Adiciona o título da camada na caixa de download
        var title = document.createElement('h4');
        title.innerHTML = layerTitle;
        downloadBox.appendChild(title);

        // Adiciona os links de download
        formatList.forEach(function (format) {
            var downloadLink = document.createElement('a');

            // Monta o link de download com os parâmetros necessários
            var encodedLayerName = encodeURIComponent(layerName);
            var downloadHref = `${url_ows}?service=WFS&version=1.0.0&request=GetFeature&typeName=${encodedLayerName}&outputFormat=${format.format}`;

            downloadLink.href = downloadHref;
            downloadLink.innerHTML = format.name;

            // Quando o link for clicado, abre o link em uma nova aba
            downloadLink.onclick = function (event) {
                event.preventDefault();
                window.open(downloadHref, '_blank'); // Abre o link em uma nova aba
            };

            // Adiciona o link à caixa de download
            downloadBox.appendChild(downloadLink);
        });

        // Botão de fechar
        var closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function () {
            downloadBox.classList.remove('show'); // Esconde a caixa de download
        };
        downloadBox.appendChild(closeButton);

        // Reexibe a caixa de download com a nova informação e transição suave
        downloadBox.classList.add('show');
        downloadBox.style.display = 'block'; // Garante que a caixa apareça
    }, 400); // Duração da transição de ocultação antes de exibir a nova informação
}
// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// DOWNLOAD TRES PONTIHOS
// Listener global para fechar menus ao clicar fora
document.addEventListener('click', function (event) {
    if (!downloadBox.contains(event.target)) {
        downloadBox.classList.remove('show');  // Esconde a caixa de download ao clicar fora dela
        downloadBox.style.display = 'none';  // Esconde a caixa de download
    }
});


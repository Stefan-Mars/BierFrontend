function fetchBeers() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/BierAPI/beers', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var beers = JSON.parse(xhr.responseText);
            displayBeers(beers);
        }
    };
    xhr.send();
}

function displayBeers(beers) {
    var beerContainer = document.getElementById('beer-container');
    beerContainer.innerHTML = '';
    if (beers.length > 0) {
        beers.forEach(function (beer) {
            var beerTile = document.createElement('div');
            beerTile.className = 'beer-tile';
            beerTile.innerHTML = '<h2>' + beer.name + '</h2>' +
                '<p>Brewer: ' + beer.brewer + '</p>' +
                '<p>Type: ' + beer.type + '</p>' +
                '<p>Yeast: ' + beer.yeast + '</p>' +
                '<p>Percentage: ' + beer.perc + '</p>' +
                '<p>Purchase Price: ' + beer.purchase_price + '</p>';
            beerTile.onclick = function () {
                window.location.href = 'show.html?id=' + beer.id;
            };
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = '<p>No beers found</p>';
    }
}

window.onload = fetchBeers;
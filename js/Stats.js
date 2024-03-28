var allBeers = [];

function fetchBeers() {
    axios.get('http://localhost/BierAPI/beers')
        .then(response => {
            var beers = response.data;

            beers.forEach(function (beer) {
                if (!beer.average_rating) {
                    beer.average_rating = 0;
                }
            });

            var beersByBrewer = {};
            beers.forEach(function (beer) {
                if (!beersByBrewer[beer.brewer]) {
                    beersByBrewer[beer.brewer] = [];
                }
                beersByBrewer[beer.brewer].push(beer);
            });

            var brewersWithAvgRating = [];
            for (var brewer in beersByBrewer) {
                var totalRating = 0;
                beersByBrewer[brewer].forEach(function (beer) {
                    totalRating += parseFloat(beer.average_rating);
                });

                var avgRating = totalRating / beersByBrewer[brewer].length;

                brewersWithAvgRating.push({ brewer: brewer, avgRating: avgRating });
            }

            brewersWithAvgRating.sort(function (a, b) {
                return b.avgRating - a.avgRating;
            });

            displayBestBrewers(brewersWithAvgRating.slice(0, 3));

            var beersByType = {};
            beers.forEach(function (beer) {
                if (!beersByType[beer.type]) {
                    beersByType[beer.type] = [];
                }
                beersByType[beer.type].push(beer);
            });

            var typesWithAvgRating = [];
            for (var type in beersByType) {
                var totalRating = 0;
                beersByType[type].forEach(function (beer) {
                    totalRating += parseFloat(beer.average_rating);
                });
                var avgRating = totalRating / beersByType[type].length;
                typesWithAvgRating.push({ type: type, avgRating: avgRating });
            }

            typesWithAvgRating.sort(function (a, b) {
                return b.avgRating - a.avgRating;
            });

            displayBestTypes(typesWithAvgRating.slice(0, 3));

            beers.sort(function (a, b) {
                return b.average_rating - a.average_rating;
            });

            displayBestRatings(beers.slice(0, 3));

            beers.forEach(function (beer) {
                axios.get('http://localhost/BierAPI/comments/' + beer.beer_id)
                    .then(ratingsResponse => {
                        var ratings = ratingsResponse.data;
                        beer.numRatings = ratings.length || 0;

                        beers.sort(function (a, b) {
                            return b.numRatings - a.numRatings;
                        });

                        displayTopRatedBeers(beers.slice(0, 3));
                    })
                    .catch(error => {
                        console.error('Error fetching ratings:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching beers:', error);
        });
}

function formatNumberWithComma(number) {
    return number.toFixed(1).replace('.', ',');
}

function displayBestRatings(beers) {
    var beerContainer = document.getElementById("beer-table-likes");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Naam</td>
            <td class="beer-name">Brouwer</td>
            <td class="beer-name">Beoordeling</td>
            
        `;

    beerContainer.appendChild(header);

    if (beers.length > 0) {
        beers.forEach(function (beer) {
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td>${beer.name}</td>
                    <td>${beer.brewer}</td>
                    <td><i class="fa-solid fa-star"></i> ${formatNumberWithComma(parseFloat(beer.average_rating))}</td>
                    
                `;
            beerTile.onclick = function () {
                window.location.href = "beers/show.html?id=" + beer.beer_id;
            };
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>Geen bier gevonden</p>";
    }
}

function displayBestBrewers(brewers) {
    var beerContainer = document.getElementById("beer-table-brewers");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Brouwer</td>
            <td class="beer-name">Gemiddelde</td>
            
        `;

    beerContainer.appendChild(header);

    if (brewers.length > 0) {
        brewers.forEach(function (brewer) {
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td>${brewer.brewer}</td>
                    <td><i class="fa-solid fa-star"></i> ${formatNumberWithComma(parseFloat(brewer.avgRating))}</td>
                    
                `;
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>Geen brouwers gevonden</p>";
    }
}

function displayBestTypes(types) {
    var beerContainer = document.getElementById("beer-table-types");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Type</td>
            <td class="beer-name">Gemiddelde</td>
            
        `;

    beerContainer.appendChild(header);

    if (types.length > 0) {
        types.forEach(function (type) {
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td>${type.type}</td>
                    <td><i class="fa-solid fa-star"></i> ${formatNumberWithComma(parseFloat(type.avgRating))}</td>
                    
                `;
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>Geen types gevonden</p>";
    }
}

function displayTopRatedBeers(beers) {
    var beerContainer = document.getElementById("beer-table-most");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Naam</td>
            <td class="beer-name">Aantal</td>
            
        `;

    beerContainer.appendChild(header);

    if (beers.length > 0) {
        beers.forEach(function (beer) {
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td>${beer.name}</td>
                    <td>${beer.numRatings}</td>
                    
                `;
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>Geen bier gevonden</p>";
    }
}
window.onload = fetchBeers;

var allBeers = [];

function fetchBeers() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/BierAPI/beers", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var beers = JSON.parse(xhr.responseText);

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

            displayBestBrewers(brewersWithAvgRating.slice(0, 10));

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

            displayBestTypes(typesWithAvgRating.slice(0, 10));

            beers.sort(function (a, b) {
                return b.average_rating - a.average_rating;
            });

            displayBestRatings(beers.slice(0, 10));


            beers.forEach(function (beer) {
                var ratingsXhr = new XMLHttpRequest();
                ratingsXhr.open("GET", "http://localhost/BierAPI/comments/" + beer.beer_id, true);
                ratingsXhr.onreadystatechange = function () {
                    if (ratingsXhr.readyState === 4 && ratingsXhr.status === 200) {
                        var ratings = JSON.parse(ratingsXhr.responseText);
                        beer.numRatings = ratings.length || 0;

                        beers.sort(function (a, b) {
                            return b.numRatings - a.numRatings;
                        });

                        displayTopRatedBeers(beers.slice(0, 10));
                    }
                };
                ratingsXhr.send();
            });






        }
    };
    xhr.send();
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
            <td class="beer-name">Name</td>
            <td class="beer-name">Brouwer</td>
            <td class="beer-name">Rating</td>
            
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
        beerContainer.innerHTML = "<p>No beers found</p>";
    }
}


function displayBestBrewers(brewers) {
    var beerContainer = document.getElementById("beer-table-brewers");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Brouwer</td>
            <td class="beer-name">Average</td>
            
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
        beerContainer.innerHTML = "<p>No brewers found</p>";
    }
}




function displayBestTypes(types) {
    var beerContainer = document.getElementById("beer-table-types");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Type</td>
            <td class="beer-name">Average</td>
            
        `;

    beerContainer.appendChild(header);

    if (types.length > 0) {
        types.forEach(function (type) {
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td">${type.type}</td>
                    <td><i class="fa-solid fa-star"></i> ${formatNumberWithComma(parseFloat(type.avgRating))}</td>
                    
                `;
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>No types found</p>";
    }
}


function displayTopRatedBeers(beers) {
    var beerContainer = document.getElementById("beer-table-most");
    beerContainer.innerHTML = "";

    var header = document.createElement("tr");

    header.innerHTML =
        `
            <td class="beer-name">Name</td>
            <td class="beer-name">Count</td>
            
        `;

    beerContainer.appendChild(header);

    if (beers.length > 0) {
        beers.forEach(function (beer) {
            console.log(beer);
            var beerTile = document.createElement("tr");

            beerTile.innerHTML =
                `
                    <td">${beer.name}</td>
                    <td>${beer.numRatings}</td>
                    
                `;
            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>No beers found</p>";
    }
}
window.onload = fetchBeers;

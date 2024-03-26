
var allBeers = [];
function fetchBeers() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/BierAPI/beers", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var beers = JSON.parse(xhr.responseText);
            allBeers = beers;
            displayBeers(beers);
        }
    };
    xhr.send();
}
function logout() {
    fetch('http://localhost/BierAPI/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {

                console.log('Uitloggen gelukt.');

                window.location.href = '../beers/index.html';
            } else {
                console.error('Uitloggen is mislukt.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function formatNumberWithComma(number) {
    number = parseFloat(number);
    if (!isNaN(number)) {
        return number.toFixed(1).replace('.', ',');
    } else {
        return '0';
    }
}
function displayBeers(beers) {
    var beerContainer = document.getElementById("beer-container");
    beerContainer.innerHTML = "";
    if (beers.length > 0) {
        beers.forEach(function (beer) {
            var beerTile = document.createElement("div");
            beerTile.className = "beer-tile";
            beerTile.innerHTML =
                '<div class="rating-container">' +
                generateRatingStars(beer.average_rating, beer.id) + ' (' +
                formatNumberWithComma(beer.average_rating) + ")</div>" +
                '<h2 class="beer-name">' +
                beer.name +
                "</h2>" +
                "<p>Brouwer: " +
                beer.brewer +
                "</p>" +
                "<p>Type: " +
                beer.type +
                "</p>" +
                "<p>Gist: " +
                beer.yeast +
                "</p>" +
                "<p>Procent: " +
                beer.perc +
                "</p>" +
                "<p>Aankoopprijs: " +
                beer.purchase_price +
                "</p>";

            var beerNameElement = beerTile.querySelector('.beer-name');
            beerNameElement.onclick = function () {
                window.location.href = "show.html?id=" + beer.beer_id;
            };

            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>Geen bier gevonden</p>";
    }
}
function generateRatingStars(rating, beerId) {
    var stars = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star" data-rating="' + i + '" data-beer-id="' + beerId + '">★</span>';
        } else {
            stars += '<span class="star" data-rating="' + i + '" data-beer-id="' + beerId + '">☆</span>';
        }
    }
    return stars;
}
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus()
        .then(loggedIn => {
            if (loggedIn) {
                document.getElementById("login").style.display = "none";
                document.getElementById("logout").style.display = "inline";
            } else {
                document.getElementById("login").style.display = "inline";
                document.getElementById("logout").style.display = "none";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function checkLoginStatus() {
    return fetch('http://localhost/BierAPI/checkLogin')
        .then(response => response.json())
        .then(data => {
            return data.logged_in;
        });
}
function filterBeers() {
    var searchTerm = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();
    var filteredBeers = allBeers.filter(function (beer) {
        return beer.name.toLowerCase().includes(searchTerm);
    });
    displayBeers(filteredBeers);
}

var sortByPercentageAscending = true;
var sortByRatingAscending = true;

// Sort by percentage
function sortByPercentage(beers) {
    beers.sort(function(a, b) {
        if (sortByPercentageAscending) {
            return parseFloat(a.perc) - parseFloat(b.perc);
        } else {
            return parseFloat(b.perc) - parseFloat(a.perc);
        }
    });
    sortByPercentageAscending = !sortByPercentageAscending;
    sortByRatingAscending = true; // Reset sorting order for rating
    displayBeers(beers);
}

// Sort by rating
function sortByRating(beers) {
    beers.sort(function(a, b) {
        if (sortByRatingAscending) {
            return parseFloat(a.average_rating) - parseFloat(b.average_rating);
        } else {
            return parseFloat(b.average_rating) - parseFloat(a.average_rating);
        }
    });
    sortByRatingAscending = !sortByRatingAscending;
    sortByPercentageAscending = true; // Reset sorting order for percentage
    displayBeers(beers);
}

window.onload = fetchBeers;
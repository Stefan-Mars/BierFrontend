var allBeers = [];

function fetchBeers() {
    axios.get("http://localhost/BierAPI/beers")
        .then(response => {
            allBeers = response.data;
            displayBeers(allBeers);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function logout() {
    axios.post('http://localhost/BierAPI/logout', null, {
        withCredentials: true
    })
        .then(response => {
            if (response.status === 200) {
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

function formatNumberWithComma(number, numbersafterComma) {
    number = parseFloat(number);
    if (!isNaN(number)) {
        return number.toFixed(numbersafterComma).replace('.', ',');
    } else {
        return '0';
    }
}
function DecimalToPercentage(number) {
    let percentage = number * 100;
    return percentage;
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
                formatNumberWithComma(beer.average_rating, 1) + ")</div>" +
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
                formatNumberWithComma(DecimalToPercentage(beer.perc), 1) +
                "%</p>" +
                "<p>Aankoopprijs: €" +
                formatNumberWithComma(beer.purchase_price, 2) +
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
    return axios.get('http://localhost/BierAPI/checkLogin')
        .then(response => {
            if (response.data.logged_in) {

                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
    beers.sort(function (a, b) {
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
    beers.sort(function (a, b) {
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

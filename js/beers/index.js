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
                "%</p>" +
                "<p>Aankoopprijs: €" +
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
    return axios.get('http://localhost/BierAPI/checkLogin')
        .then(response => response.data.logged_in)
        .catch(error => {
            console.error('Error:', error);
            return false;
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

window.onload = fetchBeers;

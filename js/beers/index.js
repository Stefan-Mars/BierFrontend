
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

                console.log('Logout successful.');

                window.location.href = '../beers/index.html';
            } else {
                console.error('Logout failed.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
                generateRatingStars(beer.rating, beer.id) +
                "</div>"+
                '<h2 class="beer-name">' +
                beer.name +
                "</h2>" +
                "<p>Brewer: " +
                beer.brewer +
                "</p>" +
                "<p>Type: " +
                beer.type +
                "</p>" +
                "<p>Yeast: " +
                beer.yeast +
                "</p>" +
                "<p>Percentage: " +
                beer.perc +
                "</p>" +
                "<p>Purchase Price: " +
                beer.purchase_price +
                "</p>";

            var beerNameElement = beerTile.querySelector('.beer-name');
            beerNameElement.onclick = function () {
                window.location.href = "show.html?id=" + beer.id;
            };

            beerContainer.appendChild(beerTile);
        });
    } else {
        beerContainer.innerHTML = "<p>No beers found</p>";
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
window.onload = fetchBeers;
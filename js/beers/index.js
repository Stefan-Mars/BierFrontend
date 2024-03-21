
    var allBeers = [];

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
function checkLoginStatus() {
    fetch('http://localhost/BierAPI/checkLogin')
    .then(response => response.json())
    .then(data => {
        if (data.logged_in) {
            
            document.getElementById('logout').style.display = 'block';
            document.getElementById('login').style.display = 'none';
            return true;
        } else {
           
            document.getElementById('login').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            return false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

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

function displayBeers(beers) {
    var beerContainer = document.getElementById("beer-container");
    beerContainer.innerHTML = "";
    if (beers.length > 0) {
        beers.forEach(function (beer) {
            var beerTile = document.createElement("div");
            beerTile.className = "beer-tile";
            beerTile.innerHTML =
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
                "</p>" +
                '<div class="rating-container">' +
                generateRatingStars(beer.rating) +
                "</div>";
            
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

function generateRatingStars(rating) {
    var stars = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star" data-rating="' + i + '">★</span>';
        } else {
            stars += '<span class="star" data-rating="' + i + '">☆</span>';
        }
    }
    return stars;
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


window.onload = function() {
    checkLoginStatus()
    fetchBeers()
};
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var id = getUrlParameter('id');

axios.get('http://localhost/BierAPI/beer/' + id)
    .then(function (response) {
        var beer = response.data;
        displayBeer(beer);
        fetchComments(id);
    })
    .catch(function (error) {
        console.error('Error fetching beer:', error);
    });

function displayBeer(beer) {
    var beerInfo = document.getElementById('beer-info');
    beerInfo.innerHTML = '<h2>' + beer.name + ' ' + generateRatingStars(beer.average_rating) + '(' + formatNumberWithComma(beer.average_rating) + ')</h2>' +
        '<p>Brouwer: ' + beer.brewer + '</p>' +
        '<p>Type: ' + beer.type + '</p>' +
        '<p>Gist: ' + beer.yeast + '</p>' +
        '<p>Procent: ' + beer.perc + '</p>' +
        '<p>Aankoopprijs: ' + beer.purchase_price + '</p>';
}

function fetchComments(beerId) {
    axios.get('http://localhost/BierAPI/comments/' + beerId)
        .then(function (response) {
            var comments = response.data;
            displayComments(comments);
        })
        .catch(function (error) {
            console.error('Error fetching comments:', error);
        });
}

async function fetchUserName(userId) {
    try {
        const response = await axios.get('http://localhost/BierAPI/user/' + userId);
        return response.data.name;
    } catch (error) {
        console.error('Error fetching user name:', error);
        return 'Unknown';
    }
}

async function displayComments(comments) {
    var commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    if (comments.length > 0) {
        for (const comment of comments) {
            var listItem = document.createElement('div');
            listItem.classList = 'comment-card';
            var commentText = document.createElement('div');
            var stars = document.createElement('div');

            commentText.textContent = comment.note;

            try {
                const name = await fetchUserName(comment.user_id);
                stars.innerHTML = generateRatingStars(comment.stars) + '' + name;
            } catch (error) {
                console.error('Error fetching user name:', error);
                userName.textContent = 'By: Unknown';
            }

            listItem.appendChild(stars);
            listItem.appendChild(commentText);

            commentsList.appendChild(listItem);
        }
    } else {
        var noCommentsItem = document.createElement('li');
        noCommentsItem.textContent = 'Geen beoordelingen beschikbaar';
        commentsList.appendChild(noCommentsItem);
    }
}


function checkLoginStatus() {
    return fetch('http://localhost/BierAPI/checkLogin')
        .then(response => response.json())
        .then(data => {
            return data.logged_in;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function addComment() {
    var commentInput = document.getElementById('comment-input').value;
    var stars = document.querySelectorAll('.star');
    var rating = 0;
    stars.forEach(function (star) {
        if (star.classList.contains('filled')) {
            rating = parseInt(star.id[0]);
        }
    });

    axios.post('http://localhost/BierAPI/createComment', {
        beer_id: id,
        note: commentInput,
        rating: rating
    })
        .then(function (response) {

            var concatenatedJsonString = response.data;
            var jsonStrings = concatenatedJsonString.split('}{');


            jsonStrings.forEach(function (jsonString, index) {

                jsonString = (index > 0 ? '{' : '') + jsonString + (index < jsonStrings.length - 1 ? '}' : '');


                var jsonObj = JSON.parse(jsonString);

                if (jsonObj.message) {
                    fetchComments(id);
                    window.location.href = '../beers/index.html';
                } else if (jsonObj.error) {
                    alert('Error: ' + jsonObj.error);
                }
            });
        })
        .catch(function (error) {
            console.error('Error adding comment:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    var stars = document.querySelectorAll('.star');

    stars.forEach(function (star) {
        star.addEventListener('click', function () {
            var clickedRating = parseInt(this.id[0]);

            stars.forEach(function (star) {
                star.classList.remove('filled');
            });

            for (var i = 1; i <= clickedRating; i++) {
                document.getElementById(i + 'star').classList.add('filled');
            }

            console.log('Clicked rating: ' + clickedRating);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus()
        .then(loggedIn => {
            if (loggedIn) {
                document.getElementById("comment-input").style.display = "inline";
                document.getElementById("comment-button").style.display = "inline";


                document.getElementById("comment-login-text").style.display = "none";
            } else {
                document.getElementById("comment-input").style.display = "none";
                document.getElementById("comment-button").style.display = "none";

                document.getElementById("comment-login-text").style.display = "inline";
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
function formatNumberWithComma(number) {
    number = parseFloat(number);
    if (!isNaN(number)) {
        return number.toFixed(1).replace('.', ',');
    } else {
        return '0';
    }
}
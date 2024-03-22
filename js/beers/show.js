function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var id = getUrlParameter('id');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost/BierAPI/beer/' + id, true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var beer = JSON.parse(xhr.responseText);
        displayBeer(beer);
        fetchComments(id);
    }
};
xhr.send();
function formatNumberWithComma(number) {
    number = parseFloat(number);
    if (!isNaN(number)) {
        return number.toFixed(1).replace('.', ',');
    } else {
        return '0';
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
function displayBeer(beer) {
    var beerInfo = document.getElementById('beer-info');
    beerInfo.innerHTML = '<h2>' + beer.name + ' ' + generateRatingStars(beer.average_rating) + '(' + formatNumberWithComma(beer.average_rating) + ')</h2>' +
        '<p>Brewer: ' + beer.brewer + '</p>' +
        '<p>Type: ' + beer.type + '</p>' +
        '<p>Yeast: ' + beer.yeast + '</p>' +
        '<p>Percentage: ' + beer.perc + '</p>' +
        '<p>Purchase Price: ' + beer.purchase_price + '</p>';
}

function fetchComments(beerId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/BierAPI/comments/' + beerId, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var comments = JSON.parse(xhr.responseText);
            displayComments(comments);
        }
    };
    xhr.send();
}
async function fetchUserName(userId) {
    try {
        const response = await fetch('http://localhost/BierAPI/user/' + userId);
        const data = await response.json();
        return data.name;
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
        noCommentsItem.textContent = 'No reviews available';
        commentsList.appendChild(noCommentsItem);
    }
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

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/createComment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (response.message) {
                fetchComments(id);
            } else if (response.error) {
                alert('Error: ' + response.error);
            }
        }
    };
    xhr.send(JSON.stringify({ beer_id: id, note: commentInput, rating: rating }));
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
    return fetch('http://localhost/BierAPI/checkLogin')
        .then(response => response.json())
        .then(data => {
            return data.logged_in;
        });
}

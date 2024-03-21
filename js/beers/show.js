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

function displayBeer(beer) {
    var beerInfo = document.getElementById('beer-info');
    beerInfo.innerHTML = '<h2>' + beer.name + '</h2>' +
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
            fetchUserNames(comments);
        }
    };
    xhr.send();
}

function fetchUserNames(comments) {
    var userIds = Array.from(new Set(comments.map(comment => comment.user_id)));

    userIds.forEach(function (userId) {
        var userXhr = new XMLHttpRequest();
        userXhr.open('GET', 'http://localhost/BierAPI/user/' + userId, true);
        userXhr.onreadystatechange = function () {
            if (userXhr.readyState === 4 && userXhr.status === 200) {
                var user = JSON.parse(userXhr.responseText);
                comments.forEach(function (comment) {
                    if (comment.user_id === userId) {
                        comment.user_name = user.name; 
                    }
                });
                displayComments(comments);
            }
        };
        userXhr.send();
    });
}

function displayComments(comments) {
    var commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    if (comments.length > 0) {
        comments.forEach(function (comment) {
            var listItem = document.createElement('li');
            var commentText = document.createElement('div');
            commentText.textContent = comment.content;

            var userName = document.createElement('div');
            userName.textContent =  comment.user_name;

            listItem.appendChild(commentText);
            listItem.appendChild(userName);

            commentsList.appendChild(listItem);
        });
    } else {
        var noCommentsItem = document.createElement('li');
        noCommentsItem.textContent = 'No comments available';
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

    var userId = checkLoginStatus(); 
    if (!userId) {
        alert('Please log in to add a comment');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/createComment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.message) {
                    fetchComments(id);
                } else if (response.error) {
                    alert('Error: ' + response.error);
                }
            } else {

                alert('Error: ' + xhr.status);
            }
        }
    };
    

    xhr.send(JSON.stringify({ beer_id: id, content: commentInput, user_id: userId }));
}
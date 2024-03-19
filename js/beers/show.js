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
            displayComments(comments);
        }
    };
    xhr.send();
}

function displayComments(comments) {
    var commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    if (comments.length > 0) {
        comments.forEach(function (comment) {
            var listItem = document.createElement('li');
            listItem.textContent = comment.content;
            commentsList.appendChild(listItem);
        });
    } else {
        var noCommentsItem = document.createElement('li');
        noCommentsItem.textContent = 'No comments available';
        commentsList.appendChild(noCommentsItem);
    }
}

function addComment() {
    var commentInput = document.getElementById('comment-input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/createComment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.message) {
                fetchComments(id);
            } else if (response.error) {
                alert('Error: ' + response.error);
            }
        }
    };
    xhr.send(JSON.stringify({ beer_id: id, content: commentInput }));

}
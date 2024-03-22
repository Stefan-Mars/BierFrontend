
function checkLoginStatus() {

    fetch('http://localhost/BierAPI/checkLogin')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                console.log('User is logged in.');
            } else {
                console.log('User is not logged in.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




function registerUser(event) {
    event.preventDefault();

    var nameInput = document.getElementById('name').value;
    var emailInput = document.getElementById('email').value;
    var passwordInput = document.getElementById('password').value;

    if (!nameInput.trim() || !emailInput.trim() || !passwordInput.trim()) {
        alert("Please fill in all the fields.");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response['success']) {
                    alert('User registered successfully');
                    window.location.href = '../beers/index.html';

                } else if (response.error) {
                    alert('Error: ' + response.error);
                }
            } else {
                alert('Error: ' + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify({ name: nameInput, email: emailInput, password: passwordInput }));
}


function checkLoginStatus() {

    fetch('http://localhost/BierAPI/checkLogin')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                console.log(true);
            } else {
                console.log(false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function loginUser(event) {
    event.preventDefault();

    var emailInput = document.getElementById('email').value;
    var passwordInput = document.getElementById('password').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert('Succesvol ingelogd');
                        window.location.href = '../beers/index.html';
                    } else {
                        alert('Inloggen mislukt: ongeldig e-mailadres of wachtwoord');
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            } else {
                alert('Error: ' + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify({ email: emailInput, password: passwordInput }));
}

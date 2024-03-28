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

function loginUser(event) {
    event.preventDefault();

    var emailInput = document.getElementById('email').value;
    var passwordInput = document.getElementById('password').value;

    axios.post('http://localhost/BierAPI/login', {
        email: emailInput,
        password: passwordInput
    })
        .then(response => {
            if (response.data.success) {
                console.log(response.data);
                alert('Succesvol ingelogd');
                window.location.href = '../beers/index.html';
            } else {
                alert('Inloggen mislukt: ongeldig e-mailadres of wachtwoord');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.response.status);
        });
}

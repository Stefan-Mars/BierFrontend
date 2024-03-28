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

function registerUser(event) {
    event.preventDefault();

    var nameInput = document.getElementById('name').value;
    var emailInput = document.getElementById('email').value;
    var passwordInput = document.getElementById('password').value;

    if (!nameInput.trim() || !emailInput.trim() || !passwordInput.trim()) {
        alert("Please fill in all the fields.");
        return;
    }

    axios.post('http://localhost/BierAPI/register', {
        name: nameInput,
        email: emailInput,
        password: passwordInput
    })
        .then(response => {
            if (response.data.success) {
                alert('User registered successfully');
                window.location.href = '../beers/index.html';
            } else if (response.data.error) {
                alert('Error: ' + response.data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.response.status);
        });
}

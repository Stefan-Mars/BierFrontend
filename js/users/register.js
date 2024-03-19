function registerUser(event) {
    event.preventDefault();

    var nameInput = document.getElementById('name').value;
    var emailInput = document.getElementById('email').value;
    var passwordInput = document.getElementById('password').value;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/BierAPI/createUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.message) {
                    alert('User registered successfully. User ID: ' + response.user_id);
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
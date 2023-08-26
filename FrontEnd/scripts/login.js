const loginForm = document.getElementById('formLogin')
const email = document.getElementById('email')
const password = document.getElementById('password')

loginForm.addEventListener("submit", submitForm)

// submit user object in JSON 
async function submitForm(e) {
    e.preventDefault()
    let user = {
        email: email.value,
        password: password.value
    }
    console.log(user)
    try {
        const url = 'http://localhost:5678/api/users/login'
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
// SERVER STATUS RESPONSE OK
        if (res.status === 200) {
            const data = await res.json();
            const token = data.token;
        // save token(jeton d authentification) in local storage
            localStorage.setItem("token", JSON.stringify(token))
            window.location.href ="./index.html" 
// ERROR SERVER STATUS RESPONSE 
        } else if (res.status === 401) {
            alert("E-mail ou mot de passe incorrect")
        } else if (res.status === 404) {
            alert("Utilisateur non trouvé");
        }

// CATCH ERRORS
    } catch (error) {
        console.log('Une erreur est survenue lors de la connexion')
    }
}
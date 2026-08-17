const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");


registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check password

    if (password !== confirmPassword) {

        message.textContent =
            "❌ Passwords do not match.";

        message.style.color = "#dc2626";

        return;
    }


    // Get existing users

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    // Check email already exists

    const existingUser =
        users.find(user => user.email === email);


    if (existingUser) {

        message.textContent =
            "❌ Email already registered.";

        message.style.color = "#dc2626";

        return;
    }


    // Create new user

    const newUser = {

        name: name,
        email: email,
        password: password

    };


    // Add user

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    message.textContent =
        "✅ Registration successful!";

    message.style.color = "#16a34a";


    // Go to login page

    setTimeout(() => {

        window.location.href = "/";

    }, 1000);

});
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");


// Show / Hide Password
if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "👁";

        }

    });

}


// Login
if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;


        // Empty fields
        if (!email || !password) {

            message.textContent =
                "❌ Please enter email and password.";

            message.style.color = "#dc2626";

            return;
        }


        // Get registered users from Local Storage
        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Find matching user
        const user = users.find(function (user) {

            return (
                user.email.toLowerCase() === email &&
                user.password === password
            );

        });


        // Invalid login
        if (!user) {

            message.textContent =
                "❌ Invalid email or password.";

            message.style.color = "#dc2626";

            return;
        }


        // Login successful
        message.textContent =
            "✅ Login successful!";

        message.style.color = "#16a34a";


        // Save current logged-in user
        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        // Go to dashboard
        setTimeout(function () {

            window.location.href = "/dashboard";

        }, 800);

    });

}
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");

    // ==============================
    // MESSAGE
    // ==============================
    function showMessage(text, color) {
        if (!message) return;

        message.textContent = text;
        message.style.color = color;
    }


    // ==============================
    // PASSWORD SHOW / HIDE
    // ==============================
    function setupPasswordToggle(toggleId, inputId) {

        const toggleBtn = document.getElementById(toggleId);
        const passwordField = document.getElementById(inputId);

        if (!toggleBtn || !passwordField) {
            console.error(
                "Not found:",
                toggleId,
                inputId
            );
            return;
        }

        toggleBtn.addEventListener("click", function (event) {

            event.preventDefault();

            if (passwordField.type === "password") {

                passwordField.type = "text";
                toggleBtn.textContent = "🙈";

            } else {

                passwordField.type = "password";
                toggleBtn.textContent = "👁";

            }
        });
    }


    // Password
    setupPasswordToggle(
        "togglePassword",
        "password"
    );

    // Confirm Password
    setupPasswordToggle(
        "toggleConfirmPassword",
        "confirmPassword"
    );


    // ==============================
    // REGISTER FORM
    // ==============================
    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nameInput =
                document.getElementById("name");

            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");

            const confirmPasswordInput =
                document.getElementById("confirmPassword");


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim().toLowerCase();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            // Empty fields
            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "❌ Please fill in all required fields.",
                    "#dc2626"
                );

                return;
            }


            // Password match
            if (password !== confirmPassword) {

                showMessage(
                    "❌ Passwords do not match.",
                    "#dc2626"
                );

                return;
            }


            // Get users
            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            // Check email
            const emailExists = users.some(
                user =>
                    user.email.toLowerCase() === email
            );


            if (emailExists) {

                showMessage(
                    "❌ This email is already registered. Please log in.",
                    "#dc2626"
                );

                return;
            }


            // Create user
            const newUser = {
                name: name,
                email: email,
                password: password
            };


            users.push(newUser);


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            // Success
            showMessage(
                "✅ Registration successful! Redirecting to login...",
                "#16a34a"
            );


            setTimeout(function () {
                window.location.href = "/";
            }, 1000);

        });
    }

});
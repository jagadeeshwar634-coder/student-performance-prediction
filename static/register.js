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


    setupPasswordToggle(
        "togglePassword",
        "password"
    );


    setupPasswordToggle(
        "toggleConfirmPassword",
        "confirmPassword"
    );


    // ==============================
    // REGISTER FORM
    // ==============================

    if (!registerForm) {
        console.error("Register form not found!");
        return;
    }


    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // ==============================
        // GET VALUES
        // ==============================

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


        // ==============================
        // VALIDATION
        // ==============================

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


        if (password !== confirmPassword) {

            showMessage(
                "❌ Passwords do not match.",
                "#dc2626"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "❌ Password must be at least 6 characters.",
                "#dc2626"
            );

            return;
        }


        // ==============================
        // SEND DATA TO FASTAPI
        // ==============================

        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);


            const response = await fetch("/register", {

                method: "POST",

                body: formData

            });


            const result = await response.json();


            // ==============================
            // SUCCESS
            // ==============================

            if (response.ok) {

                showMessage(
                    "✅ Registration successful! Redirecting to login...",
                    "#16a34a"
                );


                setTimeout(function () {

                    window.location.href = "/";

                }, 1000);


                return;
            }


            // ==============================
            // SERVER ERROR
            // ==============================

            showMessage(
                "❌ " +
                (
                    result.detail ||
                    "Registration failed."
                ),
                "#dc2626"
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "❌ Cannot connect to server.",
                "#dc2626"
            );

        }

    });

});
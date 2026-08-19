const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");


function showMessage(text, color) {
    if (!message) return;

    message.textContent = text;
    message.style.color = color;
}


// =========================
// SHOW / HIDE PASSWORD
// =========================

if (togglePassword && passwordInput) {

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


// =========================
// LOGIN
// =========================

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const emailInput = document.getElementById("email");

        const email = emailInput
            ? emailInput.value.trim().toLowerCase()
            : "";

        const password = passwordInput
            ? passwordInput.value
            : "";


        // Validation
        if (!email || !password) {

            showMessage(
                "❌ Please enter both email and password.",
                "#dc2626"
            );

            return;
        }


        try {

            // Create form data
            const formData = new FormData();

            formData.append("email", email);
            formData.append("password", password);


            // Debug
            console.log("EMAIL SENT:", email);
            console.log("PASSWORD LENGTH:", password.length);


            // Send request to FastAPI
            const response = await fetch("/login", {

                method: "POST",
                body: formData

            });


            const data = await response.json();


            console.log("LOGIN STATUS:", response.status);
            console.log("LOGIN RESPONSE:", data);


            // Login failed
            if (!response.ok) {

                showMessage(
                    "❌ " + (data.detail || "Invalid email or password"),
                    "#dc2626"
                );

                return;
            }


            // Login successful
            showMessage(
                "✅ Login successful! Redirecting...",
                "#16a34a"
            );


            // Save logged-in user
            sessionStorage.setItem(
                "currentUser",
                JSON.stringify({
                    name: data.name,
                    email: data.email
                })
            );


            // Redirect to dashboard
            setTimeout(function () {

                window.location.href = "/dashboard";

            }, 800);

        }


        catch (error) {

            console.error("Login error:", error);

            showMessage(
                "❌ Unable to connect to server.",
                "#dc2626"
            );

        }

    });

}
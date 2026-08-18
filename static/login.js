
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");


const showMessage = (text, color) => {
    if (!message) return;
    message.textContent = text;
    message.style.color = color;
};


if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.textContent = isPassword ? "🙈" : "👁";
    });
}


if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            showMessage("❌ Please enter both email and password.", "#dc2626");
            return;
        }

        
        const users = JSON.parse(localStorage.getItem("users")) || [];

        
        const matchedUser = users.find(
            (user) => user.email.toLowerCase() === email && user.password === password
        );

        
        if (!matchedUser) {
            showMessage("❌ Invalid email or password. Please try again.", "#dc2626");
            return;
        }

        
        showMessage("✅ Login successful! Redirecting...", "#16a34a");

       
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));

        
        setTimeout(() => {
            window.location.href = "/dashboard"; 
        }, 800);
    });
}
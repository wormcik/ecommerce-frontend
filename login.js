API_URL = window.location.origin.includes("localhost")
  ? "http://localhost:3000/api"
  : "https://ecommerce-backend-x6ce.onrender.com/api";


function goToHomePage() {
    window.location.href = 'index.html'; 
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (res.ok) {
                    window.localStorage.setItem("isLoggedIn", "true");
                    window.localStorage.setItem("username", data.user.username);
                    window.localStorage.setItem("_id", data.user._id);
                    window.localStorage.setItem("isAdmin", data.user.role === "admin" ? "true" : "false");
                    window.location.href = "index.html";
                } else {
                    alert(data.error || "Login failed! Please check your credentials.");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Server error! Please try again.");
            }
        });
    }
});

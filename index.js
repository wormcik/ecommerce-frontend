API_URL = window.location.origin.includes("localhost")
  ? "http://localhost:3000/api"
  : "https://ecommerce-backend-x6ce.onrender.com/api";


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const adminLink = document.getElementById('adminLink');
    const userLink = document.getElementById('userLink');

    const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = window.localStorage.getItem("isAdmin") === "true";
    const isUser = window.localStorage.getItem("isAdmin") === "false";

    if (isLoggedIn) {
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";

        if (isAdmin) {
            adminLink.style.display = "inline-block"; 
        } else {
            adminLink.style.display = "none"; 
        }
        if (isUser) {
            userLink.style.display = "inline-block"; 
        }
        else {
            userLink.style.display = "none"; 
        }

        logoutButton.addEventListener('click', () => {
            window.localStorage.removeItem("isLoggedIn");
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("isAdmin");
            window.location.href = "index.html";
        });
    } else {
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";

        loginButton.addEventListener('click', () => {
            window.location.href = "login.html";
        });
    }

    adminLink.addEventListener('click', () => {
        window.location.href = "admin.html";
    });

    userLink.addEventListener('click', () => {
        window.location.href = "user.html";
    });
});

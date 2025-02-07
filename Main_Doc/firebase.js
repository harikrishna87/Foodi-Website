// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyetys4GdfpUmMjfxM_ZIba-M0bsh5Oxk",
    authDomain: "e-commerce-4d2e0.firebaseapp.com",
    projectId: "e-commerce-4d2e0",
    storageBucket: "e-commerce-4d2e0.appspot.com",
    messagingSenderId: "328659694803",
    appId: "1:328659694803:web:ad569d146b5926c412d026"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const BLOCK_TIME = 24 * 60 * 60 * 1000;

function shouldBlockBackNavigation() {
    const loginTime = localStorage.getItem("loginTimestamp");
    if (loginTime) {
        const elapsedTime = Date.now() - parseInt(loginTime, 10);
        return elapsedTime < BLOCK_TIME;
    }
    return false;
}

function saveLoginTimestamp() {
    localStorage.setItem("loginTimestamp", Date.now().toString());
}

window.onload = function () {
    const isLoggedIn = localStorage.getItem("loggedInUserId");
    if ((window.location.pathname === "/" || window.location.pathname.includes("index.html")) && isLoggedIn) {
        window.location.replace("home.html");
        return;
    }

    if (shouldBlockBackNavigation()) {
        history.pushState(null, null, window.location.href);
        sessionStorage.setItem("blockBack", "true");
    }

    window.onpopstate = function () {
        if (sessionStorage.getItem("blockBack") === "true" && shouldBlockBackNavigation()) {
            location.replace(window.location.href);
        }
    };
};

function logout() {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loginTimestamp");
    window.location.href = "index.html";
}



// Show message function
function showmessage(message, divId) {
    const messagediv = document.getElementById(divId);
    if (messagediv) {
        messagediv.style.display = "block";
        messagediv.innerHTML = message;
        messagediv.style.opacity = 1;
        messagediv.style.transition = "opacity 1s ease-out";

        setTimeout(function () {
            messagediv.style.opacity = 0;
            setTimeout(() => {
                messagediv.style.display = "none";
            }, 1500);
        }, 3000);
    }
}

// Sign Up with Email and Password
const signupBtn = document.querySelector(".signup-btn");
signupBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const fullname = document.getElementById("signup_username").value.trim();
    const email = document.getElementById("signup_email").value.trim();
    const password = document.getElementById("signup_password").value.trim();
    const passwordError = document.getElementById("password_error");
    const emailError = document.getElementById("email_error");

    // Email & Password Validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$^&*!])[A-Za-z0-9\d@#$^&*!]{8,}$/.test(password);

    if (!validateEmail(email)) {
        emailError.textContent = "Invalid email format!";
        emailError.style.color = "red";
        emailError.style.display = "block";
        return;
    } else {
        emailError.style.display = "none";
    }

    if (!validatePassword(password)) {
        passwordError.textContent = "Password must be 8+ chars, including A-Z, 0-9, and special chars!";
        passwordError.style.color = "red";
        passwordError.style.display = "block";
        return;
    } else {
        passwordError.style.display = "none";
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            const userData = {
                Email: email,
                Full_Name: fullname
            };

            showmessage("Account Created Successfully", "signupmessage");

            return setDoc(doc(db, "users", user.uid), userData);
        })
        .then(() => {
            showmessage("Redirecting to login...", "signupmessage");
            setTimeout(() => {
                location.replace("index.html");
            }, 2000);
        })
        .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                showmessage("Email already exists!", "signupmessage");
            } else {
                showmessage("An error occurred. Please try again.", "signupmessage");
            }
        });
});

// Login with Email and Password
const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            localStorage.setItem('loggedInUserId', user.uid);
            showmessage('Login successful!', 'loginmessage');
            setTimeout(() => {
                location.replace("home.html");
            }, 2000);
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                showmessage('Incorrect Email or Password', 'loginmessage');
            } else {
                showmessage('Account does not exist!', 'loginmessage');
            }
        });
});

// Toggle password visibility for login form
document.getElementById('icon').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
});

// Toggle password visibility for signup form
document.getElementById('icon1').addEventListener('click', function () {
    const signupPasswordField = document.getElementById('signup_password');
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
    signupPasswordField.type = signupPasswordField.type === 'password' ? 'text' : 'password';
});

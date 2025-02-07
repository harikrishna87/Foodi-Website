// Import the functions you need from the SDKs you need
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

// // Prevent accessing login page after successful login
// if (window.location.pathname.includes("index.html") && localStorage.getItem("loggedInUserId")) {
//     window.location.href = "home.html";
// }

// // Prevent navigating back to the login page after login
// window.onload = function () {
//     history.pushState(null, null, window.location.href);
//     window.onpopstate = function () {
//         history.go(1);
//     };
// };



// Show Message Function
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

// SignUp with Email and Password
const signup = document.querySelector(".signup-btn");
signup.addEventListener("click", (event) => {
    event.preventDefault();

    const fullname = document.getElementById("signup_username");
    const email = document.getElementById("signup_email");
    const password = document.getElementById("signup_password");
    const passwordError = document.getElementById("password_error");
    const emailError = document.getElementById("email_error"); 

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$^&*!])[A-Za-z0-9\d@#$^&*!]{8,}$/;
        return regex.test(password);
    };

    if (!validateEmail(email.value)) {
        emailError.style.display = "block";
        emailError.innerHTML = "Please enter a valid email address (e.g., example@domain.com)";
        emailError.style.color = "red";
        return;
    } else {
        emailError.style.display = "none";
    }

    if (!validatePassword(password.value)) {
        passwordError.style.display = "block";
        passwordError.innerHTML =
            "Password must contain at least 8 char, including a-z, A-Z, 0-9, and @#$^&*!";
        passwordError.style.color = "red";
        return;
    } else {
        passwordError.style.display = "none";
    }

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredentials) => {
            const user = userCredentials.user;
            const userData = {
                Email: email.value,
                Full_Name: fullname.value
            };

            showmessage("Account Created Successfully", "signupmessage");

            const docRef = doc(db, "users", user.uid);
            return setDoc(docRef, userData);
        })
        .then(() => {
            showLoginForm();
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
                showmessage("Email already exists!", "signupmessage");
            } else {
                showmessage("An error occurred. Please try again.", "signupmessage");
            }
        })
        .finally(() => {
            fullname.value = '';
            email.value = '';
            password.value = '';
        });
});

// Login with Email and Password
const login = document.querySelector(".login-btn");
login.addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredentials) => {
            showmessage('Login is successful', 'loginmessage');
            const user = userCredentials.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showmessage('Incorrect Email or Password', 'loginmessage');
            } else {
                showmessage('Account does not exist!!', 'loginmessage');
            }
        })
        .finally(() => {
            email.value = '';
            password.value = '';
        });
});

// Redirect to home page if already logged in
if ((window.location.pathname === "/" || window.location.pathname.includes("index.html")) && localStorage.getItem("loggedInUserId")) {
    window.location.replace("home.html");
}

// Prevent navigating back to the login page after login
window.onload = function () {
    history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        location.replace(location.href);
    };
};

// Logout function
function logout() {
    localStorage.removeItem("loggedInUserId"); // Remove login flag
    window.location.href = "index.html";
}

// Toggle password visibility in the login form
document.getElementById('icon').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const icon = document.getElementById('icon');

    if (passwordField) {
        passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
        icon.classList.toggle('fa-eye-slash');
        icon.classList.toggle('fa-eye');
    }
});

// Toggle password visibility in the signup form
document.getElementById('icon1').addEventListener('click', function () {
    const signupPasswordField = document.getElementById('signup_password');
    const icon1 = document.getElementById('icon1');

    if (signupPasswordField) {
        signupPasswordField.type = signupPasswordField.type === 'password' ? 'text' : 'password';
        icon1.classList.toggle('fa-eye-slash');
        icon1.classList.toggle('fa-eye');
    }
});

// Import the necessary Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Profile Picture Upload
const imageInput = document.getElementById('imageUpload');
const avatarImg = document.getElementById('userAvatar');

function initializeUserAvatar() {
    const userEmail = document.getElementById('loggeduseremail').textContent.trim();
    const savedImage = localStorage.getItem(`userAvatar_${userEmail}`);
    avatarImg.src = savedImage || "https://i.pinimg.com/564x/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.jpg";
}

imageInput.addEventListener('change', (event) => {
    const userEmail = document.getElementById('loggeduseremail').textContent.trim();
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarImg.src = e.target.result;
            localStorage.setItem(`userAvatar_${userEmail}`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Auth State Change Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        localStorage.setItem("loggedInUserId", loggedInUserId);
        loadUserData(loggedInUserId);
    } else {
        console.log("No user logged in.");
    }
});

// Load User Data
async function loadUserData(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("loggedusername").innerText = userData.Full_Name;
        document.getElementById("loggeduseremail").innerText = userData.Email;
        initializeUserAvatar();
        updateCartCount(userId); // Initialize cart count
    } else {
        console.error("No document found for the logged-in user.");
    }
}

// Logout Functionality
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out.",
                icon: "warning",
                iconColor: "red",
                showCancelButton: true,
                confirmButtonColor: "rgb(54, 241, 54)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Logout",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    signOut(auth)
                        .then(() => {
                            localStorage.removeItem("loggedInUserId");
                            Swal.fire({
                                title: "Logged Out",
                                text: "You have successfully logged out.",
                                icon: "success",
                                iconColor: "green"
                            }).then(() => {
                                window.location.href = "index.html";
                            });
                        })
                        .catch((error) => {
                            console.error("Error Signing Out:", error);
                            Swal.fire({
                                title: "Error",
                                text: "Something went wrong while logging out.",
                                icon: "error",
                                iconColor: "red",
                            });
                        });
                }
            });
        });
    }
});

// Cards Container and Pagination
const cardsContainer = document.getElementById("cards");
const paginationContainer = document.getElementById("pagination");
const filterButtons = document.querySelectorAll(".filter button");
const itemsPerPage = 8;
let currentPage = 1;
let products = [];
let filteredProducts = [];

// Initialize Cards
async function cardsContainerInit() {
    try {
        const response = await fetch("https://json-data-b2bn.onrender.com/products");
        products = await response.json();
        filteredProducts = [...products];
        renderPagination();
        renderCards(currentPage);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Render Cards
function renderCards(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    cardsContainer.innerHTML = "";

    currentProducts.forEach((product) => {
        const cardHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="cards_content">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="cards_content1">
                        <h5>${product.title}</h5>
                        <h6><i class='bx bxs-star' style="color: yellow"></i> ${product.rating.rate}</h6>
                    </div>
                    <div class="cards_content2">
                        <h5>₹ ${product.price}</h5>
                        <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">Add To Cart</button>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += cardHTML;
    });

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", addToCart);
    });
}

// Add to Cart
async function addToCart(event) {
    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
        Swal.fire({
            title: "Please Log In",
            text: "You need to log in to add items to the cart.",
            icon: "warning",
        });
        return;
    }

    const productId = event.target.getAttribute("data-id");
    const productTitle = event.target.getAttribute("data-title");
    const productPrice = event.target.getAttribute("data-price");
    const productImage = event.target.getAttribute("data-image");

    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const existingCartItems = cartData.cart || [];
        const itemAlreadyInCart = existingCartItems.some(item => item.id === productId);

        if (itemAlreadyInCart) {
            Swal.fire({
                title: "Item Already in Cart",
                text: `This ${productTitle} is already in your cart`,
                icon: "info",
            });
        } else {
            await updateDoc(cartRef, {
                cart: arrayUnion({
                    id: productId,
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                })
            });
            Swal.fire({
                title: "Item Added",
                text: `The ${productTitle} has been added to your cart`,
                icon: "success",
                iconColor: "rgb(54, 241, 54)"
            });
        }
    } else {
        await setDoc(cartRef, {
            cart: [{
                id: productId,
                title: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            }]
        });
        Swal.fire({
            title: "Item Added",
            text: `The ${productTitle} has been added to your cart`,
            icon: "success",
            iconColor: "rgb(54, 241, 54)"
        });
    }

    updateCartCount(userId);
}

// Update Cart Count
async function updateCartCount(userId) {
    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const itemCount = cartData.cart ? cartData.cart.length : 0;
        document.getElementById("count").innerText = itemCount;
    } else {
        document.getElementById("count").innerText = 0;
    }
}

// Render pagination for products
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    paginationContainer.innerHTML = "";

    const pagesToShow = 5;
    const startPage = Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    const prevButton = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;
    paginationContainer.innerHTML += prevButton;

    for (let i = startPage; i <= endPage; i++) {
        const pageItem = `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
        paginationContainer.innerHTML += pageItem;
    }

    const nextButton = `
        <li class="page-item">
            <a class="page-link" href="#" data-page="${currentPage === totalPages ? 1 : currentPage + 1}">Next</a>
        </li>
    `;
    paginationContainer.innerHTML += nextButton;

    document.querySelectorAll(".page-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = parseInt(e.target.getAttribute("data-page"));
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
            } else if (page === 1) {
                currentPage = 1;
            }
            renderCards(currentPage);
            renderPagination();
        });
    });
}


// Product Filters
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.textContent.toLowerCase();

        if (category === "all") {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter((product) => product.category.toLowerCase() === category);
        }

        currentPage = 1;
        renderPagination();
        renderCards(currentPage);
    });
});

// Initialize
cardsContainerInit();



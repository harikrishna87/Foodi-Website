// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// Profile picture upload functionality

const imageInput = document.getElementById('imageUpload');
const avatarImg = document.getElementById('userAvatar');

function initializeUserAvatar() {
    const userEmail = document.getElementById('loggeduseremail').textContent.trim();
    const savedImage = localStorage.getItem(`userAvatar_${userEmail}`);
    if (savedImage) {
        avatarImg.src = savedImage;
    } else {
        avatarImg.src = "https://i.pinimg.com/564x/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.jpg";
    }
}

imageInput.addEventListener('change', (event) => {
    const userEmail = document.getElementById('loggeduseremail').textContent.trim();
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarImg.src = e.target.result;
            localStorage.setItem(`userAvatar_${userEmail}`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById("loggedusername").innerText = userData.Full_Name;
                    document.getElementById("loggeduseremail").innerText = userData.Email;
                    initializeUserAvatar();
                } else {
                    console.error("No document found matching Id");
                }
            })
            .catch((error) => {
                console.error("Error retrieving document:", error);
            });
    } else {
        console.log("User ID not found in Local Storage");
    }
});

//Logout Functinality...
document.addEventListener("DOMContentLoaded", () => {
    const logoutbutton = document.getElementById("logout");

    if (logoutbutton) {
        logoutbutton.addEventListener("click", () => {
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
                                iconColor: "rgb(54, 241, 54)"
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
                } else {
                    Swal.fire({
                        title: "Cancelled",
                        text: "You are still logged in.",
                        icon: "info",
                        iconColor: "blue",
                    });
                }
            });
        });
    }
});

/*============== Typing Animation ===============*/
var typed = new Typed(".typing", {
    strings: ["", " Anuradha Restaurant "],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 500,
    loop: true
});

const menu_items = document.querySelector(".card1__button");
menu_items.addEventListener("click", () => {
    window.location.href = "menu.html"
});

// Cards Container and Pagination
const cardsContainer = document.getElementById("cards");
let products = [];
let filteredProducts = [];


async function cardsContainerInit() {
    try {
        products = [
            {
                "id": 1,
                "title": "Chicken Biryani",
                "price": 199,
                "category": "NonVeg",
                "image": "https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=",
                "rating": {
                    "rate": 4.2,
                    "count": 120
                }
            },
            {
                "id": 2,
                "title": "Sambar",
                "price": 49,
                "category": "Veg",
                "image": "https://media.istockphoto.com/id/1452451511/photo/sambar-a-mixed-vegetarian-curry-arranged-on-a-wooden-bowl-on-a-wooden-background-sambar-is.jpg?s=612x612&w=0&k=20&c=ixBVSR6wjq4-015bbLJuUbAk5lRB3utAwKVVBMmo-E4=",
                "rating": {
                    "rate": 3.9,
                    "count": 120
                }
            },
            {
                "id": 3,
                "title": "Fruits",
                "price": 249,
                "category": "Veg",
                "image": "https://media.istockphoto.com/id/1273378551/photo/set-of-summer-fruits-and-berries-in-wooden-serving.jpg?s=612x612&w=0&k=20&c=XtJFQDgpV_AsG3aFzo3FVN2pmbey7h0jWHMzlHWJ5Kk=",
                "rating": {
                    "rate": 3.9,
                    "count": 470
                }
            },
            {
                "id": 4,
                "title": "Red Velvet Cake",
                "price": 550,
                "category": "Desserts",
                "image": "https://media.istockphoto.com/id/1414371761/photo/close-up-image-of-whole-red-velvet-cake-covered-with-butter-cream-decorated-with-piped-icing.jpg?s=612x612&w=0&k=20&c=rAmznB1366xVy7XS4HFlyA1hV5oE8-foTiRgN7aBzpQ=",
                "rating": {
                    "rate": 4.5,
                    "count": 319
                }
            },
            {
                "id": 5,
                "title": "Gulab Jamun",
                "price": 89,
                "category": "Desserts",
                "image": "https://media.istockphoto.com/id/1194662949/photo/indian-dessert-or-sweet-dish-gulab-jamun-in-white-bowl-on-yellow-background.jpg?s=612x612&w=0&k=20&c=XAOQkQC-Mu-XXviGtWU6NTz8vZzT1sY0oaJQ4jWo2Fo=",
                "rating": {
                    "rate": 4.1,
                    "count": 340
                }
            },
            {
                "id": 6,
                "title": "Mango IceCream",
                "price": 179,
                "category": "IceCream",
                "image": "https://hot-thai-kitchen.com/wp-content/uploads/2016/06/mango-ice-cream-blog.jpg",
                "rating": {
                    "rate": 3.8,
                    "count": 250
                }
            },
            {
                "id": 7,
                "title": "Mango Juice",
                "price": 40,
                "category": "Fruit Juice",
                "image": "https://cdn1.foodviva.com/static-content/food-images/juice-recipes/mango-juice/mango-juice.jpg",
                "rating": {
                    "rate": 3.6,
                    "count": 145
                }
            },
            {
                "id": 8,
                "title": "Chicken Pizza",
                "price": 249,
                "category": "Pizzas",
                "image": "https://www.yummytummyaarthi.com/wp-content/uploads/2015/11/chicken-pizza-1-500x500.jpeg",
                "rating": {
                    "rate": 2.9,
                    "count": 340
                }
            }
        ]
        filteredProducts = [...products];
        renderCards();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function renderCards() {
    cardsContainer.innerHTML = "";

    filteredProducts.forEach((product) => {
        const cardHTML = `
            <div class="col-12 col-sm-6 col-lg-3 mb-4">
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

async function updateCartCount(userId) {
    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const cartCount = cartData.cart ? cartData.cart.length : 0;
        document.getElementById("count").textContent = cartCount;
    }
}

window.addEventListener('load', async () => {
    const userId = localStorage.getItem("loggedInUserId");
    if (userId) {
        await updateCartCount(userId);
    }
});

// Initialize
cardsContainerInit();

let modal = new bootstrap.Modal(document.getElementById('myModal3'));

function showModal() {
  modal.show();
}

function closeModal() {
  modal.hide();
}

modal._element.addEventListener("click", (event) => {
  if (event.target === modal._element) {
    closeModal();
  }
});

setTimeout(() => {
  showModal();
}, 1000);



if ("geolocation" in navigator) {
    let watchId = navigator.geolocation.watchPosition(
        (position) => {
            console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
        },
        (error) => {
            console.error("Error getting location: ", error.message);
        }
    );
    
    setTimeout(() => navigator.geolocation.clearWatch(watchId), 30000);
} else {
    console.log("Geolocation is not supported by this browser.");
}
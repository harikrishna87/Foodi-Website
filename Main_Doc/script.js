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

const menu_items = document.querySelectorAll(".card1__button");

menu_items.forEach(menu => {
    menu.addEventListener("click", () => {
        window.location.href = "menu.html"
    })
})

// Cards Container and Pagination
const cardsContainer = document.getElementById("cards");
const paginationContainer = document.getElementById("pagination");
const itemsPerPage = 8;
let currentPage = 1;
let products = [];
let filteredProducts = [];


async function cardsContainerInit() {
    try {
        // const response = await fetch("https://json-data-b2bn.onrender.com/products");
        // products = await response.json();
        products =  [
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
                  "title": "Mutton Biryani",
                  "price": 299,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1430345748/photo/biryani-overhead-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=St2EEaWdaC6cLC6oSIV2wwo8taRRyta7H90NeYSWojc=",
                  "rating": {
                    "rate": 4.1,
                    "count": 259
                  }
                },
                {
                    "id": 3,
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
                    "id": 4,
                    "title": "Gobi Manchurian",
                    "price": 129,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1333972712/photo/cabbage-manchurian.jpg?s=612x612&w=0&k=20&c=eKpR7SsmS-UXJKoW5vUNyC0O5ZPK3fMGkCts6uUbc4E=",
                    "rating": {
                      "rate": 4.1,
                      "count": 259
                    }
                  },
                  {
                    "id": 5,
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
                    "id": 6,
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
                    "id": 7,
                    "title":"Butter Sortch Cake",
                    "price": 450,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/522381472/photo/modern-cake-covered-with-chocolate-glyassazhem.jpg?s=612x612&w=0&k=20&c=E-lZtw3xfNb76n0tXQbtwf8ofRiAjT_eykbu_uqMtMA=",
                    "rating": {
                      "rate": 4.4,
                      "count": 400
                    }
                  },
                  {
                    "id": 8,
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
                    "id": 9,
                    "title": "Rasmalai",
                    "price": 210,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/1318087021/photo/rasmalai-rossomalai-roshmolai-rasamalei-is-a-very-popular-indian-dessert-its-a-similar-dish.jpg?s=612x612&w=0&k=20&c=cCu6aSeO8RCGCM9r5zfAICe3-n1-Nc62ozJxlb5gCZw=",
                    "rating": {
                      "rate": 3.8,
                      "count": 679
                    }
                  },
                  {
                    "id": 10,
                    "title": "Vennela IceCream",
                    "price": 150,
                    "category": "IceCream",
                    "image": "https://media.istockphoto.com/id/948032164/photo/ice-cream.jpg?s=612x612&w=0&k=20&c=EWy8rEsWVuv67-DWH0a-rAlI7GSy1FAU237yg1TwFKg=",
                    "rating": {
                      "rate": 3.9,
                      "count": 400
                    }
                  },
                  {
                    "id": 11,
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
                    "id": 12,
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
                    "id": 13,
                    "title": "Apple Juice",
                    "price": 60,
                    "category": "Fruit Juice",
                    "image": "https://www.alphafoodie.com/wp-content/uploads/2021/11/Apple-Juice-Square.jpeg",
                    "rating": {
                      "rate": 3.9,
                      "count": 120
                    }
                  },
                  {
                    "id": 14,
                    "title": "Chicken Pizza",
                    "price": 249,
                    "category": "Pizzas",
                    "image": "https://www.yummytummyaarthi.com/wp-content/uploads/2015/11/chicken-pizza-1-500x500.jpeg",
                    "rating": {
                      "rate": 2.9,
                      "count": 340
                    }
                  },
                  {
                    "id": 15,
                    "title": "Corn Pizza",
                    "price": 39.99,
                    "category": "Pizzas",
                    "image": "https://img.thecdn.in/285347/1683898758033_SKU-0672_0.jpg?format=webp",
                    "rating": {
                      "rate": 3.8,
                      "count": 679
                    }
                  }
              ]
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

// Initialize
cardsContainerInit();
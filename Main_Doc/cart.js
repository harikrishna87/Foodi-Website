import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, getDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
    const userEmail = document.getElementById('loggeduseremail')?.textContent.trim();
    const savedImage = localStorage.getItem(`userAvatar_${userEmail}`);
    if (savedImage) {
        avatarImg.src = savedImage;
    } else {
        avatarImg.src = "https://i.pinimg.com/564x/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.jpg";
    }
}

imageInput.addEventListener('change', (event) => {
    const userEmail = document.getElementById('loggeduseremail')?.textContent.trim();
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
    // Removed console.log here to avoid logging user data to the console.
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (loggedInUserId || user) {
        const userId = loggedInUserId || user.uid;

        const docRef = doc(db, "users", userId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();

                    // Populate customer details without logging to console
                    document.getElementById("username").textContent = userData.Full_Name || "N/A";
                    document.getElementById("email").textContent = userData.Email || "N/A";
                    document.getElementById("userid").textContent = userId;

                    document.getElementById("loggedusername").innerText = userData.Full_Name;
                    document.getElementById("loggeduseremail").innerText = userData.Email;
                    initializeUserAvatar();
                    if (!loggedInUserId) {
                        localStorage.setItem("loggedInUserId", userId);  // Store logged in user ID in localStorage
                    }
                } else {
                    console.error("No document found matching Id");
                }
            })
            .catch((error) => {
                console.error("Error retrieving document:", error);
            });
    } else {
        console.log("User not logged in, redirecting to login...");
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
});

// Logout functionality
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

// Load Cart Data and Render in Table
async function loadCartData(userId) {
    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const cartItems = cartData.cart || [];
        renderCartItems(cartItems);
        updateCartSummary(cartItems);
    } else {
        console.error("Cart data not found for the user.");
        renderCartItems([]);
    }
}

// Render Cart Items in the Table
function renderCartItems(cartItems) {
    const cartItemsBody = document.getElementById("cartItemsBody");
    cartItemsBody.innerHTML = "";

    if(Object.keys(cartItems).length === 0) {
        cartItemsBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center cart1">Your cart is empty</td>
                    </tr>`;
                return;
    }
    // cartItemsBody.textContent = "The Cart Is Empty"

    cartItems.forEach((item, index) => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.title}" class="image"></td>
                <td>${item.title}</td>
                <td>₹ ${item.price}</td>
                <td>
                    <button class="decrement" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment" data-index="${index}">+</button>
                </td>
                <td>₹ ${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="remove-item" data-index="${index}"><i class='bx bxs-trash-alt' style='color:#fc0707'  ></i></button>
                </td>
            </tr>
        `;
        cartItemsBody.innerHTML += row;
    });

    // Add event listeners for buttons
    document.querySelectorAll(".increment").forEach((button) =>
        button.addEventListener("click", incrementQuantity)
    );
    document.querySelectorAll(".decrement").forEach((button) =>
        button.addEventListener("click", decrementQuantity)
    );
    document.querySelectorAll(".remove-item").forEach((button) =>
        button.addEventListener("click", removeCartItem)
    );
}

// Increment Quantity
async function incrementQuantity(event) {
    const userId = localStorage.getItem("loggedInUserId");
    const index = event.target.getAttribute("data-index");

    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        cartData.cart[index].quantity += 1;

        await updateDoc(cartRef, { cart: cartData.cart });
        loadCartData(userId); // Refresh cart
    }
}

// Decrement Quantity
async function decrementQuantity(event) {
    const userId = localStorage.getItem("loggedInUserId");
    const index = event.target.getAttribute("data-index");

    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();

        if (cartData.cart[index].quantity > 1) {
            cartData.cart[index].quantity -= 1;
        } else {
            cartData.cart.splice(index, 1);
        }

        await updateDoc(cartRef, { cart: cartData.cart });
        loadCartData(userId);
    }
}

async function removeCartItem(event) {
    const userId = localStorage.getItem("loggedInUserId");
    const index = event.target.getAttribute("data-index");

    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this item from the cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(54, 241, 54)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const cartRef = doc(db, "users", userId);
            const cartSnap = await getDoc(cartRef);

            if (cartSnap.exists()) {
                const cartData = cartSnap.data();
                cartData.cart.splice(index, 1);

                await updateDoc(cartRef, { cart: cartData.cart });
                loadCartData(userId);
                Swal.fire({
                    title: "Removed!",
                    text: "The item has been removed from your cart",
                    icon: "success",
                    iconColor: "rgb(54, 241, 54)"
                });
            }
        } else {
            Swal.fire({
                title: "Cancelled",
                text: "The item was not removed from your cart",
                icon: "info",
            });
        }
    });
}


// Update Cart Summary
function updateCartSummary(cartItems) {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("Price").innerText = `₹ ${totalPrice.toFixed(2)}`;
    document.getElementById("count").innerText = cartItems.length;
}

// Initialize Cart on Page Load
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        document.getElementById("username").innerText = user.displayName || "User";
        document.getElementById("email").innerText = user.email;
        document.getElementById("userid").innerText = userId;

        loadCartData(userId);
    } else {
        console.error("No user logged in.");
    }
});

// Checkout Button Event
document.getElementById("btn").addEventListener("click", async () => {
    const userId = localStorage.getItem("loggedInUserId");
    const cartRef = doc(db, "users", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const cartItems = cartData.cart || [];

        if (cartItems.length === 0) {
            Swal.fire({
                title: "Cart is Empty",
                text: "Please add items to your cart before proceeding to checkout.",
                icon: "warning",
                confirmButtonColor: "rgb(54, 241, 54)",
            });
            return;
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        Swal.fire({
            title: "Proceed to Checkout",
            html: `<p>Total Amount: <strong>₹ ${totalAmount.toFixed(2)}</strong></p>`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Okay, Pay Now",
            cancelButtonText: "Cancel",
            confirmButtonColor: "rgb(54, 241, 54)",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await updateDoc(cartRef, { cart: [] });

                Swal.fire({
                    title: "Payment Successful",
                    text: "Thank you for your purchase!",
                    icon: "success",
                    confirmButtonColor: "rgb(54, 241, 54)",
                });

                loadCartData(userId);
            } else {
                Swal.fire({
                    title: "Payment Cancelled",
                    text: "Your cart remains unchanged.",
                    icon: "info",
                    confirmButtonColor: "rgb(54, 241, 54)",
                });
            }
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Unable to fetch cart data. Please try again.",
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
});


// Loading Spinners 
document.addEventListener("DOMContentLoaded", () => {
    const preLoader = document.querySelector(".pre_loader");
  
    window.addEventListener("load", () => {
      preLoader.classList.add("hidden");
  
      setTimeout(() => {
        preLoader.remove();
      }, 500); 
    });
  });
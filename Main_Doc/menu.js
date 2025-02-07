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
                  "title": "Fish Biryani",
                  "price": 249,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1334383300/photo/fish-biryani-spicy-and-delicious-malabar-biryani-or-hydrabadi-biryani-dum-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZqTAGd2qFYQHDxhmvWC5XSwKLIQSPEGFDOEz9wK9SEE=",
                  "rating": {
                    "rate": 4.3,
                    "count": 500
                  }
                },
                {
                  "id": 4,
                  "title": "Prawn's Biryani",
                  "price": 229,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1957922787/photo/grilled-prawn-biryani-rice-served-in-clypot-dish-isolated-on-wooden-table-top-view-of-indian.webp?a=1&b=1&s=612x612&w=0&k=20&c=9mohNlZWOKnO8gao2dkhxaqjMyPZhgBFJfPY-oX9qK4=",
                  "rating": {
                    "rate": 4.1,
                    "count": 430
                  }
                },
                {
                  "id": 5,
                  "title": "Egg Biryani",
                  "price": 149,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/534334870/photo/egg-biryani-or-anda-biryani-using-basmati-rice-and-spices.jpg?s=612x612&w=0&k=20&c=hkqGYJNjMnaRKIfrd8od4rx9J5Rskmoex_Clfpda4TM=",
                  "rating": {
                    "rate": 4.4,
                    "count": 400
                  }
                },
                {
                  "id": 6,
                  "title": "Tanduri Biryani",
                  "price": 299,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1404803795/photo/whole-grilled-chicken-with-vegetables-and-rice.jpg?s=612x612&w=0&k=20&c=4SE1-3-D6QGKDiZQd365qGfZwlAPGlcG_QvT17sSb_8=",
                  "rating": {
                    "rate": 3.9,
                    "count": 70
                  }
                },
                {
                  "id": 7,
                  "title": "Mandi",
                  "price": 399,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/2167228246/photo/chicken-mandi-tandoor-dish-mandi-is-a-rice-dish-with-meat-top-view-chicken-piece-mutton-piece.jpg?s=612x612&w=0&k=20&c=rgHVKLVw_eu6dTMoQQbnUomCgQNNyccQQJ5cucebWLU=",
                  "rating": {
                    "rate": 4.0,
                    "count": 400
                  }
                },
                {
                  "id": 8,
                  "title": "Chicken 65",
                  "price": 229,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1494080995/photo/chicken-65-dry-in-plate-on-wooden-background.jpg?s=612x612&w=0&k=20&c=q9LsUCjQyIqTJsMiIEX9d2dmkuGkyhUNMSq6oNFNp10=",
                  "rating": {
                    "rate": 3.9,
                    "count": 100
                  }
                },
                {
                  "id": 9,
                  "title": "Chicken Lollipop's",
                  "price": 249,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1090502088/photo/chicken-lollipop-appetizer.jpg?s=612x612&w=0&k=20&c=yT1srFZIj6EaPoqGMPKdx3IQEZrhp7d-ZteZZ6Kppu0=",
                  "rating": {
                    "rate": 4.3,
                    "count": 203
                  }
                },
                {
                  "id": 10,
                  "title": "Chicken Tanduri",
                  "price": 279,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1264662676/photo/indian-tandoori-chicken.jpg?s=612x612&w=0&k=20&c=Rk-e3PxTZawKcY6Tzs_1HM06NwEJqDEkVPwuS_xHk4Q=",
                  "rating": {
                    "rate": 2.9,
                    "count": 470
                  }
                },
                {
                  "id": 11,
                  "title": "Chicken Wings",
                  "price": 199,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/532607409/photo/chicken-wings.jpg?s=612x612&w=0&k=20&c=JKyzVvVvPIkGoAaN-dBHyrsyAVtB9Q1Mimv2SPv88Yk=",
                  "rating": {
                    "rate": 4.8,
                    "count": 319
                  }
                },
                {
                  "id": 12,
                  "title": "Chicken Momos",
                  "price": 149,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1341504203/photo/fried-momos-dumpling.jpg?s=612x612&w=0&k=20&c=mCUGBqUZw1M7Eu8Bh232by22Q5xKuhJkPG1h6BenbRs=",
                  "rating": {
                    "rate": 4.8,
                    "count": 400
                  }
                },
                {
                  "id": 13,
                  "title": "Mutton Kebab",
                  "price": 399,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/501266025/photo/seekh-kabab-5.jpg?s=612x612&w=0&k=20&c=D6JXEtB4OLF9A91nAfDYLlh507LlbmP_M9PZBoJqD9Q=",
                  "rating": {
                    "rate": 3.9,
                    "count": 250
                  }
                },
                {
                  "id": 14,
                  "title": "Mutton Curry",
                  "price": 399,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1421211322/photo/dal-gosht-or-daal-gosht-is-one-of-the-very-popular-mutton-recipes-in-india-mutton-cooked-with.jpg?s=612x612&w=0&k=20&c=f5kPu_jcTX8O5Jf4jAMQItuzcyGKb3RfveTd5_m-ugU=",
                  "rating": {
                    "rate": 4.2,
                    "count": 140
                  }
                },
                {
                  "id": 15,
                  "title": "Fish Fry",
                  "price": 199,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1309353866/photo/seer-fish-fry.jpg?s=612x612&w=0&k=20&c=18mD5mCErONAEQYmOz970ZfM1zE_CfMD96VPaHmNSfA=",
                  "rating": {
                    "rate": 3.9,
                    "count": 235
                  }
                },
                {
                  "id": 16,
                  "title": "Fish Curry",
                  "price": 119,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1295772368/photo/macher-jhol-in-black-bowl-on-dark-slate-table-top-indian-cuisine-bengali-fish-curry-asian.jpg?s=612x612&w=0&k=20&c=3asIIURIgisLwXAijZnmNY3p2EWEZEHzByjk7ke9xZk=",
                  "rating": {
                    "rate": 4.2,
                    "count": 340
                  }
                },
                {
                  "id": 17,
                  "title": "Prawn's Curry",
                  "price": 149,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1097412142/photo/prawn-masala-curry-with-chapatti-and-basmati-rice.jpg?s=612x612&w=0&k=20&c=rDgA6Xc10j1b3Q9fBaIhjH2khA195OuzkjwJXlc0INE=",
                  "rating": {
                    "rate": 3.8,
                    "count": 679
                  }
                },
                {
                  "id": 18,
                  "title": "Prawn's Fry",
                  "price": 199,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1135083542/photo/spicy-garlic-chili-prawns-shrimps.jpg?s=612x612&w=0&k=20&c=47i9bf2TcL-D_7yGezxBWQtwfaooVBbF3G2wIVL9dAc=",
                  "rating": {
                    "rate": 4.3,
                    "count": 130
                  }
                },
                {
                  "id": 19,
                  "title": "Chicken Curry",
                  "price": 199,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/914006562/photo/indian-dish-of-spicy-hot-chicken-curry-in-red.jpg?s=612x612&w=0&k=20&c=FoCUrg4t7FlK9PmE8oh26iiM8rP6nwM-9AyzpgLP4s8=",
                  "rating": {
                    "rate": 4.1,
                    "count": 146
                  }
                },
                {
                  "id": 20,
                  "title": "Egg Curry",
                  "price": 99,
                  "category": "NonVeg",
                  "image": "https://media.istockphoto.com/id/1072940148/photo/fried-egg-curry-or-anda-masala-served-in-a-bowl-selective-focus.jpg?s=612x612&w=0&k=20&c=cYvM9X6VQ0UlQyUEWvFk5VMNS6wg8K0o3kVuVDuwbZU=",
                  "rating": {
                    "rate": 3.9,
                    "count": 145
                  }
                },
                {
                    "id": 21,
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
                    "id": 22,
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
                    "id": 23,
                    "title": "Rotis",
                    "price": 10,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/2126807238/photo/healthy-super-food-ragi-roti-with-raw-ragi-and-flour-selective-focus.jpg?s=612x612&w=0&k=20&c=cfFx6cC6q1ZHIp0xLaMifyPByPM-2Oq6ern7ygmgi6E=",
                    "rating": {
                      "rate": 4.2,
                      "count": 500
                    }
                  },
                  {
                    "id": 24,
                    "title": "Tomato Curry",
                    "price": 49,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1178768522/photo/traditional-thick-sweet-potato-soup-with-lentils-close-up-in-a-bowl-on-the-table-horizontal.jpg?s=612x612&w=0&k=20&c=FLP8Pds0meqcIprKWV_XcX0QTL144Df_c_U4o3TNvwI=",
                    "rating": {
                      "rate": 3.8,
                      "count": 430
                    }
                  },
                  {
                    "id": 25,
                    "title": "Panner Butter Masala",
                    "price": 149,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1085157300/photo/malai-or-achari-paneer-in-a-gravy-made-using-red-gravy-and-green-capsicum-served-in-a-bowl.jpg?s=612x612&w=0&k=20&c=lvx9TUgF-IZd_Ac1QeSw_s1-PTK2bZNv5jpcI1jrPJc=",
                    "rating": {
                      "rate": 4.3,
                      "count": 400
                    }
                  },
                  {
                    "id": 26,
                    "title": "Panner Kebab",
                    "price": 169,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1081833682/photo/spicy-barbecued-chicken-tikka-boti-on-skewers-served-in-a-plate-with-green-chutney-selective.jpg?s=612x612&w=0&k=20&c=QHLBOCI3MBRhoixSJS8ahA3cQFe70wXZUMTTg9j8cFc=",
                    "rating": {
                      "rate": 3.9,
                      "count": 70
                    }
                  },
                  {
                    "id": 27,
                    "title": "Panner Tikka",
                    "price": 169,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/2181204121/photo/a-closeup-picture-of-a-tasty-panner-tikka-served-in-a-plate-at-a-restaurant.jpg?s=612x612&w=0&k=20&c=ag27UhNUrjrwdUj_hNZSOAfrPIPQ0sdnd_qjjpNNf2c=",
                    "rating": {
                      "rate": 4.0,
                      "count": 400
                    }
                  },
                  {
                    "id": 28,
                    "title": "Panner Biryani",
                    "price": 219,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1292443683/photo/hyderabadi-veg-paneer-dum-biryani-with-mixed-veggies-like-paneer-potato-carrots-peas-cooked.jpg?s=612x612&w=0&k=20&c=YYVlk9tJ0jqOKuWeUqjHXg2cpV_ZFaI7TxZayU3dyW4=",
                    "rating": {
                      "rate": 3.9,
                      "count": 100
                    }
                  },
                  {
                    "id": 29,
                    "title": "Veg Biryani",
                    "price": 139,
                    "category": "Veg",
                    "image": "https://media.istockphoto.com/id/1539949431/photo/top-view-of-veg-biryani-with-paneer-and-cashew-in-it.jpg?s=612x612&w=0&k=20&c=aOe-bpsj3yaAXYCMGMPGLiX1tjJ6APki52h96Kmp8UE=",
                    "rating": {
                      "rate": 3.8,
                      "count": 203
                    }
                  },
                  {
                    "id": 30,
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
                    "id": 31,
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
                    "id": 32,
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
                    "id": 33,
                    "title": "PineApple Cake",
                    "price": 500,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/1407969243/photo/homemade-pineapple-cake-for-party.jpg?s=612x612&w=0&k=20&c=uuC0glBihp7Sw1s_7W7IIrMVpufGn5p4K93a2RBvGXo=",
                    "rating": {
                      "rate": 3.9,
                      "count": 250
                    }
                  },
                  {
                    "id": 34,
                    "title": "BlackForest Cake",
                    "price": 700,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/1214305490/photo/blackforest-cake.jpg?s=612x612&w=0&k=20&c=yxQZHJ6HSGamPFo5UId6JeC0RICcuZo1DuXfYWIdpyY=",
                    "rating": {
                      "rate": 4.2,
                      "count": 140
                    }
                  },
                  {
                    "id": 35,
                    "title": "Chacolate Cake",
                    "price": 599,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/617580000/photo/whole-round-cake-and-slice-on-wood-table.jpg?s=612x612&w=0&k=20&c=y2iTl6Z_uvCheGRBA2Zavf2nJ4msxsVaGRsxbR7x66Q=",
                    "rating": {
                      "rate": 3.6,
                      "count": 235
                    }
                  },
                  {
                    "id": 36,
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
                    "id": 37,
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
                    "id": 38,
                    "title": "Motichur Laddu",
                    "price": 199,
                    "category": "Desserts",
                    "image": "https://5.imimg.com/data5/SELLER/Default/2022/2/PX/BT/LX/100822488/motichoor-ladoo.jpg",
                    "rating": {
                      "rate": 4.3,
                      "count": 130
                    }
                  },
                  {
                    "id": 39,
                    "title": "Kaju Kathili",
                    "price": 149,
                    "category": "Desserts",
                    "image": "https://media.istockphoto.com/id/1792467710/photo/top-view-of-indian-cashew-rich-sweet-kaju-katli.jpg?s=612x612&w=0&k=20&c=oqXXtjqx0rdmW-7etpGnthSUkRXMwdNTyLl71fcjyr8=",
                    "rating": {
                      "rate": 4.3,
                      "count": 146
                    }
                  },
                  {
                    "id": 40,
                    "title":"Malai Kaja",
                    "price": 250,
                    "category": "Desserts",
                    "image": "https://m.media-amazon.com/images/I/7163uNeepGL.jpg",
                    "rating": {
                      "rate": 3.6,
                      "count": 145
                    }
                  },
                  {
                    "id": 41,
                    "title": "Sunnudalu",
                    "price": 110,
                    "category": "Desserts",
                    "image": "https://vaya.in/recipes/wp-content/uploads/2018/03/Sunnundalu.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 120
                    }
                  },
                  {
                    "id": 42,
                    "title": "Badusha",
                    "price": 99,
                    "category": "Desserts",
                    "image": "https://mylaporeganapathys.com/wp-content/uploads/2022/06/Seer-Badhusha.jpg",
                    "rating": {
                      "rate": 4.1,
                      "count": 259
                    }
                  },
                  {
                    "id": 43,
                    "title": "Mysore Pakk",
                    "price": 69,
                    "category": "Desserts",
                    "image": "https://abicake.com/cdn/shop/files/Ghee-Mysore-Pak.png?v=1702288288",
                    "rating": {
                      "rate": 4.3,
                      "count": 500
                    }
                  },
                  {
                    "id": 44,
                    "title": "Bandar Halwa",
                    "price": 49,
                    "category": "Desserts",
                    "image": "https://olivemithai.com/cdn/shop/products/BANDAR-HALWA_4bd2b57c-3dcd-4982-91b3-0f2c37d62cc9.jpg?v=1671530934",
                    "rating": {
                      "rate": 4.1,
                      "count": 430
                    }
                  },
                  {
                    "id": 45,
                    "title": "Jangree",
                    "price": 89,
                    "category": "Desserts",
                    "image": "https://mirchi.com/os/cdn/content/images/jangree%20raja%20sweets_medium_0517050.webp",
                    "rating": {
                      "rate": 4.6,
                      "count": 400
                    }
                  },
                  {
                    "id": 46,
                    "title": "Madatha Kaja",
                    "price": 69,
                    "category": "Desserts",
                    "image": "https://www.srimouryas.com/cdn/shop/products/madatha-kaja-andhra-special-sweettraditional-mithaissri-mouryas-foods-216144.jpg?v=1709310101",
                    "rating": {
                      "rate": 3.9,
                      "count": 70
                    }
                  },
                  {
                    "id": 47,
                    "title": "Bobbatlu",
                    "price": 200,
                    "category": "Desserts",
                    "image": "https://gummadifoods.com/uploads/440/23/12/07122317019621466571e1a269a49.webp",
                    "rating": {
                      "rate": 4.3,
                      "count": 400
                    }
                  },
                  {
                    "id": 48,
                    "title": "Potharekulu",
                    "price": 199,
                    "category": "Desserts",
                    "image": "https://dadus.co.in/cdn/shop/files/4_97200b76-d6fd-4029-92be-f66b7cdc0351.png?v=1685194126&width=2048",
                    "rating": {
                      "rate": 3.9,
                      "count": 100
                    }
                  },
                  {
                    "id": 49,
                    "title": "Bandar Laddu",
                    "price": 165,
                    "category": "Desserts",
                    "image": "https://sitarafoods.com/wp-content/uploads/2023/11/bandar-laddu.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 203
                    }
                  },
                  {
                    "id": 50,
                    "title": "Mango Barfi",
                    "price": 109,
                    "category": "Desserts",
                    "image": "https://www.milkmaid.in/sites/default/files/2023-05/Mango-Barfi-335x300.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 470
                    }
                  },
                  {
                    "id": 51,
                    "title": "Browniee",
                    "price": 179,
                    "category": "Desserts",
                    "image": "https://recipesblob.oetker.in/assets/0e7149831748458c9502e361e889f726/636x382/brownie-with-vanilla-ice-cream.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 319
                    }
                  },
                  {
                    "id": 52,
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
                    "id": 53,
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
                    "id": 54,
                    "title": "PineApple IceCream",
                    "price": 119,
                    "category": "IceCream",
                    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNm-OSo8HD19gocx4_e_tidj5ttBQbPJpWqhS2v5iClIN7QJ3oRQc4QwjLKzcCJlFBG1c&usqp=CAU",
                    "rating": {
                      "rate": 4.0,
                      "count": 140
                    }
                  },
                  {
                    "id": 55,
                    "title": "Grape IceCream",
                    "price": 119,
                    "category": "IceCream",
                    "image": "https://www.grapesfromcalifornia.com/wp-content/uploads/2022/10/20221005-creamy-vegan-ca-grape-ice-cream-1000x586.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 235
                    }
                  },
                  {
                    "id": 56,
                    "title": "Butter Scotch IceCream",
                    "price": 120,
                    "category": "IceCream",
                    "image": "https://static.toiimg.com/thumb/84014919.cms?imgsize=306932&width=800&height=800",
                    "rating": {
                      "rate": 4.5,
                      "count": 340
                    }
                  },
                  {
                    "id": 57,
                    "title": "Pista IceCream",
                    "price": 110,
                    "category": "IceCream",
                    "image": "https://www.keep-calm-and-eat-ice-cream.com/wp-content/uploads/2022/09/Pistachio-ice-cream-hero-06-500x375.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 679
                    }
                  },
                  {
                    "id": 58,
                    "title": "Black Current IceCream",
                    "price": 149,
                    "category": "IceCream",
                    "image": "https://5.imimg.com/data5/SELLER/Default/2021/2/UZ/FD/XU/110446045/black-currant-ice-cream.jpeg",
                    "rating": {
                      "rate": 4.2,
                      "count": 130
                    }
                  },
                  {
                    "id": 59,
                    "title": "Chacolate IceCream",
                    "price": 99,
                    "category": "IceCream",
                    "image": "https://www.milkmaid.in/sites/default/files/2022-12/Chocolate-Ice-Cream-335x300.jpg",
                    "rating": {
                      "rate": 4.1,
                      "count": 146
                    }
                  },
                  {
                    "id": 60,
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
                    "id": 61,
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
                    "id": 62,
                    "title": "Grape Juice",
                    "price": 50,
                    "category": "Fruit Juice",
                    "image": "https://www.alphafoodie.com/wp-content/uploads/2022/03/How-to-Make-Grape-Juice-Square.jpeg",
                    "rating": {
                      "rate": 4.1,
                      "count": 259
                    }
                  },
                  {
                    "id": 63,
                    "title": "WaterMelon Juice",
                    "price": 40,
                    "category": "Fruit Juice",
                    "image": "https://bellyfull.net/wp-content/uploads/2022/06/Watermelon-Juice-blog-4.jpg",
                    "rating": {
                      "rate": 4.0,
                      "count": 500
                    }
                  },
                  {
                    "id": 64,
                    "title": "PineApple Juice",
                    "price": 50,
                    "category": "Fruit Juice",
                    "image": "https://img.freepik.com/premium-photo/pineapple-juice-with-splashes-with-pineapple-fruit-studio-background-restaurant-with-garden_741910-8027.jpg",
                    "rating": {
                      "rate": 4.1,
                      "count": 430
                    }
                  },
                  {
                    "id": 65,
                    "title": "Orange Juice",
                    "price": 40,
                    "category": "Fruit Juice",
                    "image": "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-560w,f_auto,q_auto:best/rockcms/2024-03/orange-juice-1-jp-240311-1e99ea.jpg",
                    "rating": {
                      "rate": 3.6,
                      "count": 400
                    }
                  },
                  {
                    "id": 66,
                    "title": "Mosambi Juice",
                    "price": 50,
                    "category": "Fruit Juice",
                    "image": "https://traya.health/cdn/shop/articles/Title_Blog_banners_1_33276647-3316-4fcd-a096-20ff33a3abf4.webp?v=1727440886",
                    "rating": {
                      "rate": 3.9,
                      "count": 70
                    }
                  },
                  {
                    "id": 67,
                    "title": "Pomegranate Juice",
                    "price": 50,
                    "category": "Fruit Juice",
                    "image": "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/05/pomegranate-juice-recipe.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 400
                    }
                  },
                  {
                    "id": 68,
                    "title": "Sapota Juice",
                    "price": 60,
                    "category": "Fruit Juice",
                    "image": "https://arunagri.com/wp-content/uploads/Sapota-Juice-scaled.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 100
                    }
                  },
                  {
                    "id": 69,
                    "title": "Beetroot Juice",
                    "price": 65,
                    "category": "Fruit Juice",
                    "image": "https://c.ndtvimg.com/2018-10/s5sogbbo_beetroot-juice_625x300_03_October_18.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886",
                    "rating": {
                      "rate": 3.6,
                      "count": 203
                    }
                  },
                  {
                    "id": 70,
                    "title": "Kiwi Juice",
                    "price": 45,
                    "category": "Fruit Juice",
                    "image": "https://www.alphafoodie.com/wp-content/uploads/2021/08/Kiwi-Juice-Square.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 470
                    }
                  },
                  {
                    "id": 71,
                    "title": "Strawberry Juice",
                    "price": 65,
                    "category": "Fruit Juice",
                    "image": "https://www.cubesnjuliennes.com/wp-content/uploads/2022/09/Strawberry-Juice-Recipe.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 319
                    }
                  },
                  {
                    "id": 72,
                    "title": "Lemon Juice",
                    "price": 35,
                    "category": "Fruit Juice",
                    "image": "https://steviala.com/wp-content/uploads/2020/04/lime.jpg",
                    "rating": {
                      "rate": 3.8,
                      "count": 400
                    }
                  },
                  {
                    "id": 73,
                    "title": "Gooseberry Juice",
                    "price": 55,
                    "category": "Fruit Juice",
                    "image": "https://media.istockphoto.com/id/1310998360/photo/indian-gooseberry-juice-on-wooden-floor.jpg?s=612x612&w=0&k=20&c=TILO6CrELucYRvCiiXR3DEhvsVJ3QsNDWehhIZ4R5QI=",
                    "rating": {
                      "rate": 3.9,
                      "count": 250
                    }
                  },
                  {
                    "id": 74,
                    "title": "Cherry Juice",
                    "price": 60,
                    "category": "Fruit Juice",
                    "image": "https://www.mattressclarity.com/wp-content/uploads/2018/03/natural-remedies-can-help-you-sleep-cherry-juice.jpg",
                    "rating": {
                      "rate": 4.2,
                      "count": 140
                    }
                  },
                  {
                    "id": 75,
                    "title": "SugarCane Juice",
                    "price": 25,
                    "category": "Fruit Juice",
                    "image": "https://www.theauric.com/cdn/shop/articles/fresh-squeezed-sugar-cane-juice-with-fresh-cane-sliced-isolated-white-background_4000x.jpg?v=1647859027",
                    "rating": {
                      "rate": 3.6,
                      "count": 235
                    }
                  },
                  {
                    "id": 76,
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
                    "id": 77,
                    "title": "Corn Pizza",
                    "price": 39.99,
                    "category": "Pizzas",
                    "image": "https://img.thecdn.in/285347/1683898758033_SKU-0672_0.jpg?format=webp",
                    "rating": {
                      "rate": 3.8,
                      "count": 679
                    }
                  },
                  {
                    "id": 78,
                    "title": "Mushroom Pizzza",
                    "price": 199,
                    "category": "Pizzas",
                    "image": "https://cdn7.kiwilimon.com/recetaimagen/38841/640x640/50030.jpg.webp",
                    "rating": {
                      "rate": 4.7,
                      "count": 130
                    }
                  },
                  {
                    "id": 79,
                    "title": "Onion Pizza",
                    "price": 149,
                    "category": "Pizzas",
                    "image": "https://littlekitchen.in/wp-content/uploads/2024/05/onion-pizza.jpg",
                    "rating": {
                      "rate": 4.3,
                      "count": 146
                    }
                  },
                  {
                    "id": 80,
                    "title": "Chicken Dominator",
                    "price": 249,
                    "category": "Pizzas",
                    "image": "https://img.cdnx.in/99675/SKU-0094_0-1714305914335.jpg?width=600&format=webp",
                    "rating": {
                      "rate": 3.6,
                      "count": 145
                    }
                  },
                  {
                    "id": 81,
                    "title": "Cheesy Pizza",
                    "price": 199,
                    "category": "Pizzas",
                    "image": "https://kitchenatics.com/wp-content/uploads/2020/09/Cheese-pizza-1.jpg",
                    "rating": {
                      "rate": 3.9,
                      "count": 120
                    }
                  },
                  {
                    "id": 82,
                    "title": "Chicken Fiesta",
                    "price": 315,
                    "category": "Pizzas",
                    "image": "https://feenix.co.in/wp-content/uploads/2022/07/chunky-chicken.jpg",
                    "rating": {
                      "rate": 4.1,
                      "count": 259
                    }
                  },
                  {
                    "id": 83,
                    "title": "Non-veg-supreme",
                    "price": 299,
                    "category": "Pizzas",
                    "image": "https://homemadebakers.in/wp-content/uploads/2020/10/Non-veg-supreme-pizza1.jpg",
                    "rating": {
                      "rate": 3.7,
                      "count": 500
                    }
                  },
                  {
                    "id": 84,
                    "title": "Chicken-pepperoni Pizza",
                    "price": 325,
                    "category": "Pizzas",
                    "image": "https://cdn.uengage.io/uploads/5/image-694925-1715678908.png",
                    "rating": {
                      "rate": 3.9,
                      "count": 430
                    }
                  },
                  {
                    "id": 85,
                    "title": "Matzah pizza",
                    "price": 295,
                    "category": "Pizzas",
                    "image": "https://jamiegeller.com/.image/t_share/MTcxODAwMTc2Mjg4MDgxMzI0/margherita-matzo-pizza.jpg",
                    "rating": {
                      "rate": 4.1,
                      "count": 400
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

    if (currentProducts.length === 0) {
      cardsContainer.innerHTML = `<p class="not_available">Product not available....</p>`;
      return;
  }

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

const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchProducts(e.target.value);
    }
});

function searchProducts(query) {
    filteredProducts = products.filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";

        return title.includes(query.toLowerCase()) || category.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
    });

    currentPage = 1;
    renderPagination();
    renderCards(currentPage);
};


// Initialize
cardsContainerInit();
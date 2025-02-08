import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"; // Added necessary imports

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


// Fetch and Display Purchase History from Firestore
async function fetchPurchaseHistory(userId) {
    const purchasesRef = collection(db, "users", userId, "purchases");
    const purchaseQuery = query(purchasesRef, orderBy("purchased_at", "desc"));
    const purchaseSnapshot = await getDocs(purchaseQuery);

    const purchaseHistoryTableBody = document.getElementById("purchaseHistoryBody");
    purchaseHistoryTableBody.innerHTML = "";

    if (purchaseSnapshot.empty) {
        purchaseHistoryTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center his">No purchase history found.</td>
            </tr>
        `;
        return;
    }

    let serialNumber = 1;

    purchaseSnapshot.forEach((doc) => {
        const purchaseData = doc.data();
        const purchaseDate = purchaseData.purchased_at;
        const paymentMethod = purchaseData.payment_method;
        const purchaseAmount = purchaseData.total_amount;
        const amount = purchaseData.quantity * purchaseData.total_amount;
        const statusClass = "order-placed";
        const delivery_status = "delivered"
    
        const itemDetails = purchaseData.items.map((item) => `<img src="${item.image}" class="img"/> : ${item.item_name} <br> ${item.quantity} x ₹ ${item.amount} = ₹ ${item.total}`).join("<br><br>");
    
        const row = `
            <tr class="${statusClass}, ${delivery_status}">
                <td>${serialNumber}</td>
                <td>${purchaseDate}</td>
                <td>${itemDetails}</td>
                <td>₹ ${purchaseAmount}</td>
                <td>${paymentMethod}</td>
                <td><span class="order-status">Success</span></td>
                <td><span class="delivery">Delivered</span></td>
            </tr>
        `;
    
        purchaseHistoryTableBody.innerHTML += row;
        serialNumber++;
    });
    
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        fetchPurchaseHistory(userId);
    } else {
        console.error("No user logged in.");
    }
});

document.querySelector(".back_btn").addEventListener("click", () => {
    window.location.href = "cart.html";
})

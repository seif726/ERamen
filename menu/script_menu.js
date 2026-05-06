const API_URL = "https://script.google.com/macros/s/AKfycbxjqCUGgCaXFXByrUI9QQiVVrGVhB04CT3c4O2F_yPUOHaOTfq5dxCjHVZTF3VKcgr-/exec";
// This is JS File for OUR MENU PAGE

// Hamburger Menu: Start
let m = document.querySelector('#menu-btn');
let nav = document.querySelector('.header .flex .navbar');

m.onclick = () =>{
    m.classList.toggle('fa-times');
    nav.classList.toggle('active');
}
// Hamburger Menu: End

// --- Shopping Cart Logic ---
let cart = JSON.parse(localStorage.getItem("ERamenCart")) || [];

// 1. فتح وقفل السلة
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("active");
    let overlay = document.getElementById("cart-overlay");
    overlay.style.display = (overlay.style.display === "block") ? "none" : "block";
}

// 2. إضافة منتج للسلة
function addToCart(name, price, image) {
    cart.push({ name: name, price: price, image: image });
    localStorage.setItem("ERamenCart", JSON.stringify(cart));
    updateCartUI();
    
    // افتح السلة تلقائي عشان المستخدم يشوف بعينه (Informative Feedback)
    document.getElementById("cart-sidebar").classList.add("active");
    document.getElementById("cart-overlay").style.display = "block";
}

// 3. حذف منتج واحد من السلة (Easy Reversal of Actions)
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("ERamenCart", JSON.stringify(cart));
    updateCartUI();
}

// 4. تحديث واجهة السلة (النسخة الذكية لحساب الخصومات)
function updateCartUI() {
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");
    let cartCountElement = document.getElementById("cart-count");
    
    cartItemsContainer.innerHTML = ""; 
    let subtotal = 0;

    // حساب المجموع الأساسي ورسم العناصر
    cart.forEach((item, index) => {
        subtotal += item.price;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <i class="fas fa-trash remove-btn" onclick="removeFromCart(${index})"></i>
            </div>
        `;
    });

    // التحقق من وجود عروض (Promo Codes) مطبقة
    let activePromo = localStorage.getItem("ERamenPromo");
    let discountAmount = 0;

    if(activePromo) {
        if(activePromo === "TEMPURA20") {
            // خصم 20% على التمبورا بس
            cart.forEach(item => {
                if(item.name.toLowerCase().includes("tempura")) {
                    discountAmount += item.price * 0.20;
                }
            });
        } 
        else if(activePromo === "GYOZA20") {
            // خصم 20% على الجيوزا بس
            cart.forEach(item => {
                if(item.name.toLowerCase().includes("gyoza")) {
                    discountAmount += item.price * 0.20;
                }
            });
        } 
        else if(activePromo === "GOPAY10") {
            // خصم 10% على كل حاجة
            discountAmount = subtotal * 0.10;
        }

        // إظهار سطر الخصم في السلة لو فيه خصم فعلي
        if(discountAmount > 0) {
            cartItemsContainer.innerHTML += `
                <div style="color: green; font-size: 1.5rem; text-align: right; margin-top: 10px; font-weight: bold;">
                    Discount Applied: -$${discountAmount.toFixed(2)}
                </div>
            `;
        }
    }

    // حساب المجموع النهائي بعد الخصم
    let finalTotal = subtotal - discountAmount;

    cartTotalElement.innerText = finalTotal.toFixed(2);
    if(cartCountElement) {
        cartCountElement.innerText = cart.length; 
    }
}

// 5. دالة تفريغ السلة (بنمسح معاها الخصم كمان عشان نبدأ على نضافة)
function clearCart() {
    if(cart.length === 0) {
        alert("Your cart is already empty!");
        return;
    }
    
    let confirmClear = confirm("Are you sure you want to clear all items from your cart?");
    if(confirmClear) {
        cart = []; 
        localStorage.setItem("ERamenCart", JSON.stringify(cart));
        localStorage.removeItem("ERamenPromo"); // مسح العرض
        updateCartUI();
    }
}

// 6. زرار الدفع (تعديل بسيط لمسح العرض بعد الدفع)
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        cart.forEach(item => {

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            type: "Order",
            item: item.name,
            price: item.price
                    })
                });

            });
        alert("Thank you for your order! Total is $" + document.getElementById("cart-total").innerText);
        cart = []; 
        localStorage.setItem("ERamenCart", JSON.stringify(cart));
        localStorage.removeItem("ERamenPromo"); // مسح العرض
        updateCartUI();
        toggleCart(); 
    }
}

// تحديث السلة أول ما الصفحة تحمل
window.onload = updateCartUI;
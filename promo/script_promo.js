// This is JS File for PROMOTION PAGE

let m = document.querySelector('#menu-btn');
let nav = document.querySelector('.header .flex .navbar');

m.onclick = () =>{
    m.classList.toggle('fa-times');
    nav.classList.toggle('active');
}

// دالة حفظ العرض وإضافة الأكل للسلة أوتوماتيكياً
function claimPromo(promoCode, buttonElement, itemName = null, itemPrice = 0, itemImage = "") {
    // 1. حفظ كود الخصم في المتصفح
    localStorage.setItem("ERamenPromo", promoCode);
    
    // 2. لو إنت باعت اسم أكلة مع العرض، هنضيفها للسلة فوراً
    if(itemName !== null) {
        let cart = JSON.parse(localStorage.getItem("ERamenCart")) || [];
        cart.push({ name: itemName, price: itemPrice, image: itemImage });
        localStorage.setItem("ERamenCart", JSON.stringify(cart));
    }
    
    // 3. تغيير شكل الزرار
    buttonElement.innerText = itemName ? "Added to Cart! ✅" : "Claimed! ✅";
    buttonElement.style.backgroundColor = "green";
    buttonElement.style.pointerEvents = "none"; 
    
    // 4. رسالة تأكيد
    if(itemName) {
        alert("Offer claimed! " + itemName + " has been added to your cart.");
    } else {
        alert("Promo applied successfully!");
    }
}
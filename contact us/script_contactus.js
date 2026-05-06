const API_URL = "https://script.google.com/macros/s/AKfycbxjqCUGgCaXFXByrUI9QQiVVrGVhB04CT3c4O2F_yPUOHaOTfq5dxCjHVZTF3VKcgr-/exec";
// Hamburger Menu
let m = document.querySelector('#menu-btn');
let nav = document.querySelector('.header .flex .navbar');

m.onclick = () => {
    m.classList.toggle('fa-times');
    nav.classList.toggle('active');
}

// Email Validation
function emailValidation(emailSus) {

    let at = emailSus.indexOf("@");
    let dot = emailSus.indexOf(".");
    let space = emailSus.indexOf(" ");

    if (
        at != -1 &&
        at != 0 &&
        dot != -1 &&
        dot != 0 &&
        dot > at + 1 &&
        emailSus.length > dot + 1 &&
        space == -1
    ) {
        return true;
    } else {
        return false;
    }
}

// Form Validation
function validForm() {

    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let preference = document.getElementById("preference");
    let message = document.getElementById("message");
    let conditions = document.getElementById("conditions");

    if(name.value.length == 0){
        alert("Please fill the name!");
        return false;
    }

    else if(email.value.length == 0){
        alert("Please fill the e-mail box!");
        return false;
    }

    else if(!emailValidation(email.value)){
        alert("Please input a valid e-mail address!");
        return false;
    }

    else if(isNaN(phone.value)){
        alert("Phone numbers must be numbers!");
        return false;
    }

    else if(phone.value.length < 11 || phone.value.length > 13){
        alert("Phone numbers must contain 11-13 digits!");
        return false;
    }

    else if(preference.value == ""){
        alert("Please choose your preference!");
        return false;
    }

    else if(message.value == ""){
        alert("Please do not leave the message box empty!");
        return false;
    }

    else if(conditions.checked == false){
        alert("Please agree to receive newsletter from us!");
        return false;
    }

    else{
        fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
        type: "Feedback",
        name: name.value,
        email: email.value,
        phone: phone.value,
        preference: preference.value,
        message: message.value
        })
    });
        alert("Message sent successfully!");
        return true;
    }
}
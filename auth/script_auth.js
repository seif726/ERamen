async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

const API_URL = "https://script.google.com/macros/s/AKfycbxjqCUGgCaXFXByrUI9QQiVVrGVhB04CT3c4O2F_yPUOHaOTfq5dxCjHVZTF3VKcgr-/exec";

// التحقق من صيغة الإيميل
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// التحقق من قوة الباسورد
function isStrongPassword(password) {
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    return passwordRegex.test(password);
}

// التبديل بين التسجيل والدخول
function toggleForms() {

    let signupBox = document.getElementById("signup-box");
    let signinBox = document.getElementById("signin-box");

    if (signupBox.style.display === "none") {

        signupBox.style.display = "block";
        signinBox.style.display = "none";

    } else {

        signupBox.style.display = "none";
        signinBox.style.display = "block";

    }

    let signupMsg = document.getElementById("signup-error");
    let signinMsg = document.getElementById("signin-error");

    signupMsg.innerText = "";
    signinMsg.innerText = "";

    signupMsg.style.color = "#ffcccc";
    signinMsg.style.color = "#ffcccc";
}

// إنشاء حساب
async function signUp() {

    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value;

    let msgDiv = document.getElementById("signup-error");

    msgDiv.style.color = "#ffcccc";

    if (name === "" || email === "" || password === "") {

        msgDiv.innerText = "Please fill all fields!";
        return;

    }

    if (!isValidEmail(email)) {

        msgDiv.innerText = "Invalid E-mail! Format: name@email.com";
        return;

    }

    if (!isStrongPassword(password)) {

        msgDiv.innerText =
            "Weak Password! Must be 6+ chars, including a letter, a number, and a symbol.";

        return;
    }

    let users = JSON.parse(localStorage.getItem("ERamenUsers")) || [];

    let emailExists = users.some(user => user.email === email);

    if (emailExists) {

        msgDiv.innerText = "Error: This E-mail is already registered!";
        return;

    }

    let hashedPassword = await hashPassword(password);

    let newUser = {
        name: name,
        email: email,
        password: hashedPassword
    };

    users.push(newUser);

    localStorage.setItem("ERamenUsers", JSON.stringify(users));

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            type: "Sign Up",
            name: name,
            email: email,
            password: hashedPassword
        })
    });

    msgDiv.style.color = "#a3ffac";

    msgDiv.innerText =
        "Account created successfully! Switching to Login...";

    setTimeout(() => {

        toggleForms();

        document.getElementById("signin-email").value = email;

        document.getElementById("signup-name").value = "";
        document.getElementById("signup-email").value = "";
        document.getElementById("signup-password").value = "";

    }, 2000);
}

// تسجيل الدخول
async function signIn() {

    let email = document.getElementById("signin-email").value.trim();
    let password = document.getElementById("signin-password").value;

    let msgDiv = document.getElementById("signin-error");

    msgDiv.style.color = "#ffcccc";

    if (email === "" || password === "") {

        msgDiv.innerText = "Please fill all fields!";
        return;

    }

    let users = JSON.parse(localStorage.getItem("ERamenUsers")) || [];

    let hashedPassword = await hashPassword(password);

    let validUser = users.find(
        user =>
            user.email === email &&
            user.password === hashedPassword
    );

    if (validUser) {

        msgDiv.style.color = "#a3ffac";

        msgDiv.innerText =
            "Welcome back, " + validUser.name + "! Redirecting...";

        localStorage.setItem(
            "ERamenCurrentUser",
            validUser.name
        );

        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                type: "Login",
                email: email,
                password: hashedPassword
            })
        });

        setTimeout(() => {

            window.location.href = "../index.html";

        }, 1500);

    } else {

        msgDiv.innerText = "Invalid E-mail or Password!";

    }
}
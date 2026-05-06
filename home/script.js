// This is JS File for HOME PAGE

// Hamburger Menu: Start
let m = document.querySelector('#menu-btn');
let nav = document.querySelector('.header .flex .navbar');

m.onclick = () =>{
    m.classList.toggle('fa-times');
    nav.classList.toggle('active');
}
// Hamburger Menu: End
window.addEventListener("DOMContentLoaded", () => {

    let currentUser = localStorage.getItem("ERamenCurrentUser");

    let loginBtn = document.getElementById("login-btn");

    if(currentUser && loginBtn){

        loginBtn.innerText = currentUser;

    }

});
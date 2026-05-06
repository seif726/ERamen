// This is JS File for ABOUT US PAGE

// Hamburger Menu: Start
let m = document.querySelector('#menu-btn');
let nav = document.querySelector('.header .flex .navbar');

m.onclick = () =>{
    m.classList.toggle('fa-times');
    nav.classList.toggle('active');
}
// Hamburger Menu: End
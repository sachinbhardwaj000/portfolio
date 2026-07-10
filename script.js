// =========================================================
// THEME TOGGLE (dark / light) — persists using in-memory state
// =========================================================
const themeToggle = document.getElementById('themeToggle');
const iconMoon = document.getElementById('iconMoon');
const iconSun = document.getElementById('iconSun');
const root = document.documentElement;

// Respect the visitor's OS preference on first load
let currentTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});

function applyTheme(theme){
  if(theme === 'light'){
    root.setAttribute('data-theme', 'light');
    iconMoon.style.display = 'none';
    iconSun.style.display = 'block';
  } else {
    root.removeAttribute('data-theme');
    iconMoon.style.display = 'block';
    iconSun.style.display = 'none';
  }
}

// =========================================================
// MOBILE NAV TOGGLE
// =========================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu after clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// =========================================================
// HERO TERMINAL TYPING EFFECT
// =========================================================
const typedOutput = document.getElementById('typedOutput');
const cursor = document.getElementById('cursor');
const messages = [
  'Sachin Bhardwaj — MERN Stack Developer',
  'BCA, Amity University Online',
  'Based in Palwal, India',
  'Building scalable web apps, one commit at a time.'
];

let msgIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop(){
  const current = messages[msgIndex];

  if(!deleting){
    typedOutput.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400); // pause at full message
      return;
    }
  } else {
    typedOutput.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if(charIndex === 0){
      deleting = false;
      msgIndex = (msgIndex + 1) % messages.length;
    }
  }

  const speed = deleting ? 30 : 55;
  setTimeout(typeLoop, speed);
}

typeLoop();

// =========================================================
// CONTACT FORM (front-end only demo handler)
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Placeholder success message — wire this up to your backend/email
  // service (e.g. Formspree, EmailJS, or a custom Node/Express API) to
  // actually deliver messages.
  formStatus.textContent = "Thanks! Your message has been noted. I'll get back to you soon.";
  contactForm.reset();

  setTimeout(() => { formStatus.textContent = ''; }, 5000);
});

// =========================================================
// NAVBAR: subtle background change on scroll
// =========================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.2)' : 'none';
});

// =========================================================
// FOOTER YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => {
  btn.classList.toggle("open");
  nav.classList.toggle("flex");
  nav.classList.toggle("hidden");
});

const checkbox = document.querySelector("#toggle");
const html = document.querySelector("html");
const icon = document.querySelector("#icon");

const toggleDarkMode = function () {
  checkbox.checked ? html.classList.add("dark") : html.classList.remove("dark");
  html.classList.contains("dark")
    ? (icon.src = "./images/navbar/halfmoon.svg")
    : (icon.src = "./images/navbar/sun-icon.svg");
};

toggleDarkMode();

checkbox.addEventListener("click", toggleDarkMode);

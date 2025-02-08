// Icons
const sunIcon = document.querySelector(".sun");
const moonIcon = document.querySelector(".moon"); 

// Theme Variables
// const userTheme = document.querySelector("theme");
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-theme: dark").matches;

// Icon Toggling
const iconToggle = () => {
    moonIcon.classList.toggle("display-none");
    sunIcon.classList.toggle("display-none");
};

// Initial Check Theme
const themeCheck = () => {
    if (userTheme === "dark" || (!userTheme && systemTheme)) {
        document.documentElement.classList.add("dark");
        moonIcon.classList.add("display-none");
        return;
    }
    sunIcon.classList.add("display-none");
};

// Manual Theme Check
const themeSwitch = () => {
    if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        iconToggle();
        return;
    }
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    iconToggle();
};

// call theme switch on clicking buttons
sunIcon.addEventListener("click", () => {
    themeSwitch();
});

moonIcon.addEventListener("click", () => {
    themeSwitch();
});

// invoke theme check on initial load
themeCheck();

// borrow from the internet
// https://www.youtube.com/watch?v=hGHk5eS5MkA
// https://www.youtube.com/watch?v=oMOe_32M6ss
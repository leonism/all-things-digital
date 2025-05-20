// Icons
const sunIcon = document.querySelector('.sun');
const moonIcon = document.querySelector('.moon');

// Theme Variables
const userTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Icon Toggling
const iconToggle = () => {
  moonIcon.classList.toggle('display-none');
  sunIcon.classList.toggle('display-none');
};

// Initial Theme Check
const themeCheck = () => {
  if (userTheme === 'dark' || (!userTheme && systemTheme)) {
    document.documentElement.classList.add('dark');
    moonIcon.classList.add('display-none');
  } else {
    sunIcon.classList.add('display-none');
  }
};

// Manual Theme Switch
const themeSwitch = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  iconToggle();
};

// Event Listeners
sunIcon.addEventListener('click', themeSwitch);
moonIcon.addEventListener('click', themeSwitch);

// Initial Load
themeCheck();

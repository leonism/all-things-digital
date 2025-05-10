const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

// Function to close the navigation menu
function closeNav() {
	btn.classList.remove("open");
	nav.classList.remove("flex");
	nav.classList.add("hidden");
}

// Toggle navigation menu when hamburger is clicked
btn.addEventListener("click", (e) => {
	e.stopPropagation(); // Prevent the click event from propagating to the document
	btn.classList.toggle("open");
	nav.classList.toggle("flex");
	nav.classList.toggle("hidden");
});

// Close the navigation menu when clicking outside of it
document.addEventListener("click", (e) => {
	if (!nav.contains(e.target) && !btn.contains(e.target)) {
		closeNav();
	}
});

// Optional: Prevent closing the menu when clicking inside the navigation area
nav.addEventListener("click", (e) => {
	e.stopPropagation(); // Stop clicks inside the navigation from propagating to the document
});

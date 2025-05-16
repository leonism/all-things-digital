document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("menu");

  // Function to close the navigation menu
  function closeNav() {
    btn.classList.remove("open");
    nav.classList.remove("flex");
    nav.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
  }

  // Function to toggle navigation menu
  function toggleNav() {
    const isExpanded = btn.getAttribute("aria-expanded") === "true" || false;

    // Toggle visual classes
    btn.classList.toggle("open");
    nav.classList.toggle("flex");
    nav.classList.toggle("hidden");

    // Update ARIA attributes
    btn.setAttribute("aria-expanded", !isExpanded);

    // Toggle scroll lock
    if (!isExpanded) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  // Toggle navigation menu when hamburger is clicked
  btn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent the click event from propagating to the document
    toggleNav();
  });

  // Close the navigation menu when clicking outside of it
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      closeNav();
    }
  });

  // Prevent closing the menu when clicking inside the navigation area
  nav.addEventListener("click", function (e) {
    e.stopPropagation(); // Stop clicks inside the navigation from propagating to the document
  });

  // Close menu when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeNav();
    }
  });
});

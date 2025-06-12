document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // Theme Management
  // ======================
  const theme = {
    icons: {
      sun: document.querySelector('.sun'),
      moon: document.querySelector('.moon'),
    },
    storageKey: 'theme',
    classes: ['dark', 'display-none'],

    init() {
      const savedTheme = localStorage.getItem(this.storageKey);
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      const isDark = savedTheme ? savedTheme === 'dark' : systemDark;

      this.toggleIcons(isDark);
      document.documentElement.classList.toggle(this.classes[0], isDark);
    },

    toggleIcons(isDark) {
      [this.icons.sun, this.icons.moon].forEach((icon, index) => {
        if (icon) {
          // Add null check
          icon.classList.toggle(this.classes[1], index === Number(isDark));
        }
      });
    },

    switch() {
      const isDark = document.documentElement.classList.toggle(this.classes[0]);
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
      this.toggleIcons(isDark);
    },
  };

  // Theme event listeners
  if (theme.icons.sun) {
    // Add null check
    theme.icons.sun.addEventListener('click', () => theme.switch());
  }
  if (theme.icons.moon) {
    // Add null check
    theme.icons.moon.addEventListener('click', () => theme.switch());
  }
  theme.init();

  // ======================
  // Menu Management
  // ======================
  const menu = {
    btn: document.getElementById('menu-btn'),
    nav: document.getElementById('menu'),
    isOpen: false,
    classes: {
      open: 'open',
      flex: 'flex',
      hidden: 'hidden',
      lockScroll: 'overflow-hidden',
    },

    setState(open) {
      this.isOpen = open;
      if (this.btn) {
        // Add null check
        this.btn.classList.toggle(this.classes.open, open);
        this.btn.setAttribute('aria-expanded', open);
      }
      if (this.nav) {
        // Add null check
        this.nav.classList.toggle(this.classes.flex, open);
        this.nav.classList.toggle(this.classes.hidden, !open);
      }
      document.body.classList.toggle(this.classes.lockScroll, open);
    },

    handleClosure(e) {
      const isEscape = e.type === 'keydown' && e.key === 'Escape';
      const isOutsideClick =
        e.type === 'click' &&
        !(this.nav && this.nav.contains(e.target)) &&
        !(this.btn && this.btn.contains(e.target));

      if (isEscape || isOutsideClick) {
        this.setState(false);
        this.cleanup();
      }
    },

    cleanup() {
      if (
        document &&
        typeof document.removeEventListener === 'function' &&
        this.boundHandleClosure
      ) {
        document.removeEventListener('click', this.boundHandleClosure);
        document.removeEventListener('keydown', this.boundHandleClosure);
      }
    },

    init() {
      this.boundHandleClosure = this.handleClosure.bind(this);

      if (this.btn) {
        // Add null check
        this.btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const newState = !this.isOpen;
          this.setState(newState);

          newState ? this.addListeners() : this.cleanup();
        });
      }

      if (this.nav) {
        // Add null check
        this.nav.addEventListener('click', (e) => e.stopPropagation());
      }
    },

    addListeners() {
      if (
        document &&
        typeof document.addEventListener === 'function' &&
        this.boundHandleClosure
      ) {
        const doc = document; // Assign to a temporary variable
        doc.addEventListener('click', this.boundHandleClosure);
        doc.addEventListener('keydown', this.boundHandleClosure);
      }
    },
  };

  menu.init();
});

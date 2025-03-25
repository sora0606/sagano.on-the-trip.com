import Alpine from 'alpinejs';

Alpine.data('header', () => {
  return {
    scrollY: 0,
    scrollYHistory: 0,
    action: false,
    open: false,
    isOpened: false,
    isLight: false,

    init() {
      const button = this.$refs.button;

      this.$watch('open', async (value) => {
        void this.handleOpenChange(value);
        value ? this.$store.lenis.instance.stop() : this.$store.lenis.instance.start();
      });

      this.onScroll();
    },

    async handleOpenChange(value: boolean) {
      await this.$nextTick();
      this.isOpened = value;
    },

    get isScrolled() {
      return this.scrollY - this.scrollYHistory > 0 && this.scrollY > this.$el.offsetHeight;
    },

    get isScrolledBottom(): boolean {
      return this.scrollY >= document.body.offsetHeight - window.innerHeight;
    },

    onScroll() {
      this.scrollYHistory = this.scrollY;
      this.scrollY = window.scrollY;

      const targets = document.querySelectorAll('[data-header-white]');

      let i = targets.length;

      while (i--) {
        const target = targets[i];
        if (!target) continue;
        const { top, bottom } = target.getBoundingClientRect();

        if (bottom < 0) continue;

        if (top <= this.$root.offsetHeight && bottom >= this.$root.offsetHeight) {
          this.isLight = true;
        } else {
          this.isLight = false;
        }
      }
    },
  };
});

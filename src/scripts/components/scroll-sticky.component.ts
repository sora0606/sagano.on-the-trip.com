import Alpine from 'alpinejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { clamp } from '../libs/_utils';

Alpine.data('scrollSticky', () => {
  gsap.registerPlugin(ScrollTrigger);

  let root;

  return {
    direction: 1,
    total: 0,
    current: 0,
    currentNext: 0,
    progress: 0,

    init() {
      if (import.meta.env.DEV) {
        console.log('scrollSticky component: init');
      }

      root = this.$root;

      this.total = Number(root.dataset.total);

      gsap.to(root, {
        scrollTrigger: {
          trigger: root,
          start: () => 'top top',
          end: () => 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            this.direction = self.direction;
            this.current = clamp(Math.floor(self.progress * this.total), 0, this.total - 1);
            this.progress = self.progress * this.total - this.current;
            this.currentNext = this.current + (this.progress > 3 / 4 ? 1 : 0);
          },
        },
      });
    },
  };
});

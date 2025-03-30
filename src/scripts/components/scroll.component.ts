import Alpine from 'alpinejs';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';

Alpine.data('scroll', () => {
  gsap.registerPlugin(ScrollToPlugin);
  // @ts-ignore
  let requestId = null;

  return {
    scrollDirection: true,
    init() {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false,
      });

      //get scroll value
      // @ts-ignore
      lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        this.scrollDirection = scroll > 200 && direction !== -1;
      });

      // @ts-ignore
      function raf(time) {
        lenis.raf(time);

        // @ts-ignore
        if (requestId) cancelAnimationFrame(requestId);
        requestId = requestAnimationFrame(raf);
      }

      requestId = requestAnimationFrame(raf);

      // @ts-ignore
      this.$store.lenis.instance = lenis;
    },
    scrollTo(e: MouseEvent) {
      // @ts-ignore
      this.$store.lenis.instance.stop();
      let href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');

      if (!href) {
        href = '#top';
      }

      if (href.startsWith('/')) {
        // @ts-ignore
        this.$store.pageLink.isLink = href.replace('/', '');
        window.location.href = '/';
        return;
      }

      gsap.to(window, {
        duration: 1.2,
        overwrite: true,
        scrollTo: {
          y: href,
          offsetY: 100,
        },
        ease: 'power2.inOut',
        onComplete: () => {
          // @ts-ignore
          this.$store.lenis.instance.start();
        },
      });
    },
  };
});

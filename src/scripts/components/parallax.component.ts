import Alpine from 'alpinejs';

Alpine.data('parallax', () => {
  const THRESHOLD = 1.2;

  return {
    inView: false,

    init() {
      if (import.meta.env.DEV) {
        console.log('parallax component: init');
      }

      if (
        this.$root.dataset.parallaxMobile === undefined &&
        !window.matchMedia('(min-width: 1024px)').matches
      ) {
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            this.inView = entry.isIntersecting;
          }
        },
        {
          rootMargin: '20%',
        },
      );

      io.observe(this.$root);

      const targets = this.$root.querySelectorAll('[data-parallax]');
      const scaleTargets = this.$root.querySelectorAll('[data-parallax-scale]');

      window.addEventListener('loading:completed', () => {
        this.updateY(targets);
        this.updateScale(scaleTargets);
      });

      window.addEventListener('barba:enter', () => {
        this.updateY(targets);
        this.updateScale(scaleTargets);
      });

      this.$store.lenis.instance.on('scroll', () => {
        this.updateY(targets);
        this.updateScale(scaleTargets);
      });
    },

    updateY(targets: NodeListOf<HTMLElement>) {
      if (!this.inView) {
        return;
      }

      const wrapperRect = this.$root.getBoundingClientRect();
      let progress = Math.min((wrapperRect.top / wrapperRect.height) * -1, THRESHOLD);

      let i = targets.length;

      while (i--) {
        const target = targets[i];
        const ratio = Number(target.dataset.parallax);
        const ratioFit = target.dataset.parallaxFit !== undefined;

        if (ratioFit) {
          progress =
            progress * Math.max(0, (wrapperRect.bottom - window.innerHeight) / wrapperRect.height);
        }

        target.style.setProperty('--parallax-y', `${progress * 100 * ratio}%`);
      }
    },

    updateScale(targets: NodeListOf<HTMLElement>) {
      if (!this.inView) {
        return;
      }

      const wrapperRect = this.$root.getBoundingClientRect();
      const screenCenter = window.innerHeight * 0.5;

      const progress = Math.max(
        0,
        ((wrapperRect.top - window.innerHeight) / wrapperRect.height) * -1,
      );

      let i = targets.length;

      while (i--) {
        const target = targets[i];
        const ratio = Number(target.dataset.parallaxScale);
        const ratioFit = target.dataset.parallaxScaleFit !== undefined;
        const isCenterBased = target.dataset.parallaxScaleCenter !== undefined;

        if (ratioFit) {
          const maxScale = wrapperRect.width / target.offsetWidth;
          const scale = Math.min(maxScale, 1 + progress * ratio);
          target.style.setProperty('--parallax-scale', `${scale}`);
          continue;
        }

        if (isCenterBased) {
          const targetRect = target.getBoundingClientRect();
          const targetCenter = targetRect.top + targetRect.height / 2;
          const screenCenter = window.innerHeight * 0.5;

          const distanceFromCenter = (targetCenter - screenCenter) / (window.innerHeight * 0.75);
          const normalized = Math.max(-1, Math.min(1, distanceFromCenter));

          const t = Math.abs(normalized);
          const easedT = Math.pow(t, 1.3);

          const curve = (Math.cos(Math.PI * easedT * 0.5) - 1) / 2;

          const scale = 1 + curve * ratio;
          target.style.setProperty('--parallax-scale', `${scale}`);
          continue;
        }

        target.style.setProperty('--parallax-scale', `${1 + progress * ratio}`);
      }
    },
  };
});

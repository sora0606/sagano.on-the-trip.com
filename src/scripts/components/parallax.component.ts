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

      const targets = this.$root.querySelectorAll<HTMLElement>('[data-parallax]');
      const scaleTargets = this.$root.querySelectorAll<HTMLElement>('[data-parallax-scale]');

      // @ts-ignore
      this.$store.lenis.instance.on('scroll', () => {
        this.updateY(targets);
        this.updateScale(scaleTargets);
      });

      window.addEventListener('loading:ended', () => {
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
        if (target?.dataset?.parallax === undefined) continue;

        const ratio = Number(target.dataset.parallax);
        const ratioFit = target.dataset.parallaxFit !== undefined;

        if (ratioFit) {
          progress = Math.min(progress, 0);
        }

        target.style.setProperty('--parallax-y', `${progress * 100 * ratio}%`);
      }
    },
    updateScale(targets: NodeListOf<HTMLElement>) {
      if (!this.inView) {
        return;
      }

      const wrapperRect = this.$root.getBoundingClientRect();
      const progress = Math.max(
        0,
        ((wrapperRect.top - window.innerHeight) / wrapperRect.height) * -1,
      );

      let i = targets.length;

      while (i--) {
        const target = targets[i];
        if (target?.dataset?.parallax === undefined) continue;

        const ratio = Number(target.dataset.parallaxScale);
        const ratioFit = target.dataset.parallaxScaleFit !== undefined;

        if (ratioFit) {
          const maxScale = window.innerWidth / target.offsetWidth;
          const scale = Math.min(maxScale, 1 + progress * ratio);
          target.style.setProperty('--parallax-scale', `${scale}`);
          return;
        }

        target.style.setProperty('--parallax-scale', `${1 + progress * ratio}`);
      }
    },
  };
});

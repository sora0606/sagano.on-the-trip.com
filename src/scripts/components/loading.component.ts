import Alpine from 'alpinejs';
import { sleep } from '../libs/_utils';

Alpine.data('loading', () => {
  return {
    start: false,
    action: false,

    init() {
      if (import.meta.env.DEV) {
        console.log('loading component: init');
      }

      // @ts-ignore
      this.$store.lenis.instance.stop();
      this.start = true;

      const resolvePreLoadImages = this.preLoadImages;

      Promise.all([resolvePreLoadImages])
        .then(async () => {
          this.start = false;
          this.action = true;
          this.$dispatch('loading:ended');
          await sleep(300);
          this.$dispatch('loading:completed');
          document.body.classList.add('is-loaded');
          await sleep(1600);
          this.$root.remove();
          // @ts-ignore
          this.$store.lenis.instance.start();
        })
        .catch((error) => {
          console.error('loading error:', error);
        });
    },

    get preLoadImages() {
      const targetImages = document.querySelectorAll<HTMLImageElement>('img[data-promise]');
      const promises: Promise<void>[] = [];

      if (targetImages.length === 0) {
        return Promise.resolve();
      }

      let i = targetImages.length;

      while (i--) {
        const image = targetImages[i];

        if (!image) {
          continue;
        }

        promises.push(
          new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          }),
        );
      }

      return promises;
    },

    get preLoadVideos() {
      const targetVideos = document.querySelectorAll<HTMLVideoElement>('video[data-promise]');
      const promises: Promise<void>[] = [];

      if (!targetVideos) {
        return Promise.resolve();
      }

      let i = targetVideos.length;

      while (i--) {
        const video = targetVideos[i];

        if (!video) {
          continue;
        }

        promises.push(
          new Promise<void>((resolve) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => resolve();
          }),
        );
      }

      return promises;
    },
  };
});

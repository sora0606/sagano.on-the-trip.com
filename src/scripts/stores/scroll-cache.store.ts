import Alpine from 'alpinejs';

const name = 'scrollCache';

const store = {
  count: 0,

  init() {
    window.addEventListener('beforeunload', () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    });
  },
};

Alpine.store(name, store);

declare module 'alpinejs' {
  interface Stores {
    [name]: typeof store;
  }
}

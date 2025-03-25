import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import intersect from '@alpinejs/intersect';
import persist from '@alpinejs/persist';
import ui from '@alpinejs/ui';
import Alpine from 'alpinejs';
import { loadComponents } from './components';
import { loadStores } from './stores';

async function main() {
  // https://vitejs.dev/guide/env-and-mode.html#env-variables
  if (import.meta.env.DEV) {
    console.log({
      MODE: import.meta.env.MODE,
      BASE_URL: import.meta.env.BASE_URL,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
    });
  } else {
    console.log(
      '%c Development: https://nevers.jp',
      'color: #F2F2F2;background-color: #213030; padding: 8px;',
    );
  }

  Alpine.plugin([collapse, focus, intersect, persist, ui]);

  await Promise.all([loadComponents(), loadStores()]);

  (window as any).Alpine = Alpine;
  Alpine.start();
}

void main();

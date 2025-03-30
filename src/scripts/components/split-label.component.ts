import Alpine from 'alpinejs';
import gsap from 'gsap';
import { TextSplitter } from '../libs/text-splitter';

Alpine.data('splitLabel', (delayStepValue = 25) => {
  // prettier-ignore
  const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ',', '-', '.', '?', '/', '|', '~'];

  return {
    textElement: null,
    splitter: null,
    originalChars: [],
    isAnimating: false,

    init() {
      this.textElement = this.$el;
      this.splitText();
    },

    splitText() {
      this.splitter = new TextSplitter(this.textElement, {
        splitTypeeTypes: 'words, chars',
      });

      const lines = this.splitter.getLines();
      const words = this.splitter.getWords();
      const chars = this.splitter.getChars();

      this.originalChars = chars.map((char) => char.innerHTML);
      this.createDelays(lines, true);
      this.createDelays(words);
      this.createDelays(chars);
      this.createContentChar(chars);
    },

    createDelays(elements, lines = false) {
      const delayStep = delayStepValue as number;
      const total = elements.length;

      let centerIndices: number[] = [];

      if (total % 2 === 1) {
        const centerIndex = Math.floor(total / 2);
        centerIndices = [centerIndex];
      } else {
        const centerIndex = total / 2;
        centerIndices = [centerIndex - 1, centerIndex];
      }

      let i: number = total;

      while (i--) {
        const char = elements[i];
        const distanceFromCenter = Math.min(
          ...centerIndices.map((centerIndex) => Math.abs(i - centerIndex)),
        );

        char.style.setProperty(`${lines ? '--top-delay' : '--left-delay'}`, `${i * delayStep}ms`);
        char.style.setProperty(
          `${lines ? '--bottom-delay' : '--right-delay'}`,
          `${(total - 1) * delayStep - i * delayStep}ms`,
        );
        char.style.setProperty('--center-delay', `${distanceFromCenter * delayStep}ms`);
      }
    },

    createContentChar(elements) {
      let i: number = elements.length;

      while (i--) {
        const span = document.createElement('span');
        const char = elements[i];
        span.setAttribute('data-char', char.innerText);
        span.innerText = char.innerText;
        span.style.display = 'inline-block';
        char.innerText = '';
        char.appendChild(span);
      }
    },

    animateHack() {
      if (this.isAnimating) return;

      this.reset();
      this.isAnimating = true;

      const chars = this.splitter.getChars();

      chars.forEach((char, position) => {
        const initialHtml = char.innerHTML;

        gsap.timeline().fromTo(
          char,
          {
            opacity: 0,
          },
          {
            duration: 0.015,
            ease: 'none',
            repeat: 3,
            repeatRefresh: true,
            repeatDelay: 0.06,
            delay: (position + 1) * 0.03,
            innerHTML: () => {
              const randomChar =
                lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
              return randomChar;
            },
            onComplete: () => {
              gsap.set(char, { innerHTML: initialHtml, delay: 0.015 });
              this.isAnimating = false;
            },
            opacity: 1,
          },
        );
      });
    },

    reset() {
      const chars = this.splitter.getChars();

      chars.forEach((char, index) => {
        gsap.killTweensOf(char);
        char.innerHTML = this.originalChars[index];
      });
    },
  };
});

import Alpine from 'alpinejs';

Alpine.data('hover', () => {
  return {
    isOver: false,
    isPlaying: false,

    init() {
      if (import.meta.env.DEV) {
        console.log('hover component: init');
      }
    },

    rollEnter() {
      this.isOver = true;

      if (this.isPlaying) {
        return;
      }

      this.startRollEnter(this.$root);
    },

    rollLeave() {
      this.isOver = false;

      if (this.isPlaying) {
        return;
      }

      this.startRollLeave(this.$root);
    },

    startRollEnter(target: HTMLElement) {
      this.isPlaying = true;

      const duration = Number(target.dataset.enterTime);

      target.classList.add('is-hover');

      setTimeout(() => {
        this.endRollEnter();
      }, duration);
    },

    startRollLeave(target: HTMLElement) {
      this.isPlaying = true;

      const duration = Number(target.dataset.leaveTime);

      target.classList.remove('is-hover');

      setTimeout(() => {
        this.endRollLeave();
      }, duration);
    },

    endRollEnter() {
      this.isPlaying = false;

      if (this.isOver) {
        return;
      }

      this.startRollLeave(this.$root);
    },

    endRollLeave() {
      this.isPlaying = false;

      if (!this.isOver) {
        return;
      }

      this.startRollEnter(this.$root);
    },
  };
});

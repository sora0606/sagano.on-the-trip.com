import SplitType from 'split-type';
import { debounce } from './_utils';

export class TextSplitter {
  textElement: HTMLElement;
  onResize: Function | null;
  splitText: SplitType;

  previousContainerWidth!: number | null;

  constructor(textElement: HTMLElement, options = {}) {
    if (!textElement) throw new Error('Invalid text element provided.');

    // @ts-ignore
    const { resizeCallback, splitTypeeTypes } = options;

    this.textElement = textElement;
    this.onResize = typeof resizeCallback === 'function' ? resizeCallback : null;

    const splitOptions = splitTypeeTypes ? { type: splitTypeeTypes } : {};
    this.splitText = new SplitType(this.textElement, splitOptions as any);

    if (this.onResize) {
      this.initResizeObserver();
    }
  }

  initResizeObserver() {
    this.previousContainerWidth = null;

    const resizeObserver = new ResizeObserver(
      debounce((entries: ResizeObserverEntry[]) => this.handleResize(entries), 100),
    );
    resizeObserver.observe(this.textElement);
  }

  handleResize(entries: ResizeObserverEntry[]) {
    const [{ contentRect }] = entries;
    const width = Math.floor(contentRect.width);

    if (this.previousContainerWidth && this.previousContainerWidth !== width) {
      // @ts-ignore
      this.splitText.split();
      // @ts-ignore
      this.onResize();
    }
    this.previousContainerWidth = width;
  }

  revert() {
    return this.splitText.revert();
  }

  getLines() {
    return this.splitText.lines;
  }

  getWords() {
    return this.splitText.words;
  }

  getChars() {
    return this.splitText.chars;
  }
}

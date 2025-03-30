export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function lerp(start: number, end: number, multiplier: number) {
  return (1 - multiplier) * start + multiplier * end;
}

// Returns a range-limited number {n} between {min} and {max}
// @param {number} n - Current Value
// @param {number} min - Minimum Value
// @param {number} max - Maximum Value
// @returns {number}
export function clamp(n: number, min = 0, max = 1) {
  return Math.min(Math.max(n, min), max);
}

// Returns a normalized number {n} between {min} and {max}
// @param {number} n - Current Value
// @param {number} min - Minimum Value
// @param {number} max - Maximum Value
// @returns {number}
export function normalize(n: number, min: number, max: number) {
  return (n - min) / (max - min);
}

export const debounce = (func: Function, delay: number) => {
  let timerId: any;
  return (...args: any) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

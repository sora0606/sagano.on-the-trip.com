const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');
const rem = (px) => `${px / 16}rem`;

/**
 * Loads CSS files through Tailwind’s plugin system to enable IntelliSense support.
 *
 * This plugin scans CSS files from `src/styles/{base,components,utilities}` and appends them to
 * their respective layers.
 */
const cssFiles = plugin(({ addBase, addComponents, addUtilities }) => {
  const layers = ['base', 'components', 'utilities'];
  const stylesDir = path.join(__dirname, 'src/styles');
  const addStylesMap = {
    base: addBase,
    components: addComponents,
    utilities: addUtilities,
  };

  for (const layer of layers) {
    const layerDir = path.join(stylesDir, layer);
    const files = fs.readdirSync(layerDir);
    const addStyles = addStylesMap[layer];

    for (const file of files) {
      if (path.extname(file) === '.css') {
        const filePath = path.join(layerDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const styles = postcss.parse(content);
        addStyles(styles.nodes);
      }
    }
  }
});

/**
 * Create a responsive grid layout without media queries using CSS Grid.
 *
 * This plugin is based on a method provided by Andy Bell on piccalil.li.
 * See: https://piccalil.li/tutorial/create-a-responsive-grid-layout-with-no-media-queries-using-css-grid/
 */
const autoGrid = plugin(
  ({ addComponents, matchComponents, theme }) => {
    const values = theme('autoGrid');

    matchComponents(
      {
        'auto-grid': (value) => ({
          display: 'grid',
          'grid-template-columns': `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
        }),
      },
      { values },
    );

    addComponents({
      '.auto-grid-none': {
        display: 'revert',
        'grid-template-columns': 'revert',
      },
    });

    addComponents({
      ".container": {
        maxWidth: "100%",
        paddingRight: "calc(20 / 16 * 1rem)",
        paddingLeft: "calc(20 / 16 * 1rem)",

        "@screen md": {
          paddingRight: "calc(60 / 1440 * 100vw)",
          paddingLeft: "calc(60 / 1440 * 100vw)",
        },
      },
    });
  },
  {
    theme: {
      autoGrid: ({ theme }) => ({
        ...theme('spacing'),
      }),
    },
  },
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        ip: '375px',
        '2xl': '1440px',
      },
      fontFamily: {
        serif: ['"Noto Serif JP", serif'],
        en: ['"Nanum Myeongjo", serif'],
      },
      fontSize: {
        ...[10, 12, 13, 14, 15, 16, 17, 18, 20, 24, 28, 40, 60].reduce(
          (previousValue, currentValue) => {
            previousValue[currentValue] = rem(currentValue);
            return previousValue;
          },
          {},
        ),
      },
      colors: {
        bg: '#121212',
        black: {
          light: '#031416',
          base: '#161616',
          dark: '#0F0F0F',
          black: '#000000',
        },
        white: '#ffffff',
        gray: {
          base: '#929292',
          dark: '#373737',
        },
        orange: '#E79104',
      },
      transitionTimingFunction: {
        'sine-in': 'cubic-bezier(0.12, 0, 0.39, 0)',
        'sine-out': 'cubic-bezier(0.61, 1, 0.88, 1)',
        'sine-in-out': 'cubic-bezier(0.37, 0, 0.63, 1)',
        'quad-in': 'cubic-bezier(0.11, 0, 0.5, 0)',
        'quad-out': 'cubic-bezier(0.5, 1, 0.89, 1)',
        'quad-in-out': 'cubic-bezier(0.45, 0, 0.55, 1)',
        'cubic-in': 'cubic-bezier(0.32, 0, 0.67, 0)',
        'cubic-out': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'cubic-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'quart-in': 'cubic-bezier(0.5, 0, 0.75, 0)',
        'quart-out': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'quart-in-out': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'quint-in': 'cubic-bezier(0.64, 0, 0.78, 0)',
        'quint-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'quint-in-out': 'cubic-bezier(0.83, 0, 0.17, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'circ-in': 'cubic-bezier(0.55, 0, 1, 0.45)',
        'circ-out': 'cubic-bezier(0, 0.55, 0.45, 1)',
        'circ-in-out': 'cubic-bezier(0.85, 0, 0.15, 1)',
        'back-in': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        'back-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'back-in-out': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'strong-in': 'cubic-bezier(1, 0, 0.58, 1)',
        'strong-out': 'cubic-bezier(0.42, 0, 0, 1)',
        'heavy-in': 'cubic-bezier(1, 0, 0.9, 1)',
        'heavy-out': 'cubic-bezier(0.1, 0, 0, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries'), cssFiles, autoGrid],
};

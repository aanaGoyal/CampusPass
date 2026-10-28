/** Design tokens: palette, type and rules live here so every component shares them. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F5EF', paper: '#FFFEFA', ink: '#20211F',
        mute: '#65645E',            // darkened from #77766F so small text passes 4.5:1
        rule: '#DFDDD5', cobalt: '#315BE8',
        vermilion: '#E65A43', 'vermilion-ink': '#B93A25', // darker tone for any text use
      },
      fontFamily: {
        display: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { page: '80rem' },
    },
  },
  plugins: [],
};

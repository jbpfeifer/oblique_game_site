export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255, 87, 34, 0.15), 0 20px 50px rgba(0, 0, 0, 0.35)',
      },
      colors: {
        surface: '#1a1a1a',
      },
    },
  },
  plugins: [],
};

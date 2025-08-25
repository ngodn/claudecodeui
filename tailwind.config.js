/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'sans': ['Ubuntu', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Theme-specific color aliases for direct usage
        'rose-pine': {
          base: '#faf4ed',
          surface: '#fffaf3',
          overlay: '#f2e9e1',
          muted: '#9893a5',
          subtle: '#797593',
          text: '#575279',
          love: '#b4637a',
          gold: '#ea9d34',
          rose: '#d7827e',
          pine: '#286983',
          foam: '#56949f',
          iris: '#907aa9',
        },
        'tokyo-night': {
          bg: '#1a1b26',
          'bg-dark': '#16161e',
          'bg-highlight': '#292e42',
          terminal: '#1d202f',
          fg: '#a9b1d6',
          'fg-dark': '#828bb8',
          'fg-gutter': '#3b4261',
          dark3: '#545c7e',
          comment: '#565f89',
          dark5: '#737aa2',
          blue0: '#3d59a1',
          blue: '#7aa2f7',
          cyan: '#7dcfff',
          blue1: '#2ac3de',
          blue2: '#0db9d7',
          blue5: '#89ddff',
          blue6: '#b4f9f8',
          blue7: '#394b70',
          purple: '#bb9af7',
          magenta: '#c0caf5',
          magenta2: '#ff007c',
          red: '#f7768e',
          red1: '#db4b4b',
          orange: '#ff9e64',
          yellow: '#e0af68',
          green: '#9ece6a',
          green1: '#73daca',
          green2: '#41a6b5',
          teal: '#1abc9c',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
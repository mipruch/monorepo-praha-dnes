// const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	safelist: ["dark"],
	content: ["./src/**/*.{html,js,vue,ts}", "./index.html"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		fontSize: {
			"4sm": "0.5996rem", // extra extra extra small
			"3sm": "0.6815rem", // extra extra small
			"2sm": "0.7744rem", // extra small
			sm: ["0.8rem", "150%"], // small
			base: "1rem", // p
			lg: "1.2rem", // h6
			xl: "1.44rem", // h5
			"2xl": "1.728rem", // h4
			"3xl": "2.074rem", // h3
			"4xl": "2.488rem", // h2
			"5xl": "2.985rem", // h1
		},
		colors: {
			transparent: "transparent",
			white: "#FFFFFF",
			black: "#000000",
			border: "hsl(var(--border))",
			input: "hsl(var(--input))",
			ring: "hsl(var(--ring))",
			green: {
				DEFAULT: "#00FF00",
				dark: "#00B700",
			},
			orange: {
				DEFAULT: "#FF5A00",
			},
			yellow: {
				DEFAULT: "FFCE1F",
			},
			puerto: {
				DEFAULT: "#00B8A2",
			},
			blue: {
				DEFAULT: "#0066FF",
				light: "#B4D2FF",
			},
			grey: {
				50: "#F2F2F2",
				100: "#EEEEEE",
				200: "#E3E3E3", // Šedá tiles
				300: "#D3D3D3",
				400: "#B3B3B3",
				500: "#9E9E9E",
				600: "#808080",
				700: "#282828",
				800: "#202020",
				900: "#1A1A1A",
			},
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
		},
		extend: {
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				tag: "0.5em",
			},
			letterSpacing: {
				tag: "0.3em",
			},
			keyframes: {
				"accordion-down": {
					from: {height: 0},
					to: {height: "var(--radix-accordion-content-height)"},
				},
				"accordion-up": {
					from: {height: "var(--radix-accordion-content-height)"},
					to: {height: 0},
				},
				"collapsible-down": {
					from: {height: 0},
					to: {height: "var(--radix-collapsible-content-height)"},
				},
				"collapsible-up": {
					from: {height: "var(--radix-collapsible-content-height)"},
					to: {height: 0},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"collapsible-down": "collapsible-down 0.2s ease-in-out",
				"collapsible-up": "collapsible-up 0.2s ease-in-out",
			},
		},
	},
	// plugins: [animate],
};

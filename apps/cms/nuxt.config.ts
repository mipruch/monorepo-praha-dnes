// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: false},
	modules: ["shadcn-nuxt", "nuxt-lucide-icons"],
	css: ["~/assets/css/tailwind.css"],
	runtimeConfig: {
		"./runtimeConfig": "./runtimeConfig.window",
	},
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			htmlAttrs: {
				lang: "cs",
			},
		},
	},
	vite: {
		define: {
			"window.global": {},
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},
});

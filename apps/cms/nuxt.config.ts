// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {enabled: false},
	modules: [],
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		"./runtimeConfig": "./runtimeConfig.window",
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
});

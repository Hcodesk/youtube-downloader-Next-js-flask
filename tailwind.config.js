/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx}", // Inclure les fichiers dans le dossier app
	  "./components/**/*.{js,ts,jsx,tsx}", // Inclure les composants
	  "./api/**/*.{js,ts,jsx,tsx}", // Inclure les fichiers dans le dossier api
	],
	theme: {
	  extend: {},
	},
	plugins: [],
  };
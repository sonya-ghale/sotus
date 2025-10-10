import { createPreset } from 'svelte-ux';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/svelte-ux/**/*.{svelte,js}'],

	ux: {
		themes: {
			light: {
				primary: colors.orange[500],
				'primary-content': 'white',
				secondary: colors.blue[500],
				'surface-100': 'white',
				'surface-200': colors.gray[100],
				'surface-300': colors.gray[300],
				'surface-content': colors.gray[900],
				'color-scheme': 'light'
			},
			dark: {
				primary: colors.orange[500],
				'primary-content': 'white',
				secondary: colors.blue[500],
				'surface-100': colors.zinc[800],
				'surface-200': colors.zinc[900],
				'surface-300': colors.zinc[950],
				'surface-content': colors.zinc[100],
				'color-scheme': 'dark'
			}
		}
	},

	plugins: [
		createPreset()
		// Remove layerstack if you're not using it
	]
};

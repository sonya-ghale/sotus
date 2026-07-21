// import { createPreset } from 'svelte-ux';
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
			},
			colors: {
				'surface-variant': '#44302a',
				'on-error': '#690005',
				'secondary-container': '#47464a',
				error: '#ffb4ab',
				'surface-dim': '#1f0f0b',
				'inverse-surface': '#fddbd3',
				'on-tertiary-fixed-variant': '#004785',
				'secondary-fixed-dim': '#c8c6c9',
				'outline-variant': '#5d4038',
				'on-surface-variant': '#e7bdb2',
				'surface-container-high': '#392520',
				'on-primary': '#601400',
				outline: '#ad887e',
				'tertiary-fixed-dim': '#a5c8ff',
				tertiary: '#a5c8ff',
				'secondary-fixed': '#e4e2e5',
				background: '#1f0f0b',
				'on-tertiary-fixed': '#001c3a',
				primary: '#ffb5a0',
				'primary-fixed-dim': '#ffb5a0',
				'on-surface': '#fddbd3',
				'on-primary-fixed': '#3b0900',
				'inverse-primary': '#b12d00',
				secondary: '#c8c6c9',
				'on-secondary-container': '#b6b4b8',
				'on-primary-fixed-variant': '#872000',
				'on-secondary-fixed': '#1b1b1e',
				'inverse-on-surface': '#402c26',
				surface: '#1f0f0b',
				'on-secondary': '#303033',
				'surface-container-highest': '#44302a',
				'on-tertiary-container': '#002a53',
				'surface-container-lowest': '#190a06',
				'on-primary-container': '#541100',
				'tertiary-fixed': '#d4e3ff',
				'surface-tint': '#ffb5a0',
				'primary-fixed': '#ffdbd1',
				'on-tertiary': '#00315e',
				'error-container': '#93000a',
				'tertiary-container': '#2592ff',
				'surface-container-low': '#291712',
				'on-background': '#fddbd3',
				'surface-container': '#2d1b16',
				'primary-container': '#ff5625'
			},
			borderRadius: {
				DEFAULT: '0.25rem',
				lg: '0.5rem',
				xl: '0.75rem',
				full: '9999px'
			},
			spacing: {
				unit: '8px',
				'reading-area-width': '900px',
				'margin-desktop': '64px',
				gutter: '24px',
				'container-max-width': '1440px'
			},
			fontFamily: {
				'label-lg': ['Geist'],
				'body-md': ['Inter'],
				'display-lg': ['Montserrat'],
				'headline-lg': ['Montserrat'],
				'label-sm': ['Geist'],
				'headline-md': ['Montserrat'],
				'body-lg': ['Inter']
			},
			fontSize: {
				'label-lg': ['14px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '600' }],
				'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
				'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
				'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
				'label-sm': ['12px', { lineHeight: '1.2', fontWeight: '500' }],
				'headline-md': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
				'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }]
			}
		}
	},


	plugins: [
		createPreset()
		// Remove layerstack if you're not using it
	]
};

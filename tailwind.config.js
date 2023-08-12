/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	future: {
		hoverOnlyWhenSupported: true
	},
	theme: {
		extend: {
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif']
			},
			maxWidth: (theme) => ({
				...theme('spacing')
			}),
			minHeight: (theme) => ({
				...theme('spacing')
			}),
			borderWidth: {
				3: '3px'
			},
			brightness: {
				70: 0.7,
				80: 0.8
			}
		}
	},
	plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	future: {
		hoverOnlyWhenSupported: true
	},
	theme: {
		extend: {
			colors: {
				primary: '#5D9509'
			},
			fontFamily: {
				nunito: ['Nunito', 'sans-serif']
			},
			screens: {
				xs: '480px'
			},
			maxWidth: (theme) => ({
				...theme('spacing')
			}),
			minHeight: (theme) => ({
				...theme('spacing')
			}),
			gridAutoRows: (theme) => ({
				...theme('spacing')
			})
		}
	},
	plugins: []
};

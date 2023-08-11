/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
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

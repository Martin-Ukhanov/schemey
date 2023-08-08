import iwanthue from 'iwanthue';

export function generateColorPalette(size: number): string[] {
	return iwanthue(size, {
		clustering: 'force-vector',
		colorSpace: [0, 360, 0, 100, 0, 100]
	});
}

export function colorPaletteToSlug(colorPalette: string[]): string {
	let slug = '';

	for (let i = 0; i < colorPalette.length; i++) {
		slug += colorPalette[i].slice(1);

		if (i !== colorPalette.length - 1) {
			slug += '-';
		}
	}

	return slug;
}

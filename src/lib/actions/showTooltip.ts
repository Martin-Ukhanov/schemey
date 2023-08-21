import { tooltip } from '$lib/stores/tooltip';

export function showTooltip(
	node: HTMLElement,
	{ position, message }: { position: 'top' | 'bottom'; message: string }
) {
	let timeout: number;
	let mouseDown = false;

	function onMouseEnter(): void {
		if (!mouseDown) {
			timeout = setTimeout(() => {
				const rect = node.getBoundingClientRect();

				tooltip.set({
					visible: true,
					position: position,
					x: rect.left + node.offsetWidth / 2,
					y: position === 'top' ? rect.top - 2 : rect.bottom + 2,
					message: message
				});
			}, 1000);
		}
	}

	function hide(): void {
		clearTimeout(timeout);
		tooltip.update((value) => {
			return { ...value, visible: false };
		});
	}

	function onMouseDown(): void {
		mouseDown = true;
		hide();
	}

	function onMouseLeave(): void {
		mouseDown = false;
		hide();
	}

	node.addEventListener('mouseenter', onMouseEnter);
	node.addEventListener('mousedown', onMouseDown);
	node.addEventListener('mouseleave', onMouseLeave);

	return {
		destroy() {
			hide();
			node.removeEventListener('mouseenter', onMouseEnter);
			node.removeEventListener('mousedown', onMouseDown);
			node.removeEventListener('mouseleave', onMouseLeave);
		}
	};
}

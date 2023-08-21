import { tooltip } from '$lib/stores/tooltip';

export function showTooltip(
	node: HTMLElement,
	{ position, message }: { position: 'top' | 'bottom'; message: string }
) {
	let timeout: number;
	let scrollableParent: HTMLElement;

	function getScrollableParent(element: HTMLElement): HTMLElement {
		const isScrollable = (element: HTMLElement) => {
			const hasScrollableXContent = element.scrollWidth > element.clientWidth;
			const hasScrollableYContent = element.scrollHeight > element.clientHeight;

			const style = getComputedStyle(element);
			const isOverflowXHidden = style.overflowX.indexOf('hidden') !== -1;
			const isOverflowYHidden = style.overflowY.indexOf('hidden') !== -1;

			return (
				(hasScrollableXContent && !isOverflowXHidden) ||
				(hasScrollableYContent && !isOverflowYHidden)
			);
		};

		return !element || element === document.body
			? document.body
			: isScrollable(element)
			? element
			: getScrollableParent(<HTMLElement>element.parentNode);
	}

	function hide(): void {
		clearTimeout(timeout);
		tooltip.update((value) => {
			return { ...value, visible: false };
		});
		scrollableParent?.removeEventListener('scroll', hide);
	}

	function onMouseEnter(): void {
		timeout = setTimeout(() => {
			const rect = node.getBoundingClientRect();

			tooltip.set({
				visible: true,
				position: position,
				x: rect.left + node.offsetWidth / 2,
				y: position === 'top' ? rect.top - 4 : rect.bottom + 4,
				message: message
			});

			scrollableParent = getScrollableParent(node);
			scrollableParent.addEventListener('scroll', hide);
		}, 1000);
	}

	node.addEventListener('mouseenter', onMouseEnter);
	node.addEventListener('mousedown', hide);
	node.addEventListener('mouseleave', hide);

	return {
		destroy() {
			hide();
			node.removeEventListener('mouseenter', onMouseEnter);
			node.removeEventListener('mousedown', hide);
			node.removeEventListener('mouseleave', hide);
		}
	};
}

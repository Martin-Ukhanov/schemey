import { get } from 'svelte/store';
import { tooltip } from '$lib/stores/tooltip';
import { isResizingMenu } from '$lib/stores/generateMenu';

export function showTooltip(
	element: HTMLElement,
	{ position, message }: { position: 'top' | 'bottom'; message: string }
) {
	let timeout: NodeJS.Timeout;
	let scrollableParents: HTMLElement[];

	function getScrollableParents(
		element: HTMLElement,
		scrollableParents: HTMLElement[]
	): HTMLElement[] {
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
			? [...scrollableParents, document.body]
			: isScrollable(element)
			? getScrollableParents(<HTMLElement>element.parentNode, [...scrollableParents, element])
			: getScrollableParents(<HTMLElement>element.parentNode, scrollableParents);
	}

	function hide(): void {
		clearTimeout(timeout);
		tooltip.update((value) => {
			return { ...value, visible: false };
		});
		scrollableParents?.forEach((scrollableParent) => {
			scrollableParent.removeEventListener('scroll', hide);
		});
	}

	function onMouseEnter(): void {
		if (!get(isResizingMenu)) {
			timeout = setTimeout(() => {
				const rect = element.getBoundingClientRect();

				tooltip.set({
					visible: true,
					position: position,
					x: rect.left + element.offsetWidth / 2,
					y: position === 'top' ? rect.top - 4 : rect.bottom + 4,
					message: message
				});

				scrollableParents = getScrollableParents(element, []);
				scrollableParents.forEach((scrollableParent) => {
					scrollableParent.addEventListener('scroll', hide);
				});
			}, 1000);
		}
	}

	element.addEventListener('mouseenter', onMouseEnter);
	element.addEventListener('mousedown', hide);
	element.addEventListener('mouseleave', hide);

	return {
		destroy() {
			hide();
			element.removeEventListener('mouseenter', onMouseEnter);
			element.removeEventListener('mousedown', hide);
			element.removeEventListener('mouseleave', hide);
		}
	};
}

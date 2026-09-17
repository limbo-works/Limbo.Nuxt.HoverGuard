export type HoverGuardDirection = 'ltr' | 'ttb';

export interface HoverGuardRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface HoverGuardPosition {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export interface HoverGuardProps {
	/**
	 * Menu element. Set as a ref and passed to the component.
	 * @default null
	 */
	parent?: HTMLElement | null;
	/**
	 * Submenu element. Set as a ref and passed to the component.
	 * @default null
	 */
	child?: HTMLElement | null;
	/**
	 * Set to calculate the correct direction of the component.
	 * Based on the submenu placement relative to the parent element.
	 * @default 'ltr'
	 */
	direction?: HoverGuardDirection;
	/**
	 * Adjust the space between the cursor and the svg path in pixels.
	 * @default 5
	 */
	distanceFromCursor?: number;
	/**
	 * Adjust the delay in milliseconds before running calculations when cursor stops moving.
	 * @default 100
	 */
	timeoutDelay?: number;
	/**
	 * Visualization of the component. Used for development/testing purposes.
	 * @default false
	 */
	showBlocker?: boolean;
}

export interface HoverGuardExpose {
	/**
	 * Used to get the dimensions and placement of the parent and child elements.
	 */
	updateObjectDimensions: () => void;
	/**
	 * Used to calculate the dimensions of the blocker component.
	 */
	updateSvgDimensions: () => void;
}

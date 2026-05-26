<template>
	<svg
		v-show="child"
		:key="`hover-guard-${id}`"
		aria-hidden
		class="c-hover-guard"
		:style="{
			'--hover-guard-top': `${svgPosition.top}px`,
			'--hover-guard-left': `${svgPosition.left}px`,
			'--hover-guard-width': `${svg.width}px`,
			'--hover-guard-height': `${svg.height}px`,
		}"
	>
		<path
			v-show="togglePath"
			pointer-events="auto"
			:stroke="showBlocker ? 'red' : 'transparent'"
			:stroke-width="showBlocker ? '1px' : 'none'"
			:fill="showBlocker ? 'rgba(187,39,38,0.2)' : 'transparent'"
			:d="draw"
		/>
	</svg>
</template>

<script setup>
const props = defineProps({
	parent: { type: Object, default: null },
	child: { type: Object, default: null },
	direction: {
		type: String,
		default: 'ltr',
	},
	distanceFromCursor: {
		type: Number,
		default: 5,
	},
	timeoutDelay: {
		type: Number,
		default: 100,
	},
	showBlocker: {
		type: Boolean,
		default: false,
	},
});

const id = useId();

const parentObj = ref({ x: 0, y: 0, height: 0, width: 0 });
const childObj = ref({ x: 0, y: 0, height: 0, width: 0 });

const mousePosition = ref({
	x: typeof window !== 'undefined' ? window.innerWidth : 0,
	y: 0,
});

const oldMousePosition = ref({
	x: 0,
	y: 0,
});

const svg = ref({
	width: 0,
	height: 0,
});

const timeout = ref(null);
const rafId = ref(null);
const resizeObserver = ref(null);

// Toggle the path if the mouse is positioned between the parent and child x or y position
const togglePath = computed(() => {
	if (props.direction === 'ltr') {
		return (
			mousePosition.value.x < childObj.value.x &&
			mousePosition.value.x > parentObj.value.x
		);
	}
	if (props.direction === 'ttb') {
		return (
			mousePosition.value.y < childObj.value.y &&
			mousePosition.value.y > parentObj.value.y
		);
	}
	return false;
});

// Calculate the position of the svg area
const svgPosition = computed(() => {
	let obj = { top: 0, left: 0, right: 0, bottom: 0 };

	if (props.direction === 'ltr') {
		obj.top = childObj.value.y;
		obj.left = mousePosition.value.x - parentObj.value.x;
	}
	if (props.direction === 'ttb') {
		obj.top = mousePosition.value.y - parentObj.value.y;
		obj.left = childObj.value.x;
	}

	return obj;
});

// Draw the path based on the menu rotation
const draw = computed(() => {
	if (props.direction === 'ltr') {
		return `M 0, ${mousePosition.value.y - childObj.value.y} L ${
			svg.value.width
		}, ${svg.value.height} L ${svg.value.width}, 0 z`;
	}
	if (props.direction === 'ttb') {
		return `M 0, ${svg.value.height} L ${svg.value.width}, ${
			svg.value.height
		} L ${mousePosition.value.x - childObj.value.x}, 0 z`;
	}
});

// Update the dimensions of the parent and child objects
function updateObjectDimensions() {
	if (!props.parent || !props.child) return;
	const pRect = props.parent.getBoundingClientRect();
	const cRect = props.child.getBoundingClientRect();

	// Only update if dimensions actually changed to avoid unnecessary re-renders
	if (
		pRect.x !== parentObj.value.x ||
		pRect.y !== parentObj.value.y ||
		pRect.width !== parentObj.value.width ||
		pRect.height !== parentObj.value.height
	) {
		parentObj.value = pRect;
	}
	if (
		cRect.x !== childObj.value.x ||
		cRect.y !== childObj.value.y ||
		cRect.width !== childObj.value.width ||
		cRect.height !== childObj.value.height
	) {
		childObj.value = cRect;
	}
}

// Update the dimensions of the svg based on the parent, child and mouse position
function updateSvgDimensions() {
	if (props.direction === 'ltr') {
		svg.value.width = Math.max(0, childObj.value.x - mousePosition.value.x);
		svg.value.height = childObj.value.height;
	}
	if (props.direction === 'ttb') {
		svg.value.width = childObj.value.width;
		svg.value.height = Math.max(
			0,
			childObj.value.y - mousePosition.value.y
		);
	}
}

// Update the mouse position
function updateMousePosition(e) {
	if (timeout.value) clearTimeout(timeout.value);

	if (props.direction === 'ltr') {
		if (e.clientX < oldMousePosition.value.x) {
			mousePosition.value.x = e.clientX + props.distanceFromCursor;
			mousePosition.value.y = e.clientY;
		}

		if (e.clientX <= parentObj.value.x) {
			mousePosition.value.x = e.clientX;
			mousePosition.value.y = e.clientY;
		} else {
			timeout.value = setTimeout(() => {
				if (
					e.clientX === oldMousePosition.value.x &&
					e.clientY === oldMousePosition.value.y &&
					e.clientX > 0 &&
					e.clientY > 0
				) {
					mousePosition.value.x =
						e.clientX + props.distanceFromCursor;
					mousePosition.value.y = e.clientY;
					updateSvgDimensions();
				}
			}, props.timeoutDelay);
		}
	}
	if (props.direction === 'ttb') {
		if (e.clientY < oldMousePosition.value.y) {
			mousePosition.value.y = e.clientY + props.distanceFromCursor;
			mousePosition.value.x = e.clientX;
		}

		if (e.clientY <= parentObj.value.y) {
			mousePosition.value.y = e.clientY;
			mousePosition.value.x = e.clientX;
		} else {
			timeout.value = setTimeout(() => {
				if (
					e.clientX === oldMousePosition.value.x &&
					e.clientY === oldMousePosition.value.y &&
					e.clientX > 0 &&
					e.clientY > 0
				) {
					mousePosition.value.y =
						e.clientY + props.distanceFromCursor;
					mousePosition.value.x = e.clientX;
					updateSvgDimensions();
				}
			}, props.timeoutDelay);
		}
	}

	oldMousePosition.value.x = e.clientX;
	oldMousePosition.value.y = e.clientY;
}

function handleMouseMove(e) {
	if (rafId.value) cancelAnimationFrame(rafId.value);

	rafId.value = requestAnimationFrame(() => {
		updateMousePosition(e);
		updateObjectDimensions();
		updateSvgDimensions();
	});
}

onMounted(() => {
	if (typeof ResizeObserver !== 'undefined') {
		resizeObserver.value = new ResizeObserver(() => {
			updateObjectDimensions();
			updateSvgDimensions();
		});

		if (props.parent) resizeObserver.value.observe(props.parent);
		if (props.child) resizeObserver.value.observe(props.child);
	}
});

onUnmounted(() => {
	if (props.parent)
		props.parent.removeEventListener('mousemove', handleMouseMove);
	if (resizeObserver.value) resizeObserver.value.disconnect();
	if (timeout.value) clearTimeout(timeout.value);
	if (rafId.value) cancelAnimationFrame(rafId.value);
});

watch(
	() => props.parent,
	(newParent, oldParent) => {
		if (oldParent) {
			oldParent.removeEventListener('mousemove', handleMouseMove);
			resizeObserver.value?.unobserve(oldParent);
		}
		if (newParent) {
			newParent.addEventListener('mousemove', handleMouseMove);
			resizeObserver.value?.observe(newParent);
			updateObjectDimensions();
			updateSvgDimensions();
		}
	},
	{ immediate: true }
);

watch(
	() => props.child,
	(newChild, oldChild) => {
		if (oldChild) resizeObserver.value?.unobserve(oldChild);
		if (newChild) {
			resizeObserver.value?.observe(newChild);
			updateObjectDimensions();
			updateSvgDimensions();
		}
	},
	{ immediate: true }
);

defineExpose({
	updateObjectDimensions,
	updateSvgDimensions,
});
</script>

<style lang="postcss">
:where(.c-hover-guard) {
	z-index: 99999;
	position: absolute;
	pointer-events: none;
	top: var(--hover-guard-top);
	left: var(--hover-guard-left);
	width: var(--hover-guard-width);
	height: var(--hover-guard-height);
}
</style>

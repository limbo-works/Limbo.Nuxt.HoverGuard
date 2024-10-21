<template>
	<svg
		v-if="child"
		:key="`hover-guard-${id}`"
		aria-hidden
		:style="{
			zIndex: 99999,
			position: 'absolute',
			pointerEvents: 'none',
			top: `${svgPosition.top}px`,
			left: `${svgPosition.left}px`,
			width: `${parentObj.width + gap}px`,
			height: `${parentObj.height + gap}px`,
		}"
	>
		<path
			v-if="togglePath"
			pointer-events="auto"
			:stroke="[showBlocker ? 'red' : 'transparent']"
			:stroke-width="[showBlocker ? '1px' : 'none']"
			:fill="[showBlocker ? 'rgba(187,39,38,0.2)' : 'transparent']"
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
	showBlocker: {
		type: Boolean,
		default: false,
	},
});

const id = useId();
const parentObj = ref({ x: 0, y: 0, height: 0, width: 0 });
const childObj = ref({ x: 0, y: 0, height: 0, width: 0 });
const gap = ref(0);

const mousePosition = ref({
	x: window.innerWidth,
	y: childObj.value.height,
});

const oldMousePosition = ref({
	x: 0,
	y: 0,
});

const svg = ref({
	width: 0,
	height: 0,
});

// Toggle the path if the mouse is positioned between the parent and child x or y position
const togglePath = computed(() => {
	if (props.direction === 'ltr') {
		return (
			!(
				mousePosition.value.x >= childObj.value.x ||
				mousePosition.value.x <= parentObj.value.x
			) && true
		);
	}
	if (props.direction === 'ttb') {
		return (
			!(
				mousePosition.value.y >= childObj.value.y ||
				mousePosition.value.y <= parentObj.value.y
			) && true
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
		}, ${svg.value.height} L ${svg.value.width}, ${childObj.value.y} z`;
	}
	if (props.direction === 'ttb') {
		return `M 0, ${svg.value.height} L ${svg.value.width}, ${
			svg.value.height
		} L ${mousePosition.value.x - childObj.value.x}, ${childObj.value.x} z`;
	}
});

// Update the mouse position
const updateMousePosition = (e) => {
	let timeout;

	clearTimeout(timeout);

	if (props.direction === 'ltr') {
		if (e.clientX < oldMousePosition.value.x) {
			mousePosition.value.x = e.clientX + 5;
			mousePosition.value.y = e.clientY;
		}

		if (e.clientX <= parentObj.value.x) {
			mousePosition.value.x = e.clientX;
			mousePosition.value.y = e.clientY;
		} else {
			timeout = setTimeout(() => {
				if (
					e.clientX === oldMousePosition.value.x &&
					e.clientY === oldMousePosition.value.y &&
					e.clientX > 0 &&
					e.clientY > 0
				) {
					mousePosition.value.x = e.clientX + 5;
					mousePosition.value.y = e.clientY;
				}
				updateSvgDimensions();
			}, 100);
		}
	}
	if (props.direction === 'ttb') {
		if (e.clientY < oldMousePosition.value.y) {
			mousePosition.value.y = e.clientY + 5;
			mousePosition.value.x = e.clientX;
		}

		if (e.clientY <= parentObj.value.y) {
			mousePosition.value.y = e.clientY;
			mousePosition.value.x = e.clientX;
		} else {
			timeout = setTimeout(() => {
				if (
					e.clientX === oldMousePosition.value.x &&
					e.clientY === oldMousePosition.value.y &&
					e.clientX > 0 &&
					e.clientY > 0
				) {
					mousePosition.value.y = e.clientY + 5;
					mousePosition.value.x = e.clientX;
				}
				updateSvgDimensions();
			}, 100);
		}
	}

	oldMousePosition.value.x = e.clientX;
	oldMousePosition.value.y = e.clientY;
};

// Update the dimensions of the parent and child objects
const updateObjectDimensions = () => {
	parentObj.value = {
		x: parentObj.x,
		y: parentObj.y,
		width: parentObj.width,
		height: parentObj.height,
	} = props.parent.getBoundingClientRect();

	childObj.value = {
		x: childObj.x,
		y: childObj.y,
		width: childObj.width,
		height: childObj.height,
	} = props.child.getBoundingClientRect();
};

// Update the dimensions of the svg based on the parent, child and mouse position
// as well as a possible gap between parent and child
const updateSvgDimensions = () => {
	if (props.direction === 'ltr') {
		gap.value =
			childObj.value.x - (parentObj.value.width + parentObj.value.x);

		svg.value.width =
			parentObj.value.width +
			parentObj.value.x +
			gap.value -
			mousePosition.value.x;
		svg.value.height = childObj.value.height;
	}
	if (props.direction === 'ttb') {
		gap.value =
			childObj.value.y - (parentObj.value.height + parentObj.value.y);

		svg.value.width = childObj.value.width;
		svg.value.height =
			parentObj.value.height +
			parentObj.value.y +
			gap.value -
			mousePosition.value.y;
	}
};

defineExpose({
	updateObjectDimensions,
	updateSvgDimensions,
});

const addEventListeners = (e) => {
	e.addEventListener('mousemove', updateMousePosition);
	e.addEventListener('resize', updateObjectDimensions);
	e.addEventListener('mousemove', updateObjectDimensions);
	e.addEventListener('mousemove', updateSvgDimensions);
	e.addEventListener('resize', updateSvgDimensions);
};

const removeEventListeners = (e) => {
	e.removeEventListener('mousemove', updateMousePosition);
	e.removeEventListener('resize', updateObjectDimensions);
	e.removeEventListener('mousemove', updateObjectDimensions);
	e.removeEventListener('mousemove', updateSvgDimensions);
	e.removeEventListener('resize', updateSvgDimensions);
};

watch(
	() => props.parent,
	() => {
		addEventListeners(props.parent);
		updateObjectDimensions();
		updateSvgDimensions();
	},
	{ immediate: true }
);

onUnmounted(() => {
	removeEventListeners(props.parent);
});
</script>

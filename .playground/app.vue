<template>
	<div
		v-if="hasSideMenu"
		:class="isHorizontal ? 'nav-horizontal' : 'nav-vertical'"
	></div>
	<div
		:class="[
			isHorizontal ? 'overlay-horizontal' : 'overlay-vertical',
			hasSideMenu && 'has-side-menu',
		]"
	>
		<div
			class="overlay-inner"
			:class="[
				isHorizontal
					? 'overlay-inner-horizontal'
					: 'overlay-inner-vertical',
				hasSideMenu && 'has-side-menu',
			]"
		>
			<div class="button">
				<button @click="toggleMenu(1)">1</button>
				<button @click="toggleMenu(2)">2</button>
				<button @click="hasSideMenu = !hasSideMenu">M</button>
				<button @click="isHorizontal = !isHorizontal">H</button>
			</div>
			<div
				ref="parent"
				:class="[
					isHorizontal ? 'lvl1-horizontal' : 'lvl1-vertical',
					show && showSecond && 'menu-added',
				]"
			>
				<HoverGuard
					v-if="show"
					:parent="parent"
					:child="child"
					:direction="isHorizontal ? 'ttb' : 'ltr'"
					show-blocker
				/>
				<div
					:class="[
						isHorizontal
							? 'lvl1-horizontal-inner'
							: 'lvl1-vertical-inner',
					]"
				>
					<template v-for="i in 5" :key="i">
						<h1>Menu item {{ i }}</h1>
					</template>
				</div>
			</div>
			<div
				v-show="show"
				ref="parentSecond"
				:class="[
					isHorizontal ? 'lvl2-horizontal' : 'lvl2-vertical',
					showSecond && 'menu-added',
				]"
			>
				<HoverGuard
					v-if="showSecond"
					:parent="parentSecond"
					:child="childSecond"
					:direction="isHorizontal ? 'ttb' : 'ltr'"
					show-blocker
				/>
				<div
					ref="child"
					:class="[
						isHorizontal
							? 'lvl2-horizontal-inner'
							: 'lvl2-vertical-inner',
					]"
				>
					<template v-for="i in 5" :key="i">
						<h2>Menu item {{ i }}</h2>
					</template>
				</div>
			</div>
			<div
				v-show="show && showSecond"
				:class="isHorizontal ? 'lvl3-horizontal' : 'lvl3-vertical'"
			>
				<div ref="childSecond" class="lvl3-inner"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
const parent = ref({});
const child = ref({});
const parentSecond = ref({});
const childSecond = ref({});

const show = ref(false);
const showSecond = ref(false);
const hasSideMenu = ref(true);
const isHorizontal = ref(false);

const toggleMenu = (level) => {
	if (level === 1) {
		show.value = !show.value;
		if (showSecond.value) {
			showSecond.value = false;
		}
	}
	if (level === 2) {
		showSecond.value = !showSecond.value;
	}
};
</script>

<style lang="postcss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
h1,
h2 {
	margin: 20px 0;
	color: rgb(137, 183, 183);
	cursor: pointer;
	height: fit-content;
	width: fit-content;
}
.nav-vertical {
	width: 60px;
	height: 100dvh;
	background-color: rgb(54, 92, 92);
}
.nav-horizontal {
	height: 60px;
	width: 100dvw;
	background-color: rgb(54, 92, 92);
}
.overlay-vertical {
	width: 100dvw;
	height: 100dvh;
	position: fixed;
	top: 0;
	left: 0;
}
.overlay-horizontal {
	width: 100dvw;
	height: 100dvh;
	position: fixed;
	top: 0;
	left: 0;
}

.overlay-vertical.has-side-menu {
	left: 60px;
}
.overlay-horizontal.has-side-menu {
	top: 60px;
}
.overlay-inner-vertical {
	display: flex;
	width: 100%;
	height: 100dvh;
	position: relative;
	overflow: hidden;
}
.overlay-inner-horizontal {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100dvw;
	position: relative;
	overflow: hidden;
}
.overlay-inner-vertical.has-side-menu {
	width: calc(100% - 60px);
}
.overlay-inner-horizontal.has-side-menu {
	height: calc(100% - 60px);
}
.lvl1-vertical {
	background-color: darkslategrey;
	width: 45%;
	height: 100%;
	padding: 30px 0 30px 30px;
}
.lvl1-vertical.menu-added {
	width: 30% !important;
}
.lvl1-horizontal {
	background-color: darkslategrey;
	width: 100%;
	height: 45%;
}
.lvl1-horizontal.menu-added {
	height: 30% !important;
}
.lvl1-horizontal-inner {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	padding: 30px;
}
.lvl1-vertical-inner {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.lvl2-vertical {
	background-color: darkslategrey;
	width: 45%;
	height: 100%;
	filter: brightness(0.9);
}
.lvl2-vertical.menu-added {
	width: 30% !important ;
}
.lvl2-horizontal {
	background-color: darkslategrey;
	height: 45%;
	width: 100%;
	filter: brightness(0.9);
}
.lvl2-horizontal.menu-added {
	height: 30% !important ;
}
.lvl2-horizontal-inner {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	padding: 30px;
}
.lvl2-vertical-inner {
	width: 100%;
	height: 100%;
	display: flex;
	padding: 30px 0 30px 30px;
	flex-direction: column;
}
.lvl3-vertical {
	background-color: darkslategrey;
	width: 30%;
	height: 50%;
	margin-left: 20px;
	filter: brightness(0.8);
}
.lvl3-horizontal {
	background-color: darkslategrey;
	height: 30%;
	width: 50%;
	margin-top: 20px;
	filter: brightness(0.8);
}
.lvl3-inner {
	width: 100%;
	height: 100%;
}
.button {
	position: absolute;
	bottom: 0;
	right: 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	& button {
		padding-inline: 15px;
		padding-block: 10px;
		background-color: rgb(54, 92, 92);
		border: 1px solid white;
		color: white;
		cursor: pointer;
		&:hover {
			background-color: darkslategrey;
		}
	}
}
</style>

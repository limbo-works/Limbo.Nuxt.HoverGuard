# HoverGuard

Vue component used to ensure expected hover behavior when using a menu with hover-based submenus. This is achieved by effectively blocking the ability to trigger unintended submenus when hovering.

## Installation

```
yarn add @limbo-works/hover-guard
```

## Using the component

Make the component globally usable by extending the layer in nuxt.config.js.

```bash
export default defineNuxtConfig({
    extends: [
        '@limbo-works/hover-guard',
        ...
    ],
    ...
});
```

Then you can use the `HoverGuard` component anywhere within the solution, like so:

```vue
<!-- As written in Vue -->
<!-- position relative on parent, as the child is positioned absolute -->
<div ref="parent" class="relative">
	<HoverGuard
		v-if="booleanValue"
		:parent="parent"
		:child="child"
	/>
	<div>
		<!-- Menu content goes here -->
	</div>
</div>
<div v-show="booleanValue">
	<div ref="child">
		<!-- Submenu content goes here -->
	</div>
</div>
```

This is the simple use intended for a single parent/child instance. An example for multiple instances can be seen in the [package playground](https://github.com/limbo-works/Limbo.Nuxt.HoverGuard/blob/main/.playground/app.vue).

## Props overview
| **Prop**    | **Description**                                                                                                            | **Default value**          | **Data type** |
|-------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------|---------------|
| parent      | Menu element. Set as a ref and passed to the component.                                                                    | null                       | Object        |
| child       | Submenu element. Set as a ref and passed to the component.                                                                 | null                       | Object        |
| direction   | Set to calculate the correct direction of the component.<br>Based on the submenu placement relative to the parent element. | 'ltr'<br>(_left to right_) | String        |
| showBlocker | Visualization of the component. Used for development/testing purposes.                                                     | false                      | Boolean       |

## Exposed functions
These are intended to be used to retrigger the functions that get and calculate dimensions and placement. Only if needed.
| **Function**           | **Description**                                                           |
|------------------------|---------------------------------------------------------------------------|
| updateObjectDimensions | Used to get the dimensions and placement of the parent and child element. |
| updateSvgDimensions    | Used to calculate the dimensions of the blocker component.                |

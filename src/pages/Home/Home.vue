<template>
	<div class="article">
		<h1>Perceptive Design</h1>
		<section>
			<p>
				<em>Perceptive Design</em> is a UX language and a research project to explore ideal user interfaces for all designing processes that
				<a
					href="https://baku89.com"
					target="_blank"
				>Baku Hashimoto</a> has been developing since 2019.
				The several demos showing below explain the way of thinking behind Perceptive Design and how it actually works.
			</p>
			<!-- <p class="highlight">
				<em>Dear Adobe Creative Residency Team,</em>
				<br>Though I am planning to develop functional software for vector graphics/motion design,
				I am also trying to consider the future of design tool at the level of fundamental UI/UX.
				You might think that everything's okay to introduce me with developer teams,
				yet I would like to reach out to both technical geeks and artists/designers and let them know how the progression of design tools can enpower their imaginations --
				just like how tube colors had encouraged Impressionism.
				In this age, I think something new expression yields from an intersection of artistic &amp; technical mind sets.
				And, I am convinced that to create a tool can be a way to be creative as much as to focus on a specific work with just using ready-made software.
			</p>-->
		</section>

		<PageLink
			title="0. Abstract"
		>This section explains what Perceptive Design is aiming and how it changes the way of designing.</PageLink>

		<PageLink
			title="1. List of Components"
			to="/components-list"
			thumb="./assets/page-link_components-list.png"
		>The list of UI components to adjust parameters such as a slider, number input, rotery knob, and more.</PageLink>

		<PageLink
			title="2. Parameter Control"
			to="/parameter-control"
			thumb="./assets/page-link_parameter-control.png"
		>A simple example to control parameters of an image effect.</PageLink>

		<PageLink
			title="3. Transformation Matrix"
			to="/transformation-matrix"
			thumb="./assets/page-link_transformation-matrix.png"
		>A new paradigm to transform objects by stacking transform functions in any order, instead of fixed fields of position/scale/rotation.</PageLink>

		<PageLink
			title="4. Binding Parameters with Hardware Controller"
			thumb="./assets/page-link_hardware-assign.png"
		>The UI enables to assign each parameter any hardwares not only mice and keyboards but also MIDI controllers, 3D mice, and even LeapMotion. Artists can interact to their graphics using full of their body as if musicians play intruments.</PageLink>

		<PageLink
			title="5. Velocity Curve Editor"
			to="https://www.youtube.com/watch?v=6aBBHjqAc4Y"
			thumb="./assets/page-link_velocity-curve.png"
		>The more intuitive and flexible way to make an animation.</PageLink>

		<PageLink
			title="6. Programmable Pen Tool"
			to="https://s.baku89.com/pentool/animation"
			thumb="./assets/page-link_pentool.png"
		>This is a rough prototype of doodling app. Though it just looks like orthodox vector graphics editor, all of tools (Pencil, Selection, Pen, Ellipse...) are implemented as a form of script on the right pane. Artists can modify and create any tools which ideal "touching" for them. Or some coders also introduce an approach of generative arts to classical graphics software. Thus, this is a tool to create tools.</PageLink>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

import PageLink from './PageLink.vue'

@Component({
	components: {PageLink}
})
export default class Home extends Vue {}
</script>


<style lang="stylus" scoped>
p.highlight
	padding 0.5em 0.8em
	border 1px solid darken(#eef9fb, 30)
	border-radius 0.5em
	background #eef9fb
	font-size 0.9em

	em
		display inline-block
		margin-bottom 0.5em
		color darken(#eef9fb, 60)
</style>

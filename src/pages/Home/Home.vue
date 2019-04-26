<template>
	<div class="article">
		<h1>The UI Design for Design</h1>
		<section>
			<p lang="en">
				This is a research project to explore ideal interfaces for design that I,
				<a
					href="https://baku89.com"
					target="_blank"
				>Baku Hashimoto</a>, have been developing since the end of 2017. The final purpose is to establish whole new UX language of creative tools—which I call
				<em>Perceptive Design</em> for now—and create a practical component library to develop next-generation design tool that I am planning.
			</p>
			<p
				lang="en"
			>The several demos showing below explain the way of thinking behind Perceptive Design and how it actually works.</p>
			<p lang="ja">
				このページはデザインツールのためのユーザーインターフェース・デザインについて、考察とプロトタイプをまとめたページです。僕、
				<a
					href="https://baku89.com"
					target="_blank"
				>橋本麦</a>が2017年の終わりごろから少しずつ習作を重ねています。
				このプロジェクトの目的は、デザインツールのためのUXデザイン体系（仮に
				<em>Perceptive Design</em>《知覚的デザイン》と呼ぶことにしています）を構築することです。そして最終的には、今構想しているデザインツールに使用するUIコンポーネント群を完成させます。
			</p>
			<p lang="ja">以下のデモやテキストの中で、Perceptive Designの考え方や、実際にどういう風に機能するか説明します。</p>
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

		<PageLink numbering="0. " title="Abstract">
			<span
				lang="en"
			>This section explains what Perceptive Design is aiming and how it makes the way of designing much cooler.</span>
			<span lang="ja">Perceptive Designは何を指向しているか。どんな調子で便利なのかについて。</span>
		</PageLink>

		<PageLink
			numbering="1. "
			title="List of Components"
			to="/components-list"
			thumb="./assets/page-link_components-list.png"
		>
			<span
				lang="en"
			>The list of UI components to adjust parameters such as a slider, number input, rotery knob, and more.</span>
			<span lang="ja">スライダー、数値ボックス、角度コントローラといった、UIコンポーネントの一覧。</span>
		</PageLink>

		<PageLink
			numbering="2. "
			title="Parameter Control"
			to="/parameter-control"
			thumb="./assets/page-link_parameter-control.png"
		>
			<span
				lang="en"
			>A simple example to control parameters of an image filter written in Interactive Shader Format.</span>
			<span lang="ja">パラメーター調整画面のサンプル。Interactive Shader Formatというイメージエフェクト用拡張言語のサンドボックスとしても機能します。</span>
		</PageLink>

		<PageLink
			numbering="3. "
			title="Transformation Matrix"
			to="/transformation-matrix"
			thumb="./assets/page-link_transformation-matrix.png"
		>
			<span
				lang="en"
			>A new paradigm to place objects by stacking transform functions (translate, rotate, skew, for instances) in any order, just like CSS transform. It will take place of the conventional position/scale/rotation model.</span>
			<span
				lang="ja"
			>従来の「位置・スケール・回転」モデルに代わる、より柔軟なオブジェクトの配置方法について。CSSトランスフォームの考え方を応用し、平行移動、回転、スキューなどの変形操作を自由な順番で適用していく。</span>
		</PageLink>

		<PageLink
			numbering="4. "
			title="Binding Parameters with Hardware Controller"
			thumb="./assets/page-link_hardware-assign.png"
		>
			<span
				lang="en"
			>Just like VJ software, The UI enables to assign each parameter with any hardwares not only mice and keyboards but also MIDI controllers, OSC, and even gamepads. Artists can interact to their graphics with using full of their body as if musicians play intruments.</span>
			<span
				lang="ja"
			>このUIは、VJソフトウェアのように、MIDIコントローラ、OSC、ゲームパッドの入力をパラメータやコマンドに関連付けすることができます。マウスやキーボードの他に様々なハードウェアをつかうことで、楽器演奏のように複雑かつ細やかにソフトウェアとインタラクトすることが出来ます。</span>
		</PageLink>

		<PageLink
			numbering="5. "
			title="Velocity Curve Editor"
			to="https://www.youtube.com/watch?v=6aBBHjqAc4Y"
			thumb="./assets/page-link_velocity-curve.png"
		>The more intuitive and flexible way to make an animation.</PageLink>

		<PageLink
			numbering="6. "
			title="Programmable Pen Tool"
			to="https://s.baku89.com/pentool/animation"
			thumb="./assets/page-link_pentool.png"
		>
			<span
				lang="en"
			>This is a rough prototype of doodling app. Though it just looks like orthodox vector graphics editor, all of tools (Pencil, Selection, Pen, Ellipse...) are implemented as a form of script on the right pane. Artists can modify and create any tools which ideal "touching" for them. Or some coders also introduce an approach of generative arts to classical graphics software. Thus, this is a tool to create tools.</span>
			<span
				lang="ja"
			>簡易的なお絵描きアプリのデモです。一見ただのベクターグラフィックエディタのようですが、鉛筆、ペンツール、楕円ツールといったすべてのツールがスクリプトの形で記述されており、その挙動を自由にプログラムすることができます。新しいスタイルのグラフィックを描くための、新しい使い勝手のツールから開発することができ、またグラフィックデザインの領域に、ジェネレーティブ・アート的なアプローチを取り入れることも可能です。すなわち、「ツールをつくるためのツール」です。</span>
		</PageLink>
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

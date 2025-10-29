<script>
	import Card from '../../lib/components/Card.svelte';
	import ice_cream from '$lib/images/ice_cream.png';
	import strawberry from '$lib/images/strawberry.png';
	import { onMount } from 'svelte';

	let scrollY = $state(0);

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<main class="main-component">
	<header class="header">
		<div class="title-container" style="transform: translateY({Math.min(scrollY * -0.2, -60)}px);">
			<h4
				class="animated-h4"
				style="
					transform: translateX({Math.max(scrollY * -8, -600)}px)
							 translateY({Math.max(scrollY * -0.6, -150)}px);
					position: {scrollY > 250 ? 'fixed' : 'relative'};
					top: {scrollY > 250 ? '2rem' : 'auto'};
					left: {scrollY > 250 ? '2rem' : 'auto'};
					font-size: {scrollY > 200 ? '22px' : '24px'};
                    		opacity: {scrollY > 400 ? 0 : 1}; 
		transition: all 0.4s ease-out;

				"
			>
				-ICE-CREAM WORLD-
			</h4>

			<h2
				class="animated-h2"
				style="transform: scale({1 + Math.min(scrollY / 900, 1.1)}) translateY({Math.max(
					-scrollY / 6,
					-100
				)}px);"
			>
				Strawberry
			</h2>
		</div>
	</header>

	<div class="second_container">
		<div class="image-container">
			<img
				src={ice_cream}
				alt="Strawberry Ice Cream"
				loading="lazy"
				class="image"
				style="transform: scale({1 + Math.min(scrollY / 700, 1.1)}) translateY({Math.max(
					-scrollY / 9,
					-100
				)}px);"
			/>
		</div>
		<div
			class="card-container"
			style="transform: translate(-50%, calc(-40% + {Math.max(-scrollY / 3, -120)}px));"
		>
			<Card />
		</div>
	</div>

	<div class="strawberry_back">
		<img
			src={strawberry}
			alt="strawberry:1"
			class="strawberry_one"
			style="
		top: {scrollY < 200 ? '60%' : '10%'};
		left: {scrollY < 200 ? '50%' : '75%'};
		transform: translate({scrollY < 100 ? '-50%, -50%' : '0,0'}) rotate({scrollY < 200
				? '0deg'
				: '-10deg'});
		position: absolute;
		  width: {scrollY < 200 ? '10px' : '230px'};
		transition: all 0.8s ease-out;
	"
		/>
		<img
			src={strawberry}
			alt="strawberry:2"
			class="strawberry_two"
			style="
		top: {scrollY < 200 ? '60%' : '32%'};
		left: {scrollY < 200 ? '50%' : '20%'};
		transform: translate({scrollY < 100 ? '-50%, -50%' : '0,0'}) rotate({scrollY < 200
				? '0deg'
				: '270deg'});
		position: absolute;
		  width: {scrollY < 200 ? '10px' : '280px'};
		transition: all 0.8s ease-out;
	"
		/>
		<img
			src={strawberry}
			alt="strawberry:3"
			class="strawberry_three"
			style="
		top: {scrollY < 200 ? '60%' : '60%'};
		left: {scrollY < 200 ? '50%' : '4%'};
		transform: translate({scrollY < 100 ? '-50%, -50%' : '0,0'}) rotate({scrollY < 200
				? '0deg'
				: '240deg'});
		position: absolute;
		   width: {scrollY < 200 ? '10px' : '450px'};
		transition: all 0.8s ease-out;
	"
		/>
		<img
			src={strawberry}
			alt="strawberry:4"
			class="strawberry_four"
			style="
    top: {scrollY < 200 ? '60%' : '60%'};
    left: {scrollY < 200 ? '50%' : '60%'};
    transform: translate({scrollY < 100 ? '-50%, -50%' : '0,0'}) rotate({scrollY < 200
				? '0deg'
				: '8deg'});
    position: absolute;
    width: {scrollY < 200 ? '10px' : '550px'};
    transition: all 0.8s ease-out;
  "
		/>
	</div>
</main>

<style>
	.main-component {
		background-color: #fc8eac;
		color: white;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 6rem;
		position: relative;
		z-index: 0;
	}

	.header {
		text-align: center;
		margin: 0;
		padding: 0;
		margin-top: 150px;
	}

	.title-container {
		margin-bottom: 2rem;
		position: relative;
	}

	h4,
	h2 {
		margin: 0;
		padding: 0;
		transition: all 0.4s ease;
	}

	h4 {
		font-family:
			'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
			sans-serif;
		font-size: 24px;
	}

	h2 {
		font-weight: bolder;
		font-size: 150px;
		font-family:
			league system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		letter-spacing: 6px;
		line-height: 1;
		transition:
			transform 0.3s ease,
			font-size 0.3s ease;
	}

	.second_container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: -60px;
	}

	.image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
	}

	.image {
		height: 580px;
		width: 700px;
		object-fit: contain;
		display: block;
	}

	/* Card behind the image */
	.card-container {
		position: absolute;
		top: 30%;
		left: 82%;
		transform: translate(-50%, -40%);
		z-index: 1;
		opacity: 0.9;
		background-color: transparent;
	}

	.strawberry_back {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
	}

	.strawberry_back img {
		position: absolute;
		height: auto;
		transition: transform 0.3s ease-out;
		opacity: 0.9;
	}

	/* 🍓 Strawberry 1 — Top Right, rotated */
	.strawberry_one {
		top: 50%;
		left: 40%;
		width: 230px;
		transform: translate(-50%, -50%) rotate(0deg);
	}

	/* 🍓 Strawberry 2 — Middle Left */
	.strawberry_two {
		top: 32%;
		left: 20%;
		width: 280px;
	}

	/* 🍓 Strawberry 3 — Center */
	.strawberry_three {
		top: 60%;
		left: 4%;
		/* width: 450px; */
		/* transform: rotate(240deg); */
		z-index: 2;
	}

	/* 🍓 Strawberry 4 — Bottom Right */
	.strawberry_four {
		bottom: 8%;
		right: 12%;
		/* width: 450px; */
		/* transform: rotate(8deg); */
		opacity: 0.8;
	}
</style>

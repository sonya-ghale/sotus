<script lang="ts">
	import siren_boat from '$lib/images/siren-boat.png';
	let text = 'Home Page';
	import { Button, Card, Badge } from 'svelte-ux';
</script>

<main>
	<div
		class="items-center justify-center font-sans"
		style="background-image: url({siren_boat}); height: 80vh; background-cover: cover; background-position: center;"
	>
		<h1 class="font-serif text-3xl text-white">{text}</h1>

		<!-- <input bind:value={text} /> -->
	</div>
</main>

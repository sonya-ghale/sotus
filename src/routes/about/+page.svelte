<script lang="ts">
	import { error } from '@sveltejs/kit';
	import FlakyComponent from './FlakyComponent.svelte';
	import CustomButton from './CustomButton.svelte';
	import Header from './Header.svelte';
	let name: string = 'sonima';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About this app</h1>
	<h1>Props and snippet</h1>

	<CustomButton>
		{#snippet button()}
			<button class="rounded bg-green-700 px-4 py-2 text-white">Submit</button>
			<button class="bg-green-red rounded px-4 py-2 text-white">clear</button>
		{/snippet}
	</CustomButton>

	<Header title="hehhe" subtitle="hoho">
		{#snippet header({ title, subtitle })}
			<h2>{title}</h2>
			<p>{subtitle}</p>
		{/snippet}
	</Header>

	<p>
		This is a <a href="https://svelte.dev/docs/kit">SvelteKit</a> app. You can make your own by typing
		the following into your command line and following the prompts:
	</p>

	<pre>npx sv create</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>
	<!-- where parent pass through snippet -->
	{#snippet Greeting(pName: string)}
		<p>wORKING WITH snippet{pName}</p>
	{/snippet}

	<!-- snippet can be passed to components like props -->
	<!-- children get through render tag  -->
	{@render Greeting(name)}

	<svelte:boundary onerror={(e) => console.error(e)}>
		<FlakyComponent />

		{#if true}
			<p>i am happy</p>
		{/if}

		{#snippet failed(error: unknown, reset)}
			<p>{error}</p>
			<button on:click={reset}>Reset</button>
		{/snippet}
	</svelte:boundary>
</div>

<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
	import {fade} from 'svelte/transition'
	import GenreCard from '$lib/components/GenreCard.svelte';

	let { data } = $props();

	const featured = $derived(data.featured || []);
	const trending = $derived(data.trending || []);
	const trendingGenre = $derived(data.trendingGenre || 'Action');
	const otherGenres = $derived(data.otherGenres || []);
	const error = $derived(data.error || '');

	// Rotating hero/bento logic
	// order holds indices into `featured`, order[0] iss always the current hero
	let order: number[] = $state([]);
	let rotateTimer: ReturnType<typeof setInterval> | undefined;
	let isHovering = $state(false);

	$effect(() => {
		// (re)initialize the order whenever the featured list changes/loads
		if (featured.length > 0 && order.length !== featured.length) {
			order = featured.map((_: unknown, i: number) => i).slice(0, 5);
		}	});

	// const hero = $derived(featured[0]);
	// const bento = $derived(featured.slice(1, 5));
	const hero = $derived(featured[order[0]]);
	const bento = $derived(order.slice(1).map((i) => featured[i]));

	function rotate(): void {
		if (order.length === 0) return;
		// move first index to the back → next one becomes hero
		order = [...order.slice(1), order[0]];
	}

	function startRotation(): void {
		stopRotation();
		rotateTimer = setInterval(() => {
			if (!isHovering) rotate();
		}, 5000);
	}
	function stopRotation(): void {
		if (rotateTimer) clearInterval(rotateTimer);
	}
	onMount(() => startRotation());
	onDestroy(() => stopRotation());
	
	let carouselEl: HTMLDivElement | undefined = $state();

	function scrollCarousel(direction: 'left' | 'right') {
		if (!carouselEl) return;
		const amount = direction === 'left' ? -320 : 320;
		carouselEl.scrollBy({ left: amount, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>SOTUS — Explore Genres</title>
	<meta name="description" content="Explore manga genres and discover your next favorite series." />
</svelte:head>

<main class="min-h-screen bg-[#1A1A1A] text-on-surface text-white">
	<div class="mx-auto max-w-container-max-width px-10 py-10 md:px-margin-desktop ">
		{#if error}
			<div class="rounded-xl border border-error/40 bg-error-container/20 p-8">
				<h3 class="font-headline-md text-headline-md text-error mb-2">Couldn't load genres</h3>
				<p class="text-on-surface-variant">{error}</p>
			</div>
		{:else if featured.length === 0}
			<div class="flex flex-col items-center gap-4 py-24">
				<div
					class="h-10 w-10 animate-spin rounded-full border-4 border-primary-container/20 border-t-primary-container"
				></div>
				<p class="text-on-surface-variant">Loading genres…</p>
			</div>
		{:else}
			<section class="mb-10">
				<h1 class="font-display-lg text-display-lg font-bold text-on-surface mb-3">Explore Genres</h1>
				<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
					Dive into curated collections of the world's most compelling manga narratives, categorized
					for your discovery.
				</p>
			</section>

			<section
			class="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
			role="region"
			aria-label="Featured genres"
			onmouseenter={() => (isHovering = true)}
			onmouseleave={() => (isHovering = false)}
		>
			{#if hero}
				{#key hero.id}
					<div in:fade={{ duration: 500 }} class="h-full">
						<GenreCard tag={hero} featured />
					</div>
				{/key}
			{/if}

			<div class="grid grid-cols-2 gap-4">
				{#each bento as tag (tag.id)}
					<div in:fade={{ duration: 500 }} class="h-full">
						<GenreCard {tag} />
					</div>
				{/each}
			</div>
		</section>

		<!-- All Genres Section -->
		<section class="mb-10">
			<div class="mb-4">
				<h2 class="font-headline-lg text-2xl font-semibold text-on-surface mb-2">All Genres</h2>
				<p class="font-body-md text-on-surface-variant">
					Browse the complete list — {otherGenres.length + featured.length} genres in total.
				</p>
			</div>
			<div class="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
				{#each otherGenres as tag (tag.id)}
					<a
						href="/genre/{tag.id}"
						class="font-body-md text-on-surface-variant text-center border border-outline-variant/20 rounded-full p-2 hover:bg-red-500 hover:font-semibold hover:text-white transition hover:text-primary-container text-[#FDDBD3]"
					>
						{tag.name}
					</a>
				{/each}
			</div>
		</section>

			<!-- Trending Manga Section -->
			{#if trending.length > 0}
				<section class=" border-t border-outline-variant/10 pt-8">
					<div class="mb-8 flex items-end justify-between gap-4">
						<div>
							<h2 class="font-headline-lg font-semibold text-2xl text-on-surface mb-2">
								Trending in {trendingGenre}
							</h2>
							<p class="font-body-md text-on-surface-variant">
								The most followed series in this genre right now.
							</p>
						</div>
						<div class="hidden gap-2 sm:flex">
							<button
								type="button"
								class="flex h-10 w-10 items-center bg-[#333333] hover:bg-red-500 justify-center rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface transition hover:border-primary-container hover:text-primary-container"
								aria-label="Scroll left"
								onclick={() => scrollCarousel('left')}
							>
								←
							</button>
							<button
								type="button"
								class="flex h-10 w-10 items-center bg-[#333333] hover:bg-red-500 justify-center rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface transition hover:border-primary-container hover:text-primary-container"
								aria-label="Scroll right"
								onclick={() => scrollCarousel('right')}
							>
								→
							</button>
						</div>
					</div>

					<div
						bind:this={carouselEl}
						class="flex gap-5 overflow-x-auto pb-4 scrollbar-thin"
					>
						{#each trending as manga (manga.id)}
							<a href="/manga/{manga.id}" class="w-44 shrink-0">
								<div class="mb-3 overflow-hidden rounded-lg border border-outline-variant/20">
									<img
										src={manga.coverUrl}
										alt="Cover for {manga.title}"
										class="aspect-[2/3] w-full object-cover transition hover:scale-105"
										loading="lazy"
									/>
								</div>
								<h3 class="font-label-lg text-label-lg text-on-surface line-clamp-2 mb-1">
									{manga.title}
								</h3>
								<p class="font-label-sm text-on-surface-variant capitalize">{manga.status}</p>
								<div class="mt-2 h-0.5 w-full rounded-full bg-surface-container-high">
									<div class="h-full w-2/3 rounded-full bg-primary-container"></div>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<!-- TODO: Add in later days -->
			<!-- <section class="mb-20 rounded-2xl border border-outline-variant/20 bg-surface-container p-8 md:p-12">
				<h2 class="font-headline-lg text-headline-lg text-on-surface mb-3">Never Miss a Release</h2>
				<p class="font-body-md text-on-surface-variant mb-6 max-w-xl">
					Subscribe to get the latest chapter updates and new series alerts delivered to your inbox.
				</p>
				<form class="flex max-w-lg flex-col gap-3 sm:flex-row" onsubmit={(e) => e.preventDefault()}>
					<input
						type="email"
						placeholder="Enter your email"
						class="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:border-primary-container"
					/>
					<button
						type="submit"
						class="rounded-lg bg-primary-container px-6 py-3 font-label-lg text-label-lg text-on-primary transition hover:brightness-110"
					>
						Subscribe
					</button>
				</form>
			</section> -->


		{/if}
	</div>
</main>

<style>
	.scrollbar-thin {
		scrollbar-width: thin;
		scrollbar-color: #5d4038 transparent;
	}

	.scrollbar-thin::-webkit-scrollbar {
		height: 6px;
	}

	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: #5d4038;
		border-radius: 999px;
	}
</style>

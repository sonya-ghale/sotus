<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();

	const mangaList = $derived(data.mangaList || []);
	const totalPages = $derived(data.totalPages || 1);
	const currentPage = $derived(data.currentPage || 1);
	const searchQuery = $derived(data.searchQuery || '');
	const error = $derived(data.error || '');

	let loading: boolean = $state(false);

	// Hero carousel
	const heroManga = $derived(mangaList.slice(0, 8));
	let activeIndex: number = $state(0);
	let isHovering: boolean = $state(false);
	let autoplayTimer: ReturnType<typeof setInterval> | undefined;

	function goTo(index: number): void {
		if (heroManga.length === 0) return;
		activeIndex = (index + heroManga.length) % heroManga.length;
	}
	function goNext(): void {
		goTo(activeIndex + 1);
	}
	function startAutoplay(): void {
		stopAutoplay();
		autoplayTimer = setInterval(() => {
			if (!isHovering) goNext();
		}, 4000);
	}
	function stopAutoplay(): void{
		if (autoplayTimer) clearInterval(autoplayTimer);
	}

	onMount(() => startAutoplay());
</script>

<svelte:head>
	<title>SOTUS — Browse Manga</title>
	<meta name="description" content="Read manga online with me." />
</svelte:head>

<main class="bg-[#1A1A1A]">
	<div class="p-10">

		<!-- Hero section scrollbar -->
		<div>
			{#if heroManga.length > 0}
			<div
				class="relative w-full h-[420px] md:h-[700px] rounded-2xl overflow-hidden mb-10 group"
				role="region"
				onmouseenter={() => (isHovering = true)}
				onmouseleave={() => (isHovering = false)}
			>
				{#each heroManga as manga, i (manga.id)}
					<div
						class="absolute inset-0 transition-opacity duration-700 ease-in-out"
						class:opacity-100={i === activeIndex}
						class:opacity-0={i !== activeIndex}
						class:pointer-events-none={i !== activeIndex}
					>
						<!-- Full width cover image -->
						<img
						src={manga.coverUrl}
						alt=""
						aria-hidden="true"
						class="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50"
					/>
						<!-- Sharp, full, uncropped cover on top -->
						<img
						src={manga.coverUrl}
						alt={`Cover for ${manga.title}`}
						class="relative w-full h-full object-contain"
					/>

						<!-- Gradient overlay for readability -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"
						></div>

						<!-- Content -->
						<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
							<!-- Tags -->
							<div class="flex flex-wrap gap-2 mb-3">
								{#each manga.tags.slice(0, 3) as tag (tag)}
									<span
										class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
									>
										{tag}
									</span>
								{/each}
							</div>

							<!-- Title -->
							<h2 class="text-2xl md:text-4xl font-bold text-white mb-4 max-w-2xl">
								{manga.title}
							</h2>
							<div
							>
								<a
									href={`/manga/${manga.id}`}
									class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
								>
									Read Chapter
								</a>
							</div>
						</div>
					</div>
				{/each}

				<!-- Dots / scrollbar indicator -->
				<div class="absolute bottom-4 right-6 flex gap-2 z-10">
					{#each heroManga as manga, i (manga.id)}
						<button
							aria-label={`Go to ${manga.title}`}
							onclick={() => goTo(i)}
							class="h-1.5 rounded-full transition-all duration-300 {i === activeIndex
								? 'w-6 bg-white'
								: 'w-1.5 bg-white/40 hover:bg-white/60'}"
						></button>
					{/each}
				</div>
			</div>
		{/if}
		</div>


		<!-- Search section -->
		<div class="search-section">
			<form method="get" class="search-box">
				<input
					type="text"
					name="search"
					value={searchQuery}
					placeholder="Search manga by title..."
					class="rounded-xl"
				/>
				<input type="hidden" name="page" value="1" />
				<button type="submit" disabled={loading} class="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
					{loading ? 'Searching...' : 'Search'}
				</button>
			</form>
		</div>

		<div class="mb-10">
			<h1 class="text-2xl font-bold text-white">Manga you may like</h1>
			<p class="text-white">List of manga by mangadex</p>
		</div>
		<!-- Below is the list of manga -->
		{#if loading}
			<div class="loading">
				<div class="spinner"></div>
				<p>Loading manga...</p>
			</div>
		{:else if error}
			<div class="error">
				<h3>Error Loading Manga</h3>
				<p>{error}</p>
				<a href="?" class="retry-btn">Try Again</a>
			</div>
		{:else}
			<div class="manga-grid">
				{#each mangaList as manga (manga.id)}
					<a href="/manga/{manga.id}" class="manga-card">
						<div class="manga-cover">
							<img src={manga.coverUrl} alt={`Cover for ${manga.title}`} loading="lazy" />
						</div>
						<div class="manga-info">
							<h3 class="manga-title">{manga.title}</h3>
							<p class="manga-status">Status: {manga.status}</p>

							{#if manga.year}
								<p class="manga-year">Year: {manga.year}</p>
							{/if}

							<div class="manga-tags">
								{#each manga.tags.slice(0, 3) as tag (tag)}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>
					</a>
				{/each}
			</div>

			{#if totalPages > 1}
				<div class="pagination">
					{#if currentPage > 1}
						<a
							href={`?page=${currentPage - 1}&search=${encodeURIComponent(searchQuery)}`}
							class="page-btn"
						>
							Previous
						</a>
					{:else}
						<span class="page-btn disabled">Previous</span>
					{/if}

					<span class="page-info">
						Page {currentPage} of {totalPages}
					</span>

					{#if currentPage < totalPages}
						<a
							href={`?page=${currentPage + 1}&search=${encodeURIComponent(searchQuery)}`}
							class="page-btn"
						>
							Next
						</a>
					{:else}
						<span class="page-btn disabled">Next</span>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</main>

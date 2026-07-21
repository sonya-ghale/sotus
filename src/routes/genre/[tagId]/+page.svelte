<script lang="ts">
	let { data } = $props();

	const tag = $derived(data.tag);
	const mangaList = $derived(data.mangaList || []);
	const totalPages = $derived(data.totalPages || 1);
	const currentPage = $derived(data.currentPage || 1);
	const total = $derived(data.total || 0);
	const loadError = $derived(data.error || '');
</script>

<svelte:head>
	<title>SOTUS — {tag.name} Manga</title>
	<meta name="description" content="Browse {total.toLocaleString()} {tag.name} manga series on SOTUS." />
</svelte:head>

<main class="min-h-screen bg-[#1A1A1A] text-on-surface text-white">
	<div class="mx-auto max-w-container-max-width px-10 py-10 md:px-margin-desktop ">
		<a
			href="/genre"
			class="inline-flex items-center gap-2 font-label-sm transition hover:text-primary-container bg-red-500 text-white px-4 py-2 rounded-md"
		>
			Back to Genres
		</a>

		<header class="mb-12 mt-2">
			<h1 class="font-semibold text-display-lg text-on-surface mb-3">{tag.name} Collection</h1>
			<p class="font-body-lg text-body-lg text-on-surface-variant">
				{total.toLocaleString()} series available in this genre.
			</p>
		</header>

		{#if loadError}
			<div class="rounded-xl border border-error/40 bg-error-container/20 p-8">
				<h3 class="font-headline-md text-headline-md text-error mb-2">Couldn't load manga</h3>
				<p class="text-on-surface-variant">{loadError}</p>
				<a href="?" class="mt-4 inline-block text-primary-container hover:underline">Try again</a>
			</div>
		{:else if mangaList.length === 0}
			<div class="rounded-xl border border-outline-variant/20 bg-surface-container p-12 text-center">
				<p class="font-body-lg text-on-surface-variant">No manga found for this genre.</p>
			</div>
		{:else}
			<div class="manga-grid">
				{#each mangaList as manga (manga.id)}
					<a
						href="/manga/{manga.id}"
						class="manga-card"
					>
						<div class="manga-cover">
							<img
								src={manga.coverUrl}
								alt="Cover for {manga.title}"
								loading="lazy"
							/>
						</div>
						<div class="manga-info">
							<h3 class="manga-title">
								{manga.title}
							</h3>
							<p class="manga-status">
								Status: {manga.status}	
							</p>
							{#if manga.year}
								<p class="manga-year">Year: {manga.year}</p>
								{/if}

							<div class="manga-tags">
								{#each manga.tags.slice(0, 2) as genreTag (genreTag)}
									<span class="tag">									>
										{genreTag}
									</span>
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
							href="?page={currentPage - 1}"
							class="page-btn"
						>
							Previous
						</a>
					{:else}
						<span class="page-btn disabled"
						>
							Previous
						</span>
					{/if}

					<span class="page-info">
						Page {currentPage} of {totalPages}
					</span>

					{#if currentPage < totalPages}
						<a
							href="?page={currentPage + 1}"
							class="page-btn"
						>
							Next
						</a>
					{:else}
						<span
						class="page-btn disabled"
						>
							Next
						</span>
					{/if}
					</div>
			{/if}
		{/if}
	</div>
</main>

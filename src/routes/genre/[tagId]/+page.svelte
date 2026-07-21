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

<main class="min-h-screen bg-background text-on-surface">
	<div class="mx-auto max-w-container-max-width px-6 py-10 md:px-margin-desktop md:py-14">
		<a
			href="/manga-tag"
			class="mb-8 inline-flex items-center gap-2 font-label-sm text-on-surface-variant transition hover:text-primary-container"
		>
			← Back to Genres
		</a>

		<header class="mb-12">
			<span class="mb-2 block font-label-sm uppercase tracking-widest text-primary-container">
				Genre
			</span>
			<h1 class="font-display-lg text-display-lg text-on-surface mb-3">{tag.name}</h1>
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
			<div class="grid grid-cols-2 gap-gutter sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each mangaList as manga (manga.id)}
					<a
						href="/manga/{manga.id}"
						class="group overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container transition hover:-translate-y-1 hover:border-primary-container/40"
					>
						<div class="overflow-hidden">
							<img
								src={manga.coverUrl}
								alt="Cover for {manga.title}"
								class="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
						<div class="p-4">
							<h2 class="font-label-lg text-label-lg text-on-surface line-clamp-2 mb-2">
								{manga.title}
							</h2>
							<p class="font-label-sm text-on-surface-variant capitalize mb-3">
								{manga.status}
								{#if manga.year}
									· {manga.year}
								{/if}
							</p>
							<div class="flex flex-wrap gap-1.5">
								{#each manga.tags.slice(0, 2) as genreTag}
									<span
										class="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-on-surface-variant"
									>
										{genreTag}
									</span>
								{/each}
							</div>
						</div>
					</a>
				{/each}
			</div>

			{#if totalPages > 1}
				<nav class="mt-14 flex items-center justify-center gap-6" aria-label="Pagination">
					{#if currentPage > 1}
						<a
							href="?page={currentPage - 1}"
							class="rounded-lg border border-outline-variant/30 bg-surface-container px-5 py-2.5 font-label-lg text-on-surface transition hover:border-primary-container hover:text-primary-container"
						>
							Previous
						</a>
					{:else}
						<span
							class="rounded-lg border border-outline-variant/10 bg-surface-container-low px-5 py-2.5 font-label-lg text-on-surface-variant/50"
						>
							Previous
						</span>
					{/if}

					<span class="font-label-lg text-on-surface-variant">
						Page {currentPage} of {totalPages}
					</span>

					{#if currentPage < totalPages}
						<a
							href="?page={currentPage + 1}"
							class="rounded-lg border border-outline-variant/30 bg-surface-container px-5 py-2.5 font-label-lg text-on-surface transition hover:border-primary-container hover:text-primary-container"
						>
							Next
						</a>
					{:else}
						<span
							class="rounded-lg border border-outline-variant/10 bg-surface-container-low px-5 py-2.5 font-label-lg text-on-surface-variant/50"
						>
							Next
						</span>
					{/if}
				</nav>
			{/if}
		{/if}
	</div>
</main>

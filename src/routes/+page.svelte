<script lang="ts">
	let { data } = $props();

	const mangaList = $derived(data.mangaList || []);
	const totalPages = $derived(data.totalPages || 1);
	const currentPage = $derived(data.currentPage || 1);
	const searchQuery = $derived(data.searchQuery || '');
	const error = $derived(data.error || '');

	let loading: boolean = $state(false);

	function handleKeydown(e: KeyboardEvent, action: () => void): void {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			action();
		}
	}

	function viewManga(mangaId: string): void {
		console.log('View manga:', mangaId);
	}
</script>

<svelte:head>
	<title>SOTUS — Browse Manga</title>
	<meta name="description" content="Read manga online with me." />
</svelte:head>

<main class="manga-page">
	<div class="container">
		<h1>Browse Manga</h1>

		<div class="search-section">
			<form method="get" class="search-box">
				<input
					type="text"
					name="search"
					value={searchQuery}
					placeholder="Search manga by title..."
				/>
				<input type="hidden" name="page" value="1" />
				<button type="submit" disabled={loading}>
					{loading ? 'Searching...' : 'Search'}
				</button>
			</form>
		</div>

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
					<button
						class="manga-card"
						onclick={() => viewManga(manga.id)}
						onkeydown={(e) => handleKeydown(e, () => viewManga(manga.id))}
					>
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
								{#each manga.tags.slice(0, 3) as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</div>
					</button>
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

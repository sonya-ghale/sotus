<script lang="ts">
	import '../../app.css';

	let { data } = $props();

	const serverData = $derived(data.serverData);
	const mangaList = $derived(data.mangaList);
	const totalPages = $derived(data.totalPages);
	const currentPage = $derived(data.currentPage);
	const searchQuery = $derived(data.searchQuery);
	const error = $derived(data.error);

	let loading: boolean = $state(false);

	function handleKeydown(e: KeyboardEvent, action: () => void): void {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			action();
		}
	}

	// Page Navigation - uses URL navigation
	function goToPage(page: number): void {
		if (page >= 1 && page <= totalPages) {
			// Navigate to new page with URL parameters
			const url = new URL(window.location.href);
			url.searchParams.set('page', page.toString());
			window.location.href = url.toString();
		}
	}

	// View manga details
	function viewManga(mangaId: string): void {
		console.log('View manga:', mangaId);
		// Example: goto(`/manga/${mangaId}`);
	}
</script>

<main class="manga-page">
	<div class="container">
		<h1>SOTUS</h1>

		<!-- Server Data Display -->
		<div style="background: #f0f0f0; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
			<div style="text-size: 1.2rem; font-weight: bold;">
				Checking how to send data from server to client side
			</div>
			<strong>Server Message:</strong>
			{serverData.message} <br />
			<strong>Server Time:</strong>
			{new Date(serverData.timeStamp).toLocaleString()}
		</div>

		<!-- Search Section - Using Form for Server-side Search -->
		<div class="search-section">
			<form method="get" class="search-box">
				<!-- <form use:enhance method="get" class="search-box"> -->
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

		<!-- Loading State - Only shows during client-side navigation -->
		{#if loading}
			<div class="loading">
				<div class="spinner"></div>
				<p>Loading manga...</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="error">
				<h3>Error Loading Manga</h3>
				<p>{error}</p>
				<a href="?" class="retry-btn">Try Again</a>
			</div>
		{:else}
			<!-- Manga Grid -->
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

			<!--  -->
			<!-- Pagination -->
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

<script lang="ts">
	let { data } = $props();
	const tags = $derived(data.tags || []);
	const error = $derived(data.error || '');
</script>

<main>
	<div>
		<h2>Manga Tags</h2>

		{#if error}
			<div style="color: red; padding: 1rem; background: #fee;">
				<h3>Error Loading Tags</h3>
				<p>{error}</p>
				<p>Check if API endpoint exists at: /api/manga?endpoint=manga/tag</p>
			</div>
		{:else if tags.length === 0}
			<div class="loading">
				<div class="spinner"></div>
				<p>Loading tags...</p>
			</div>
		{:else}
			<div>
				<p>Loaded {tags.length} tags</p>
				{#each tags as tag, idx (tag.id)}
					<div class="tag-row">
						<div class="flex mb-4">
						
							<strong>({idx + 1}) {tag.name}</strong>
							<div class="group">({tag.group})</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.group {
		color: #666;
		font-size: 0.9em;
		margin-left: 0.5rem;
	}
</style>

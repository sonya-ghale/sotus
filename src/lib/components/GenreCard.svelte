<script lang="ts">
	import type { EnrichedTag } from '$lib/mangadex';

	let { tag, featured = false }: { tag: EnrichedTag; featured?: boolean } = $props();

	const seriesLabel = $derived(
		`${tag.seriesCount.toLocaleString()} Series Available`
	);
</script>

<a
	href="/manga-tag/{tag.id}"
	class="genre-card group relative block overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container transition-transform duration-300 hover:scale-[1.02]"
	class:featured
>
	<img
		src={tag.coverUrl}
		alt="{tag.name} genre cover"
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		loading="lazy"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10"></div>

	<div class="relative z-10 flex h-full flex-col justify-end p-6">
		{#if featured}
			<span class="mb-2 block font-label-sm uppercase tracking-widest text-primary-container">
				Featured Category
			</span>
		{/if}
		<h3 class="font-headline-md text-headline-md text-white" class:font-headline-lg={featured} class:text-headline-lg={featured}>
			{tag.name}
		</h3>
		<p class="mt-1 font-label-sm text-on-surface-variant">{seriesLabel}</p>
	</div>
</a>

<style>
	.genre-card {
		min-height: 220px;
	}

	.genre-card.featured {
		min-height: 460px;
	}

	@media (max-width: 1023px) {
		.genre-card.featured {
			min-height: 320px;
		}
	}
</style>

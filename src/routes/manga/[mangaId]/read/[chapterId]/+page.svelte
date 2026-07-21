<script lang="ts">
	import { formatChapterLabel } from '$lib/mangadex';

	let { data } = $props();

	const mangaId = $derived(data.mangaId);
	const chapter = $derived(data.chapter);
	const pageUrls = $derived(data.pageUrls);
	const prevChapterId = $derived(data.prevChapterId);
	const nextChapterId = $derived(data.nextChapterId);
	const mangaTitle = $derived(data.mangaTitle);
	const chapterLabel = $derived(formatChapterLabel(chapter));

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' && prevChapterId) {
			window.location.href = `/manga/${mangaId}/read/${prevChapterId}`;
		}

		if (event.key === 'ArrowRight' && nextChapterId) {
			window.location.href = `/manga/${mangaId}/read/${nextChapterId}`;
		}
	}
</script>

<svelte:head>
	<title>SOTUS — {mangaTitle} · {chapterLabel}</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="reader min-h-screen bg-black text-white">
	<header
		class="sticky top-0 z-20 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur md:px-8"
	>
		<div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
			<a
				href="/manga/{mangaId}"
				class="truncate font-label-sm text-white/70 transition hover:text-primary-container"
			>
				← {mangaTitle}
			</a>
			<p class="truncate font-label-lg text-center">{chapterLabel}</p>
			<p class="font-label-sm text-white/50">{pageUrls.length} pages</p>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-2 py-4">
		{#each pageUrls as pageUrl, index (pageUrl)}
			<img
				src={pageUrl}
				alt="Page {index + 1} of {chapterLabel}"
				class="mb-1 w-full bg-zinc-900"
				loading={index < 3 ? 'eager' : 'lazy'}
			/>
		{/each}
	</main>

	<footer
		class="sticky bottom-0 z-20 border-t border-white/10 bg-black/90 px-4 py-4 backdrop-blur md:px-8"
	>
		<div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
			{#if prevChapterId}
				<a
					href="/manga/{mangaId}/read/{prevChapterId}"
					class="rounded-lg border border-white/20 px-4 py-2 font-label-sm transition hover:border-primary-container hover:text-primary-container"
				>
					← Previous
				</a>
			{:else}
				<span class="rounded-lg border border-white/10 px-4 py-2 font-label-sm text-white/30">
					← Previous
				</span>
			{/if}

			<a
				href="/manga/{mangaId}"
				class="font-label-sm text-white/70 transition hover:text-primary-container"
			>
				Chapter List
			</a>

			{#if nextChapterId}
				<a
					href="/manga/{mangaId}/read/{nextChapterId}"
					class="rounded-lg border border-white/20 px-4 py-2 font-label-sm transition hover:border-primary-container hover:text-primary-container"
				>
					Next →
				</a>
			{:else}
				<span class="rounded-lg border border-white/10 px-4 py-2 font-label-sm text-white/30">
					Next →
				</span>
			{/if}
		</div>
	</footer>
</div>

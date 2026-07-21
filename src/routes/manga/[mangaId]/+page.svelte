<script lang="ts">
	import { formatChapterLabel } from '$lib/mangadex';

	let { data } = $props();

	const manga = $derived(data.manga);
	const chapters = $derived(data.chapters || []);
	const chapterSource = $derived(data.chapterSource || 'en');
	const chaptersError = $derived(data.chaptersError || '');
	const firstChapterId = $derived(data.firstChapterId);
</script>

<svelte:head>
	<title>SOTUS — {manga.title}</title>
	<meta name="description" content={manga.description.slice(0, 160)} />
</svelte:head>

<main class="min-h-screen bg-background text-on-surface">
	<div class="mx-auto max-w-container-max-width px-6 py-10 md:px-margin-desktop md:py-14">
		<a
			href="/"
			class="mb-8 inline-flex items-center gap-2 font-label-sm text-on-surface-variant transition hover:text-primary-container"
		>
			← Back to Browse
		</a>

		<section class="mb-14 grid gap-10 lg:grid-cols-[280px_1fr]">
			<div class="mx-auto w-full max-w-xs lg:mx-0">
				<img
					src={manga.coverUrl}
					alt="Cover for {manga.title}"
					class="w-full rounded-xl border border-outline-variant/20 shadow-lg"
				/>
			</div>

			<div>
				<span class="mb-2 block font-label-sm uppercase tracking-widest text-primary-container">
					Manga Details
				</span>
				<h1 class="font-display-lg text-display-lg text-on-surface mb-4">{manga.title}</h1>

				{#if manga.altTitles.length > 0}
					<p class="font-body-md text-on-surface-variant mb-4">
						Also known as: {manga.altTitles.slice(0, 3).join(' · ')}
					</p>
				{/if}

				<div class="mb-6 flex flex-wrap gap-3">
					<span class="rounded-full bg-surface-container px-3 py-1 font-label-sm capitalize">
						{manga.status}
					</span>
					{#if manga.year}
						<span class="rounded-full bg-surface-container px-3 py-1 font-label-sm">
							{manga.year}
						</span>
					{/if}
					{#if manga.demographic}
						<span class="rounded-full bg-surface-container px-3 py-1 font-label-sm capitalize">
							{manga.demographic}
						</span>
					{/if}
				</div>

				<p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-3xl leading-relaxed">
					{manga.description}
				</p>

				<div class="mb-8 flex flex-wrap gap-2">
					{#each manga.tags as tag}
						<span class="rounded-full bg-surface-container-high px-3 py-1 font-label-sm text-on-surface-variant">
							{tag}
						</span>
					{/each}
				</div>

				{#if firstChapterId}
					<a
						href="/manga/{manga.id}/read/{firstChapterId}"
						class="inline-flex rounded-lg bg-primary-container px-6 py-3 font-label-lg text-on-primary transition hover:brightness-110"
					>
						Start Reading
					</a>
				{/if}
			</div>
		</section>

		<section>
			<div class="mb-8 flex items-end justify-between gap-4">
				<div>
					<h2 class="font-headline-lg text-headline-lg text-on-surface mb-2">Chapters</h2>
					<p class="font-body-md text-on-surface-variant">
						{#if chapters.length > 0}
							{chapters.length}
							{chapterSource === 'en' ? 'English' : 'available'}
							{chapters.length === 1 ? 'chapter' : 'chapters'} ready to read
						{:else}
							No readable chapters found
						{/if}
					</p>
				</div>
			</div>

			{#if chaptersError}
				<div class="rounded-xl border border-error/40 bg-error-container/20 p-8 mb-6">
					<h3 class="font-headline-md text-headline-md text-error mb-2">Couldn't load chapters</h3>
					<p class="text-on-surface-variant">{chaptersError}</p>
				</div>
			{:else if chapters.length === 0}
				<div class="rounded-xl border border-outline-variant/20 bg-surface-container p-12 text-center">
					<p class="font-body-lg text-on-surface-variant mb-2">
						This manga has no chapters that can be read on SOTUS right now.
					</p>
					<p class="font-body-md text-on-surface-variant/80">
						Some series only have external links on MangaDex, or chapters may not be uploaded yet.
						Try another manga from Browse or Genres.
					</p>
				</div>
			{:else}
				<div class="overflow-hidden rounded-xl border border-outline-variant/20">
					{#each chapters as chapter (chapter.id)}
						<a
							href="/manga/{manga.id}/read/{chapter.id}"
							class="flex items-center justify-between gap-4 border-b border-outline-variant/10 bg-surface-container px-5 py-4 transition last:border-b-0 hover:bg-surface-container-high"
						>
							<div>
								<p class="font-label-lg text-on-surface">{formatChapterLabel(chapter)}</p>
								<p class="font-label-sm text-on-surface-variant">
									{chapter.pages} pages · {chapter.translatedLanguage.toUpperCase()} ·
									{new Date(chapter.publishAt).toLocaleDateString()}
								</p>
							</div>
							<span class="font-label-sm text-primary-container">Read →</span>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</main>

<script lang="ts">
	import type { Chapter } from '$lib/types';
	import { formatChapterLabel } from '$lib/mangadex';

	let {
		chapters,
		mangaId,
		chapterSource = 'en'
	}: {
		chapters: Chapter[];
		mangaId: string;
		chapterSource?: 'en' | 'all';
	} = $props();

	const PAGE_SIZE = 8;

	let searchQuery = $state('');
	let currentPage = $state(1);

	const firstChapter = $derived(chapters[0]);
	const latestChapter = $derived(chapters[chapters.length - 1]);

	const sortedChapters = $derived(
		[...chapters].sort((a, b) => parseChapterNumber(b) - parseChapterNumber(a))
	);

	const filteredChapters = $derived(
		sortedChapters.filter((chapter) => {
			const query = searchQuery.trim().toLowerCase();
			if (!query) return true;

			return (
				chapter.chapter?.toLowerCase().includes(query) ||
				chapter.volume?.toLowerCase().includes(query) ||
				chapter.title?.toLowerCase().includes(query) ||
				formatChapterLabel(chapter).toLowerCase().includes(query)
			);
		})
	);

	const totalPages = $derived(Math.max(1, Math.ceil(filteredChapters.length / PAGE_SIZE)));
	const pageChapters = $derived(
		filteredChapters.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	const pageRanges = $derived(
		Array.from({ length: totalPages }, (_, index) => {
			const start = index * PAGE_SIZE + 1;
			const end = Math.min((index + 1) * PAGE_SIZE, filteredChapters.length);
			return { page: index + 1, start, end };
		})
	);

	const jumpPoints = $derived.by(() => {
		const points: { label: string; page: number }[] = [];

		for (let index = 0; index < filteredChapters.length; index += 100) {
			points.push({
				label: String(index + 1),
				page: Math.floor(index / PAGE_SIZE) + 1
			});
		}

		return points;
	});

	function parseChapterNumber(chapter: Chapter): number {
		const value = Number.parseFloat(chapter.chapter ?? '');
		return Number.isFinite(value) ? value : 0;
	}

	function displayChapterNumber(chapter: Chapter, index: number): string {
		if (chapter.chapter) return chapter.chapter;
		return String(filteredChapters.length - ((currentPage - 1) * PAGE_SIZE + index));
	}

	function formatRelativeTime(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const hours = Math.floor(diff / 3_600_000);
		const days = Math.floor(diff / 86_400_000);
		const weeks = Math.floor(days / 7);

		if (hours < 1) return 'Just now';
		if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
		if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
		if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
		return new Date(dateStr).toLocaleDateString();
	}

	function isNewChapter(publishAt: string): boolean {
		return Date.now() - new Date(publishAt).getTime() < 3 * 86_400_000;
	}

	function goToPage(page: number) {
		currentPage = Math.min(Math.max(page, 1), totalPages);
	}

	function handleSearchInput(event: Event) {
		searchQuery = (event.currentTarget as HTMLInputElement).value;
		currentPage = 1;
	}

	function handlePageSelect(event: Event) {
		currentPage = Number((event.currentTarget as HTMLSelectElement).value);
	}
</script>

<div class="md:px-40 sm:px-2 px-2">
	<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<h1 class="font-headline-lg text-xl font-bold text-on-surface">Chapters</h1>
		</div>
		<p class="font-label-sm text-on-surface-variant">
			{filteredChapters.length} Chapters Total
			{#if chapterSource === 'all'}
				· multi-language
			{/if}
		</p>
	</div>

	<div class="mb-6 grid gap-3 sm:grid-cols-2">
		{#if firstChapter}
			<a
				href="/manga/{mangaId}/read/{firstChapter.id}"
				class="rounded-xl border border-outline-variant/20 bg-[#2a1b16] px-5 py-4 transition hover:border-primary-container/50"
			>
				<p class="font-label-sm text-on-surface-variant mb-1">First Chapter</p>
				<p class="font-headline-md text-headline-md text-on-surface">
					{formatChapterLabel(firstChapter)}
				</p>
			</a>
		{/if}
		{#if latestChapter}
			<a
				href="/manga/{mangaId}/read/{latestChapter.id}"
				class="rounded-xl border border-outline-variant/20 bg-[#2a1b16] px-5 py-4 transition hover:border-primary-container/50"
			>
				<p class="font-label-sm text-on-surface-variant mb-1">New Chapter</p>
				<p class="font-headline-md text-headline-md text-on-surface">
					{formatChapterLabel(latestChapter)}
				</p>
			</a>
		{/if}
	</div>

	<div class="mb-6">
		<input
			type="search"
			value={searchQuery}
			oninput={handleSearchInput}
			placeholder="Search chapter. Example: 44 or 125"
			class="w-full rounded-xl border border-outline-variant/30 bg-[#2a1b16] px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary-container"
		/>
	</div>

	{#if filteredChapters.length === 0}
		<div class="rounded-xl border border-outline-variant/20 bg-[#2a1b16] p-10 text-center">
			<p class="font-body-md text-on-surface-variant">No chapters match your search.</p>
		</div>
	{:else}
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<label class="flex items-center gap-2 font-label-sm text-on-surface-variant">
				Jump to range
				<select
					value={currentPage}
					onchange={handlePageSelect}
					class="rounded-lg border border-outline-variant/30 bg-[#2a1b16] px-3 py-2 font-label-sm text-on-surface outline-none focus:border-primary-container"
				>
					{#each pageRanges as range (range.page)}
						<option value={range.page}>
							Chapters {range.start}–{range.end}
						</option>
					{/each}
				</select>
			</label>

			<p class="font-label-sm text-on-surface-variant">
				Page {currentPage} of {totalPages}
			</p>
		</div>

		<div class="space-y-3">
			{#each pageChapters as chapter, index (chapter.id)}
				<a
					href="/manga/{mangaId}/read/{chapter.id}"
					class="chapter-row group flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-[#2a1b16] px-5 py-4 transition hover:border-primary-container/40 hover:bg-[#34231d]"
					class:is-latest={index === 0 && currentPage === 1 && !searchQuery}
				>
					<div class="w-14 shrink-0 text-center">
						<span class="font-headline-lg text-headline-lg text-on-surface">
							{displayChapterNumber(chapter, index)}
						</span>
					</div>

					<div class="min-w-0 flex-1">
						<p class="truncate font-label-lg text-on-surface">
							{chapter.title || formatChapterLabel(chapter)}
						</p>
						<p class="font-label-sm text-on-surface-variant">
							{formatRelativeTime(chapter.publishAt)} · {chapter.pages} pages ·
							{chapter.translatedLanguage.toUpperCase()}
						</p>
					</div>

					<div class="shrink-0">
						{#if index === 0 && currentPage === 1 && !searchQuery && isNewChapter(chapter.publishAt)}
							<span
								class="rounded-full bg-primary-container px-3 py-1 font-label-sm font-semibold text-on-primary"
							>
								NEW
							</span>
						{:else}
							<span
								class="flex h-9 w-9 items-center justify-center rounded-lg px-6 bg-red-500 text-on-surface-variant transition group-hover:border-primary-container group-hover:text-primary-container"
								aria-hidden="true"
							>
								Read
							</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="pagination">
				<button
					type="button"
					class="page-btn"
					disabled={currentPage === 1}
					onclick={() => goToPage(currentPage - 1)}
				>
					Previous
				</button>

				{#each jumpPoints as point (point.label)}
					<button
						type="button"
						class="rounded-lg border px-3 py-2 font-label-sm transition"
						class:border-primary-container={currentPage === point.page}
						class:bg-primary-container={currentPage === point.page}
						class:text-on-primary={currentPage === point.page}
						class:border-outline-variant={currentPage !== point.page}
						class:text-on-surface={currentPage !== point.page}
						class:hover:border-primary-container={currentPage !== point.page}
						onclick={() => goToPage(point.page)}
					>
						{point.label}
					</button>
				{/each}

				<button
					type="button"
					class="page-btn"
					disabled={currentPage === totalPages}
					onclick={() => goToPage(currentPage + 1)}
				>
					Next
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.chapter-row.is-latest {
		border-color: color-mix(in srgb, var(--color-primary-container, #ff5625) 50%, transparent);
	}
</style>

import type { PageServerLoad } from './$types';
import type { Chapter } from '$lib/types';
import { fetchChapters, fetchMangaDetail } from '$lib/mangadex';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const manga = await fetchMangaDetail(params.mangaId);

	if (!manga) {
		error(404, 'Manga not found');
	}

	let chapters: Chapter[] = [];
	let chapterSource: 'en' | 'all' = 'en';
	let chaptersError: string | null = null;

	try {
		const chapterFeed = await fetchChapters(params.mangaId);
		chapters = chapterFeed.chapters;
		chapterSource = chapterFeed.source;
	} catch (err) {
		console.error('Failed to load chapters:', err);
		chaptersError = err instanceof Error ? err.message : 'Failed to load chapters';
	}

	return {
		manga,
		chapters,
		chapterSource,
		chaptersError,
		firstChapterId: chapters[0]?.id ?? null
	};
};

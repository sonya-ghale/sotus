import type { PageServerLoad } from './$types';
import {
	enrichTag,
	fetchAllTags,
	fetchMangaByTag,
	pickFeaturedGenres
} from '$lib/mangadex';

export const load: PageServerLoad = async () => {
	try {
		const tags = await fetchAllTags();
		const genreTags = tags.filter((tag) => tag.group === 'genre');
		const featuredTags = pickFeaturedGenres(genreTags);
		const featured = await Promise.all(featuredTags.map(enrichTag));

		const primaryGenre = featured[0];
		const trending = primaryGenre
			? await fetchMangaByTag(primaryGenre.id, 1, 12)
			: { mangaList: [], total: 0, totalPages: 1, currentPage: 1, error: null };

		const otherGenres = genreTags
			.filter((tag) => !featuredTags.some((item) => item.id === tag.id))
			.sort((a, b) => a.name.localeCompare(b.name));

		return {
			featured,
			trending: trending.mangaList,
			trendingGenre: primaryGenre?.name ?? 'Action',
			otherGenres,
			error: null
		};
	} catch (error) {
		console.error('Failed to load genres:', error);
		return {
			featured: [],
			trending: [],
			trendingGenre: 'Action',
			otherGenres: [],
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};

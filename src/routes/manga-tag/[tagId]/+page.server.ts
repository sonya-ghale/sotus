import type { PageServerLoad } from './$types';
import { fetchMangaByTag, fetchTag } from '$lib/mangadex';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = Number(url.searchParams.get('page')) || 1;

	let tag = null;

	try {
		tag = await fetchTag(params.tagId);
	} catch (error) {
		console.error('Failed to resolve genre tag:', error);
	}

	if (!tag) {
		tag = {
			id: params.tagId,
			name: 'Genre',
			group: 'genre'
		};
	}

	const mangaData = await fetchMangaByTag(params.tagId, page);

	return {
		tag,
		...mangaData
	};
};

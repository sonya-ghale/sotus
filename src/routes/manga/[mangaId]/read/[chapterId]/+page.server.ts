import type { PageServerLoad } from './$types';
import { fetchChapterReaderData } from '$lib/mangadex';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const readerData = await fetchChapterReaderData(params.mangaId, params.chapterId);

	if (!readerData) {
		error(404, 'Chapter not found');
	}

	return {
		...readerData,
		mangaId: params.mangaId
	};
};

// src/routes/manga-tag/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch from your API gateway with the endpoint parameter
		const tagsResponse = await fetch('/api/tags?endpoint=manga/tag');

		if (!tagsResponse.ok) {
			throw new Error(`API returned ${tagsResponse.status}: ${tagsResponse.statusText}`);
		}

		const tagsData = await tagsResponse.json();

		let tags = [];
		if (tagsData.success) {
			tags = tagsData.data;
		}

		return {
			tags
		};
	} catch (error) {
		console.error('Failed to load tags:', error);
		return {
			tags: [],
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};

import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

interface MangaTag {
	id: string;
	attributes: {
		name: {
			en: string;
		};
		group: string;
	};
}

interface MangaDexResponse {
	data: MangaTag[];
}

const API_BASE = 'https://api.mangadex.org';

export async function GET({ url }: RequestEvent) {
	const endpoint = url.searchParams.get('endpoint') || 'manga/tag';

	try {
		const response = await fetch(`${API_BASE}/${endpoint}`);

		if (!response.ok) {
			throw new Error(`MangaDex API error! status: ${response.status}`);
		}

		const data = await response.json();

		// Transform based on endpoint
		if (endpoint === 'manga/tag') {
			const response = data as MangaDexResponse;

			const tags = response.data.map((tag) => ({
				id: tag.id,
				name: tag.attributes.name.en,
				group: tag.attributes.group

			}));

			return json({
				success: true,
				data: tags
			});
		}

		// Return raw data for unhandled endpoints
		return json({
			success: true,
			data: data
		});
	} catch (error) {
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}

import type { PageServerLoad } from './$types';
import type { Manga, MangaDexManga, MangaDexResponse } from '$lib/types';

function createPlaceholderSvg(): string {
	return (
		'data:image/svg+xml;base64,' +
		btoa(`
            <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14"
                fill="#666" text-anchor="middle" dy=".3em">No Cover
                </text>
            </svg>
        `)
	);
}

async function fetchManga(page: number = 1, title: string = '') {
	const API_BASE = 'https://api.mangadex.org';

	try {
		// how many manga to show in a page
		const limit = 14;
		const offset = (page - 1) * limit;

		let url = `${API_BASE}/manga?limit=${limit}&offset=${offset}&order[latestUploadedChapter]=desc&includes[]=cover_art`;

		if (title) {
			url += `&title=${encodeURIComponent(title)}`;
		}

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Sotus/0.0.1 (https://github.com/sotus-manga/sotus)'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: MangaDexResponse = await response.json();

		const mangaList: Manga[] = await Promise.all(
			data.data.map(async (manga: MangaDexManga) => {
				const attributes = manga.attributes;
				const titleObj = attributes.title;

				const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
				let coverUrl = createPlaceholderSvg();

				if (coverArt?.attributes?.fileName) {
					// for higher resolution image changed form .256.jpg to .512.jpg
					coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.512.jpg`;
				}

				return {
					id: manga.id,
					title:
						titleObj.en ||
						titleObj.jp ||
						titleObj['ja-ro'] ||
						Object.values(titleObj)[0] ||
						'No Title',
					description: attributes.description?.en || 'No description available',
					status: attributes.status,
					year: attributes.year,
					tags: attributes.tags.map((tag) => tag.attributes.name.en),
					coverUrl: coverUrl
				};
			})
		);

		const totalPages = Math.ceil(data.total / limit);

		return {
			mangaList,
			totalPages,
			currentPage: page,
			error: null
		};
	} catch (err: unknown) {
		console.error('Error fetching manga:', err);
		return {
			mangaList: [],
			totalPages: 1,
			currentPage: page,
			error: err instanceof Error ? err.message : 'An unknown error occurred'
		};
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const searchQuery = url.searchParams.get('search') || '';

	const mangaData = await fetchManga(page, searchQuery);

	return {
		...mangaData,
		searchQuery
	};
};

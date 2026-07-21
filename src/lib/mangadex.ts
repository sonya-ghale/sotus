import type {
	Chapter,
	ChapterFeedResult,
	Manga,
	MangaDetail,
	MangaDexManga,
	MangaDexResponse
} from '$lib/types';

const API_BASE = 'https://api.mangadex.org';
const MANGADEX_USER_AGENT = 'Sotus/0.0.1 (https://github.com/sotus-manga/sotus)';

let tagsCache: MangaTag[] | null = null;

async function mdFetch(input: string | URL, init?: RequestInit): Promise<Response> {
	const headers = new Headers(init?.headers);

	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', MANGADEX_USER_AGENT);
	}

	return fetch(input, { ...init, headers });
}

export interface MangaTag {
	id: string;
	name: string;
	group: string;
}

export interface EnrichedTag extends MangaTag {
	seriesCount: number;
	coverUrl: string;
}

export function createPlaceholderSvg(label = 'No Cover'): string {
	return (
		'data:image/svg+xml;base64,' +
		btoa(`
            <svg width="512" height="768" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#2d1b16"/>
                <text x="50%" y="50%" font-family="Arial" font-size="18"
                fill="#ad887e" text-anchor="middle" dy=".3em">${label}
                </text>
            </svg>
        `)
	);
}

const GENRE_FALLBACK_IMAGES: Record<string, string> = {
	Action:
		'https://images.unsplash.com/photo-1549488497-a66958b3160f?auto=format&fit=crop&w=900&q=80',
	Horror:
		'https://images.unsplash.com/photo-1509245853835-c3b5d8a9c8c0?auto=format&fit=crop&w=900&q=80',
	Romance:
		'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
	Seinen:
		'https://images.unsplash.com/photo-1612036782180-6f0b06ec13fe?auto=format&fit=crop&w=900&q=80',
	'Sci-Fi':
		'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80'
};

export function getGenreFallbackImage(name: string): string {
	return GENRE_FALLBACK_IMAGES[name] ?? createPlaceholderSvg(name);
}

export function parseManga(manga: MangaDexManga): Manga {
	const attributes = manga.attributes;
	const titleObj = attributes.title;
	const coverArt = manga.relationships.find((rel) => rel.type === 'cover_art');
	let coverUrl = createPlaceholderSvg();

	if (coverArt?.attributes?.fileName) {
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
		coverUrl
	};
}

export async function fetchAllTags(): Promise<MangaTag[]> {
	const tags: MangaTag[] = [];
	const limit = 100;
	let offset = 0;
	let total = Infinity;

	while (offset < total) {
		const response = await mdFetch(`${API_BASE}/manga/tag?limit=${limit}&offset=${offset}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch tags: ${response.status}`);
		}

		const data = await response.json();
		total = data.total ?? tags.length;

		tags.push(
			...data.data.map(
				(tag: { id: string; attributes: { name: { en: string }; group: string } }) => ({
					id: tag.id,
					name: tag.attributes.name.en,
					group: tag.attributes.group
				})
			)
		);

		offset += limit;
	}

	return tags;
}

export async function fetchTag(tagId: string): Promise<MangaTag | null> {
	if (!tagsCache) {
		tagsCache = await fetchAllTags();
	}

	return tagsCache.find((tag) => tag.id === tagId) ?? null;
}

export function formatChapterLabel(chapter: Chapter): string {
	const parts: string[] = [];

	if (chapter.volume) parts.push(`Vol. ${chapter.volume}`);
	if (chapter.chapter) parts.push(`Ch. ${chapter.chapter}`);
	if (chapter.title) parts.push(chapter.title);

	return parts.join(' · ') || 'Chapter';
}

function parseChapter(item: {
	id: string;
	attributes: {
		volume?: string | null;
		chapter?: string | null;
		title?: string | null;
		pages: number;
		translatedLanguage: string;
		publishAt: string;
		externalUrl?: string | null;
		isUnavailable?: boolean;
	};
}): Chapter {
	return {
		id: item.id,
		volume: item.attributes.volume || undefined,
		chapter: item.attributes.chapter || undefined,
		title: item.attributes.title || undefined,
		pages: item.attributes.pages,
		translatedLanguage: item.attributes.translatedLanguage,
		publishAt: item.attributes.publishAt,
		externalUrl: item.attributes.externalUrl || undefined,
		isUnavailable: item.attributes.isUnavailable ?? false
	};
}

function isReadableChapter(chapter: Chapter): boolean {
	return chapter.pages > 0 && !chapter.isUnavailable && !chapter.externalUrl;
}

async function fetchChapterFeedPage(
	mangaId: string,
	offset: number,
	limit: number,
	languages?: string[]
): Promise<{ chapters: Chapter[]; total: number }> {
	const params = new URLSearchParams();
	params.set('order[chapter]', 'asc');
	params.set('limit', String(limit));
	params.set('offset', String(offset));

	if (languages?.length) {
		for (const language of languages) {
			params.append('translatedLanguage[]', language);
		}
	}

	const response = await mdFetch(`${API_BASE}/manga/${mangaId}/feed?${params}`);

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Failed to fetch chapters (${response.status}): ${body.slice(0, 120)}`);
	}

	const data = await response.json();

	return {
		chapters: data.data.map(parseChapter),
		total: data.total ?? 0
	};
}

async function fetchAllChaptersFromFeed(
	mangaId: string,
	languages?: string[]
): Promise<Chapter[]> {
	const chapters: Chapter[] = [];
	const limit = 100;
	let offset = 0;
	let total = Infinity;

	while (offset < total) {
		const page = await fetchChapterFeedPage(mangaId, offset, limit, languages);
		total = page.total;
		chapters.push(...page.chapters);
		offset += limit;
	}

	return chapters.filter(isReadableChapter);
}

export async function fetchMangaDetail(mangaId: string): Promise<MangaDetail | null> {
	const params = new URLSearchParams();
	params.append('includes[]', 'cover_art');
	params.append('includes[]', 'author');

	const response = await mdFetch(`${API_BASE}/manga/${mangaId}?${params}`);

	if (!response.ok) {
		return null;
	}

	const payload = await response.json();
	const manga = payload.data as MangaDexManga & {
		attributes: MangaDexManga['attributes'] & {
			altTitles?: Array<Record<string, string>>;
			contentRating?: string;
			publicationDemographic?: string | null;
			lastVolume?: string | null;
			lastChapter?: string | null;
		};
	};

	const parsed = parseManga(manga);
	const altTitles =
		manga.attributes.altTitles?.map((entry) => Object.values(entry)[0]).filter(Boolean) ?? [];

	return {
		...parsed,
		altTitles,
		contentRating: manga.attributes.contentRating ?? 'safe',
		demographic: manga.attributes.publicationDemographic ?? undefined,
		lastVolume: manga.attributes.lastVolume || undefined,
		lastChapter: manga.attributes.lastChapter || undefined
	};
}

export async function fetchChapters(mangaId: string): Promise<ChapterFeedResult> {
	const englishChapters = await fetchAllChaptersFromFeed(mangaId, ['en']);

	if (englishChapters.length > 0) {
		return { chapters: englishChapters, source: 'en' };
	}

	const allChapters = await fetchAllChaptersFromFeed(mangaId);
	return { chapters: allChapters, source: 'all' };
}

export async function fetchChapterPages(chapterId: string): Promise<string[]> {
	const response = await mdFetch(`${API_BASE}/at-home/server/${chapterId}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch chapter pages: ${response.status}`);
	}

	const data = await response.json();
	const { baseUrl, chapter } = data;

	return chapter.data.map((filename: string) => `${baseUrl}/data/${chapter.hash}/${filename}`);
}

export async function fetchChapterReaderData(
	mangaId: string,
	chapterId: string
): Promise<{
	chapter: Chapter;
	pageUrls: string[];
	prevChapterId: string | null;
	nextChapterId: string | null;
	mangaTitle: string;
} | null> {
	const [manga, chapterFeed, pageUrls] = await Promise.all([
		fetchMangaDetail(mangaId),
		fetchChapters(mangaId),
		fetchChapterPages(chapterId)
	]);

	if (!manga) {
		return null;
	}

	const chapters = chapterFeed.chapters;

	const index = chapters.findIndex((item) => item.id === chapterId);
	const chapter = chapters[index];

	if (!chapter) {
		return null;
	}

	return {
		chapter,
		pageUrls,
		prevChapterId: index > 0 ? chapters[index - 1].id : null,
		nextChapterId: index < chapters.length - 1 ? chapters[index + 1].id : null,
		mangaTitle: manga.title
	};
}

export async function fetchMangaByTag(tagId: string, page = 1, limit = 20) {
	const offset = (page - 1) * limit;
	const url = `${API_BASE}/manga?limit=${limit}&offset=${offset}&includedTags[]=${tagId}&order[followedCount]=desc&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`;

	try {
		const response = await mdFetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: MangaDexResponse = await response.json();
		const mangaList = data.data.map(parseManga);
		const totalPages = Math.ceil(data.total / limit);

		return {
			mangaList,
			total: data.total,
			totalPages,
			currentPage: page,
			error: null as string | null
		};
	} catch (err: unknown) {
		console.error('Error fetching manga by tag:', err);
		return {
			mangaList: [],
			total: 0,
			totalPages: 1,
			currentPage: page,
			error: err instanceof Error ? err.message : 'An unknown error occurred'
		};
	}
}

export async function enrichTag(tag: MangaTag): Promise<EnrichedTag> {
	const preview = await fetchMangaByTag(tag.id, 1, 1);

	return {
		...tag,
		seriesCount: preview.total,
		coverUrl: preview.mangaList[0]?.coverUrl ?? getGenreFallbackImage(tag.name)
	};
}

export const FEATURED_GENRE_NAMES = ['Action', 'Horror', 'Romance', 'Seinen', 'Sci-Fi'];

export function pickFeaturedGenres(genreTags: MangaTag[]): MangaTag[] {
	const picked: MangaTag[] = [];

	for (const name of FEATURED_GENRE_NAMES) {
		const match = genreTags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
		if (match) picked.push(match);
	}

	if (picked.length < FEATURED_GENRE_NAMES.length) {
		for (const tag of genreTags) {
			if (picked.length >= FEATURED_GENRE_NAMES.length) break;
			if (!picked.some((item) => item.id === tag.id)) {
				picked.push(tag);
			}
		}
	}

	return picked.slice(0, 5);
}

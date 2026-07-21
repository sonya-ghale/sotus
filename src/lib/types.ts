export interface Manga {
    id: string;
    title: string;
    description: string;
    status: string;
    year?: number;
    month?: number;
    day?: number;
    tags: string[];
    coverUrl: string;
}

export interface MangaDetail extends Manga {
    altTitles: string[];
    contentRating: string;
    demographic?: string;
    lastVolume?: string;
    lastChapter?: string;
}

export interface Chapter {
    id: string;
    volume?: string;
    chapter?: string;
    title?: string;
    pages: number;
    translatedLanguage: string;
    publishAt: string;
    externalUrl?: string;
    isUnavailable: boolean;
}

export interface ChapterFeedResult {
    chapters: Chapter[];
    source: 'en' | 'all';
}

export interface ChapterReaderData {
    chapter: Chapter;
    pageUrls: string[];
    prevChapterId: string | null;
    nextChapterId: string | null;
    mangaTitle: string;
}

export interface MangaDexManga {
    id: string;
    attributes: {
        title: Record<string, string>;
        description: Record<string, string>;
        status: string;
        year?: number;
        month?: number;
        day?: number;
        tags: Array<{
            attributes: {
                name: Record<string, string>;
            };
        }>;
    };
    relationships: Array<{
        type: string;
        attributes?: {
            fileName?: string;
        };
    }>;
}

export interface MangaDexResponse {
    data: MangaDexManga[];
    total: number;
    limit: number;
    offset: number;
}
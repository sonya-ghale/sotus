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
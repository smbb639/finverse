import api from './api';

export interface NewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export const newsService = {
    getNews: async (force: boolean = false): Promise<NewsResponse> => {
        const response = await api.get<NewsResponse>(`/news${force ? '?force=true' : ''}`);
        return response.data;
    },
};

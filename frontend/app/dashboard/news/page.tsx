'use client';

import { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { newsService, NewsArticle } from '@/lib/news';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Newspaper,
    ExternalLink,
    Clock,
    TrendingUp,
    Globe,
    RefreshCw
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
    const queryClient = useQueryClient();
    const [showNoUpdateNotif, setShowNoUpdateNotif] = useState(false);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['news'],
        queryFn: () => newsService.getNews(),
        staleTime: 10 * 60 * 1000,
    });

    const articles = data?.articles || [];

    const handleRefresh = async () => {
        try {
            const previousData = articles;
            const newData = await queryClient.fetchQuery({
                queryKey: ['news'],
                queryFn: () => newsService.getNews(true),
            });

            const newArticles = newData?.articles || [];
            const previousIds = previousData.map(a => a.url).join(',');
            const newIds = newArticles.map(a => a.url).join(',');

            if (previousIds === newIds) {
                setShowNoUpdateNotif(true);
                setTimeout(() => setShowNoUpdateNotif(false), 3000);
            }
        } catch (err) {
            console.error('Refresh failed:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                    <Skeleton className="h-11 w-32" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>

                {/* News Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-5 space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <Newspaper className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load News</h2>
                    <p className="text-slate-500 mb-6">We couldn't fetch the latest financial news. Please try again.</p>
                    <Button
                        onClick={handleRefresh}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Financial News
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Stay updated with the latest market news and financial insights.
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={isFetching}
                    variant="outline"
                    className="gap-2 border-slate-200 hover:bg-slate-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Newspaper className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-blue-100 bg-white/10 px-2 py-1 rounded-full">
                                Today
                            </span>
                        </div>
                        <p className="text-sm font-medium text-blue-100">Latest Articles</p>
                        <h3 className="text-3xl font-bold mt-1">{articles.length}</h3>
                        <p className="text-xs text-blue-200 mt-2 font-medium">
                            Financial news updates
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-emerald-50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                Live
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Market Focus</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">Stocks & Finance</h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Economy & investments
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-purple-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Globe className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                Global
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">News Sources</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">
                            {new Set(articles.map(a => a.source.name)).size}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Trusted publishers
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* News Grid */}
            {articles.length === 0 ? (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-20 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Newspaper className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No news available</h3>
                        <p className="text-slate-500">Check back later for the latest financial updates.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <NewsCard key={`${article.url}-${index}`} article={article} />
                    ))}
                </div>
            )}
            {/* Notification / Toast */}
            {showNoUpdateNotif && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50 backdrop-blur-xl bg-opacity-90">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-semibold tracking-wide">You are already up to Date!</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function NewsCard({ article }: { article: NewsArticle }) {
    const publishedDate = new Date(article.publishedAt);
    const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
        >
            <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm ring-1 ring-slate-100">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {article.urlToImage ? (
                        <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="h-12 w-12 text-slate-300" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Source Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-700 rounded-full shadow-sm">
                            {article.source.name}
                        </span>
                    </div>

                    {/* External Link Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                            <ExternalLink className="h-4 w-4 text-slate-700" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-5">
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{timeAgo}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {article.title}
                    </h3>

                    {/* Description */}
                    {article.description && (
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                            {article.description}
                        </p>
                    )}

                    {/* Author */}
                    {article.author && (
                        <p className="text-xs text-slate-400 mt-4 font-medium truncate">
                            By {article.author}
                        </p>
                    )}
                </CardContent>
            </Card>
        </a>
    );
}

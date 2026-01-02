
"use client"

import { Star } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';

type Review = {
    id: string;
    rating: number;
};

type RatingDistribution = {
    star: number;
    count: number;
}

interface ReviewSummaryProps {
    reviews: Review[];
    distribution: RatingDistribution[];
}

export function ReviewSummary({ reviews, distribution }: ReviewSummaryProps) {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1) : "0.0";
    const totalDistributionCount = distribution.reduce((acc, item) => acc + item.count, 0);

    return (
        <Card className="bg-slate-50 border-none shadow-sm dark:bg-slate-800/50">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Overall Rating */}
                    <div className="flex flex-col items-center justify-center min-w-[140px] gap-2">
                        <div className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {averageRating}
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${parseFloat(averageRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'}`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            {totalReviews} verified reviews
                        </p>
                    </div>

                    {/* Progress Bars */}
                    <div className="flex-1 w-full space-y-3">
                        {distribution.map(({ star, count }) => {
                            // distribution is usually 5 to 1. 
                            const percentage = totalDistributionCount > 0 ? (count / totalDistributionCount) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm font-medium w-6 shrink-0 flex items-center gap-1">
                                        {star} <Star className="w-3 h-3 text-slate-400" />
                                    </span>
                                    <Progress value={percentage} className="h-2.5 bg-slate-200 dark:bg-slate-700" />
                                    <span className="text-sm text-slate-500 w-8 text-right shrink-0">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

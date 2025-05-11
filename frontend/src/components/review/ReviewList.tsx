import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Review } from '@/types/review';
import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewListProps {
  reviews: Review[];
  userMap: Record<number, { name: string }>;
}

export function ReviewList({ reviews, userMap }: ReviewListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {userMap[review.reviewer_id]?.name} 
                <span className="text-sm text-muted-foreground">
                  {' '}as {review.reviewer_role}
                </span>
              </span>
              <div className="flex items-center">
                <span className="mr-1">{review.rating}</span>
                <StarIcon className="h-5 w-5 text-yellow-400" />
              </div>
            </CardTitle>
            <CardDescription>
              Reviewing: {userMap[review.reviewee_id]?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

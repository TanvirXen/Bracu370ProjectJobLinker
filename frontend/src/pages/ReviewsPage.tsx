import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { ReviewForm } from '@/components/review/ReviewForm';
import { ReviewList } from '@/components/review/ReviewList';
import { RoleSelector } from '@/components/review/RoleSelector';
import { CreateReviewDto, Review } from '@/types/review';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration
const mockReviews: Review[] = [
  {
    id: 1,
    reviewer_id: 1,
    reviewee_id: 2,
    reviewer_role: 'employer',
    rating: 5,
    comment: 'Excellent work ethic and communication skills.',
    created_at: '2025-05-10T10:00:00',
  },
  {
    id: 2,
    reviewer_id: 3,
    reviewee_id: 1,
    reviewer_role: 'candidate',
    rating: 4,
    comment: 'Great company culture and management.',
    created_at: '2025-05-09T15:30:00',
  },
];

const mockEmployers = [
  {
    id: 1,
    name: 'John Smith',
  },
  {
    id: 4,
    name: 'Robert Wilson',
  },
];

const mockCandidates = [
  {
    id: 2,
    name: 'Jane Doe',
  },
  {
    id: 3,
    name: 'Alice Johnson',
  },
];

export default function ReviewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'employer' | 'candidate' | null>(null);

  // Create a map of user IDs to user objects for easy lookup
  const userMap = [...mockEmployers, ...mockCandidates].reduce((acc, user) => {
    acc[user.id] = { name: user.name };
    return acc;
  }, {} as Record<number, { name: string }>);

  const handleSubmitReview = async (data: CreateReviewDto) => {
    if (!selectedRole) return;

    // Mock review creation
    const newReview: Review = {
      id: reviews.length + 1,
      reviewer_id: user?.id || 0,
      reviewee_id: data.reviewee_id,
      reviewer_role: selectedRole,
      rating: data.rating,
      comment: data.comment,
      created_at: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setIsDialogOpen(false);
    setSelectedRole(null);
    toast({
      title: 'Success',
      description: 'Review submitted successfully',
    });
  };

  const handleRoleSelect = (role: 'employer' | 'candidate') => {
    setSelectedRole(role);
  };

  const getReviewees = () => {
    return selectedRole === 'employer' ? mockCandidates : mockEmployers;
  };

  return (
    <>
      <Navbar />
      <div className="container py-6 space-y-6 mt-20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedRole ? 'Write a Review' : 'Select Role'}
                </DialogTitle>
              </DialogHeader>
              {selectedRole ? (
                <ReviewForm
                  onSubmit={handleSubmitReview}
                  reviewees={getReviewees()}
                  revieweeType={selectedRole === 'employer' ? 'candidate' : 'employer'}
                />
              ) : (
                <RoleSelector onRoleSelect={handleRoleSelect} />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {reviews.length > 0 ? (
          <ReviewList reviews={reviews} userMap={userMap} />
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No reviews yet. Be the first to write one!
          </div>
        )}
      </div>
    </>
  );
}

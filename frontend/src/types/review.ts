export interface Review {
  id: number;
  reviewer_id: number;
  reviewee_id: number;
  reviewer_role: 'employer' | 'candidate';
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreateReviewDto {
  reviewee_id: number;
  rating: number;
  comment?: string;
}

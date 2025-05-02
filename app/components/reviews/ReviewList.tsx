import { useState } from 'react';
import { IReview, SafeUser } from '@/app/types';
import useReview from '@/hook/useReview';
import Avatar from '@/components/Avatar'
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star, StarHalf } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReviewListProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const ReviewList: React.FC<ReviewListProps> = ({
  listingId,
  currentUser
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const {
    reviews,
    isLoading,
    addReview
  } = useReview();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return toast.error('Please select a rating');
    }

    if (!comment.trim()) {
      return toast.error('Please write a comment');
    }

    try {
      await addReview(listingId, rating, comment);
      setRating(0);
      setComment('');
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-neutral-300"
        />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Reviews ({reviews.length})
        </h3>

        {currentUser && (
          <form onSubmit={onSubmit} className="space-y-4 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={4}
            />

            <Button
              type="submit"
              disabled={isLoading}
            >
              Submit Review
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((review: IReview) => (
            <div
              key={review.id}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar src={review.user.image} />
                <div>
                  <p className="font-semibold">
                    {review.user.name}
                  </p>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-neutral-600">
                {review.comment}
              </p>
              <span className="text-xs text-neutral-500 mt-1 block">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList; 
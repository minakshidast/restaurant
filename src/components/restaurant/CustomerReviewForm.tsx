
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

interface CustomerReviewFormProps {
  onSubmit: (name: string, email: string, rating: number, comment: string) => void;
  primaryColor?: string;
}

export const CustomerReviewForm: React.FC<CustomerReviewFormProps> = ({ 
  onSubmit,
  primaryColor = '#9b87f5'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || rating === 0) return;
    onSubmit(name, email, rating, comment);
    // Reset form
    setName('');
    setEmail('');
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email (optional)
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${
                  (hoverRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted/30"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 self-center">
            {rating > 0 ? `${rating}/5` : ""}
          </span>
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience..."
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          disabled={name.trim() === '' || rating === 0}
          style={{backgroundColor: primaryColor}}
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
};

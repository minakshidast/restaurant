
import React from 'react';
import { Star } from 'lucide-react';

interface ReviewStarsProps {
  rating: number; // Rating from 0 to 5
  size?: number;  // Icon size
}

export const ReviewStars: React.FC<ReviewStarsProps> = ({ rating, size = 16 }) => {
  // Calculate the number of full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star 
          key={`full-${i}`}
          size={size} 
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star size={size} className="text-muted/30" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={size} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star 
          key={`empty-${i}`}
          size={size} 
          className="text-muted/30" 
        />
      ))}
    </div>
  );
};

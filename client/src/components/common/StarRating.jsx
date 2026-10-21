import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  size = 18,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="star-rating-container">
      {Array.from({ length: max }, (_, idx) => {
        const starNum = idx + 1;
        const isFilled = starNum <= displayValue;

        return (
          <button
            key={idx}
            type="button"
            className={`star-btn ${isFilled ? 'filled' : ''}`}
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(starNum)}
            onMouseEnter={() => !readOnly && setHoverValue(starNum)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
          >
            <Star
              size={size}
              fill={isFilled ? '#F59E0B' : 'transparent'}
              color={isFilled ? '#F59E0B' : '#CBD5E1'}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

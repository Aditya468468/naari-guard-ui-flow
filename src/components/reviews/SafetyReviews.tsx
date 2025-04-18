
import React, { useState } from 'react';
import { ChevronUp, MapPin, MessageSquare, Star, ThumbsDown, ThumbsUp } from 'lucide-react';

interface Review {
  id: number;
  location: string;
  comment: string;
  time: string;
  rating: number;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

const SafetyReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      location: 'Central Park South Entrance',
      comment: 'Felt unsafe here after 9 PM. Poor lighting and few people around.',
      time: '9:00 PM',
      rating: 2,
      upvotes: 12,
      downvotes: 2,
      userVote: null,
    },
    {
      id: 2,
      location: 'Main Street Bridge',
      comment: 'Well-lit area with regular police patrols. Felt very safe walking here.',
      time: '7:30 PM',
      rating: 5,
      upvotes: 28,
      downvotes: 1,
      userVote: 'up',
    },
    {
      id: 3,
      location: 'Downtown Bus Terminal',
      comment: 'Moderately safe during day, but avoid at night. Some suspicious activity noticed.',
      time: '8:15 PM',
      rating: 3,
      upvotes: 18,
      downvotes: 5,
      userVote: null,
    },
  ]);
  
  const handleVote = (id: number, voteType: 'up' | 'down') => {
    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === id) {
          // If already voted the same way, remove vote
          if (review.userVote === voteType) {
            return {
              ...review,
              upvotes: voteType === 'up' ? review.upvotes - 1 : review.upvotes,
              downvotes: voteType === 'down' ? review.downvotes - 1 : review.downvotes,
              userVote: null,
            };
          }
          
          // If voted opposite way, switch vote
          if (review.userVote !== null) {
            return {
              ...review,
              upvotes: voteType === 'up' ? review.upvotes + 1 : review.upvotes - 1,
              downvotes: voteType === 'down' ? review.downvotes + 1 : review.downvotes - 1,
              userVote: voteType,
            };
          }
          
          // New vote
          return {
            ...review,
            upvotes: voteType === 'up' ? review.upvotes + 1 : review.upvotes,
            downvotes: voteType === 'down' ? review.downvotes + 1 : review.downvotes,
            userVote: voteType,
          };
        }
        return review;
      })
    );
  };
  
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
      />
    ));
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-2">Safety Reviews</h1>
      <p className="text-sm text-gray-400 mb-6">
        Community-sourced safety information
      </p>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <h2 className="text-lg font-medium text-white mb-3">Add Your Review</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-naari-teal" />
            </div>
            <input
              type="text"
              placeholder="Location name"
              className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm"
            />
          </div>
          
          <textarea
            placeholder="Share your safety experience here..."
            className="w-full h-20 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 mr-1">Rate:</span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} className="text-gray-400 hover:text-yellow-400">
                  <Star className="w-5 h-5" />
                </button>
              ))}
            </div>
            <button className="bg-naari-purple text-white text-sm px-4 py-1 rounded-md shadow-glow-purple">
              Submit
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium">{review.location}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-xs text-gray-400">at {review.time}</span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-naari-teal" />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-300">{review.comment}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  className={`flex items-center gap-1 ${
                    review.userVote === 'up' ? 'text-naari-purple' : 'text-gray-400'
                  }`}
                  onClick={() => handleVote(review.id, 'up')}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs">{review.upvotes}</span>
                </button>
                <button 
                  className={`flex items-center gap-1 ${
                    review.userVote === 'down' ? 'text-naari-danger' : 'text-gray-400'
                  }`}
                  onClick={() => handleVote(review.id, 'down')}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-xs">{review.downvotes}</span>
                </button>
              </div>
              
              <button className="flex items-center gap-1 text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">Comment</span>
              </button>
            </div>
          </div>
        ))}
        
        <button className="w-full py-2 text-center text-naari-purple text-sm flex items-center justify-center gap-1">
          <ChevronUp className="w-4 h-4" />
          <span>Load more reviews</span>
        </button>
      </div>
    </div>
  );
};

export default SafetyReviews;

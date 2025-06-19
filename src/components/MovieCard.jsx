import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MovieCard = ({ id, title, duration, synopsis, photo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movie/${id}/cover`);
        if (!response.ok) throw new Error('Failed to fetch cover');
        const blob = await response.blob();
        setCoverImage(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error fetching cover:', error);
        setCoverImage(photo); // Fallback to provided photo
      }
    };

    fetchCover();

    // Cleanup
    return () => {
      if (coverImage) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [id, photo]);

  return (
    <div 
      className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3]">
        <img
          src={coverImage || '/placeholder-movie.jpg'} // Add a placeholder image
          alt={`${title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>

      {/* Movie Info Overlay */}
      <div className={`absolute inset-x-0 bottom-0 p-4 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-[70%]'}`}>
        <div className="space-y-3">
          {/* Title and Duration */}
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-300 mt-1">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {duration} minutes
              </span>
            </p>
          </div>

          {/* Synopsis */}
          <p className={`text-sm text-gray-300 line-clamp-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {synopsis}
          </p>

          {/* Action Buttons */}
          <div className={`flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Book Now
            </button>
            <button className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  synopsis: PropTypes.string.isRequired,
  photo: PropTypes.string, // Made optional since we're using the API
};

export default MovieCard;
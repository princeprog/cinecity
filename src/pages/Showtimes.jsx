import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, DollarSign, Film, 
  Star, Info, Users, CreditCard, Popcorn, 
  Shield, Zap, Gift, Award, Phone, Mail,
  ChevronRight, Play, Volume2, Sparkles
} from 'lucide-react';

export default function Showtimes(){
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movieCovers, setMovieCovers] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchShowtimes();
  }, []);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/showtime');
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes');
      }
      const data = await response.json();
      setShowtimes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique dates and genres for filtering
  const uniqueDates = [...new Set(showtimes.map(showtime => showtime.date))].sort();
  const uniqueGenres = [...new Set(showtimes.map(showtime => showtime.movie.genre.genreName))].sort();

  // Filter showtimes based on selected filters
  const filteredShowtimes = showtimes.filter(showtime => {
    const dateMatch = !selectedDate || showtime.date === selectedDate;
    const genreMatch = !selectedGenre || showtime.movie.genre.genreName === selectedGenre;
    return dateMatch && genreMatch;
  });

  // Group showtimes by movie
  const groupedShowtimes = filteredShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: showtime.movie,
        showtimes: []
      };
    }
    acc[movieId].showtimes.push(showtime);
    return acc;
  }, {});

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeatAvailability = (totalSeats, bookedSeats) => {
    const availability = ((totalSeats - bookedSeats) / totalSeats) * 100;
    if (availability > 60) return { 
      color: 'text-green-400 bg-green-900/20 border-green-500/30', 
      text: 'Available',
      icon: '●'
    };
    if (availability > 20) return { 
      color: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30', 
      text: 'Filling Fast',
      icon: '●'
    };
    return { 
      color: 'text-red-400 bg-red-900/20 border-red-500/30', 
      text: 'Almost Full',
      icon: '●'
    };
  };

  const getQualityBadge = (cinema) => {
    if (cinema.includes('IMAX')) return { text: 'IMAX', color: 'bg-blue-900/30 text-blue-300 border-blue-500/30' };
    if (cinema.includes('Premium')) return { text: 'Premium', color: 'bg-purple-900/30 text-purple-300 border-purple-500/30' };
    if (cinema.includes('Dolby')) return { text: 'Dolby Atmos', color: 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30' };
    return { text: 'Standard', color: 'bg-gray-700/30 text-gray-300 border-gray-500/30' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Showtimes</h2>
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Showtimes</h2>
          <p className="text-gray-400 mb-6">There was an error loading the showtimes. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Movie Showtimes
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover and book tickets for the latest movies playing at our theaters
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { icon: Film, label: 'Movies', value: Object.keys(groupedShowtimes).length || '0' },
              { icon: Calendar, label: 'Days', value: uniqueDates.length || '0' },
              { icon: Clock, label: 'Showtimes', value: filteredShowtimes.length || '0' },
              { icon: Users, label: 'Theaters', value: '5+' }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 text-center">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Filter Showtimes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Film className="w-4 h-4 inline mr-2" />
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Genres</option>
                {uniqueGenres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {Object.keys(groupedShowtimes).length === 0 ? (
            <div className="text-center py-16">
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Movies Found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters to see available showtimes.
              </p>
              <button 
                onClick={() => {setSelectedDate(''); setSelectedGenre('');}}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            Object.values(groupedShowtimes).map(({ movie, showtimes: movieShowtimes }) => (
              <div key={movie.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      <div className="w-48 h-72 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                        {movieCovers[movie.id] ? (
                          <img
                            src={movieCovers[movie.id]}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-16 h-16 text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Movie Details */}
                    <div className="flex-1">
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-3">{movie.title}</h2>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                            {movie.genre.genreName}
                          </span>
                          <span className="flex items-center text-gray-300 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {movie.duration} mins
                          </span>
                          <span className="flex items-center text-yellow-400 text-sm">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {movie.rating || '8.5'}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                      </div>

                      {/* Showtimes */}
                      <div className="space-y-6">
                        {Object.entries(
                          movieShowtimes.reduce((acc, showtime) => {
                            if (!acc[showtime.date]) {
                              acc[showtime.date] = [];
                            }
                            acc[showtime.date].push(showtime);
                            return acc;
                          }, {})
                        ).map(([date, dateShowtimes]) => (
                          <div key={date} className="bg-gray-750/50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <Calendar className="w-5 h-5 mr-2 text-red-500" />
                              {formatDate(date)}
                            </h4>
                            
                            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                              {dateShowtimes.map((showtime, index) => {
                                const availability = getSeatAvailability(showtime.totalSeats, showtime.bookedSeats);
                                const quality = getQualityBadge(showtime.cinema.cinema_name);
                                
                                return (
                                  <div
                                    key={index}
                                    className="flex-shrink-0 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all duration-200 group"
                                  >
                                    <div className="p-4 flex items-center gap-4 min-w-[400px]">
                                      <div className="flex-shrink-0">
                                        <div className="text-2xl font-bold text-white">
                                          {formatTime(showtime.time)}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                          {showtime.cinema.cinema_name}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
                                        <div>
                                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${quality.color}`}>
                                            {quality.text}
                                          </div>
                                          <div className={`mt-2 text-xs ${availability.color} flex items-center gap-1`}>
                                            <span className="w-2 h-2 rounded-full bg-current"></span>
                                            <span>{availability.text}</span>
                                          </div>
                                        </div>

                                        <div className="text-center border-l border-gray-700 pl-4">
                                          <div className="text-lg font-bold text-white">
                                            ${showtime.price.toFixed(2)}
                                          </div>
                                          <div className="text-xs text-gray-400">
                                            {showtime.totalSeats - showtime.bookedSeats} seats left
                                          </div>
                                        </div>

                                        <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ml-auto">
                                          Book Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Information */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CreditCard,
                title: 'Secure Booking',
                description: 'Safe and secure payment processing with instant confirmation.'
              },
              {
                icon: Shield,
                title: 'Easy Cancellation',
                description: 'Cancel or modify your booking up to 2 hours before showtime.'
              },
              {
                icon: Popcorn,
                title: 'Concessions',
                description: 'Pre-order snacks and drinks for pickup at the theater.'
              },
              {
                icon: Users,
                title: 'Group Bookings',
                description: 'Special rates available for groups of 10 or more people.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-5 h-5" />
                  <span>support@cinema.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
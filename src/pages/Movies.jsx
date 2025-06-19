import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import {
  Clock,
  Star,
  Search,
  Filter,
  MapPin,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Movies() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [featuredMovieCover, setFeaturedMovieCover] = useState(null);

  // Add these headers to your fetch requests
  const fetchOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // Add this helper function for retrying failed requests
  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
      }
    }
  };

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetchWithRetry(
          "http://localhost:8080/movie",
          fetchOptions
        );
        const data = await response.json();
        setMovies(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch featured movie cover
  useEffect(() => {
    const fetchFeaturedCover = async () => {
      if (movies.length > 0) {
        try {
          const response = await fetch(
            `http://localhost:8080/movie/${movies[0].id}/cover`,
            {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Accept: "image/*",
              },
            }
          );
          if (!response.ok)
            throw new Error("Failed to fetch featured movie cover");
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setFeaturedMovieCover(objectUrl);

          // Cleanup previous URL if it exists
          return () => {
            if (featuredMovieCover) {
              URL.revokeObjectURL(featuredMovieCover);
            }
          };
        } catch (error) {
          console.error("Error fetching featured cover:", error);
          setFeaturedMovieCover(movies[0].photo); // Fallback to photo
        }
      }
    };

    fetchFeaturedCover();
  }, [movies]);

  const categories = [
    { id: "all", name: "All Movies" },
    { id: "action", name: "Action" },
    { id: "drama", name: "Drama" },
    { id: "sci-fi", name: "Sci-Fi" },
    { id: "comedy", name: "Comedy" },
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchesCategory =
      selectedCategory === "all" ||
      movie.genre?.genreName?.toLowerCase() === selectedCategory;
    const matchesSearch = movie.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredMovie = movies[0] || {
    title: "Loading...",
    synopsis: "Please wait while we load the featured movie.",
    photo: "placeholder-image-url",
    duration: "--",
    rating: "--",
    genre: "--",
  };

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Movies</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredMovieCover || featuredMovie.photo}
            alt={`${featuredMovie.title} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {featuredMovie.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {featuredMovie.synopsis}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-6 text-gray-300">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {featuredMovie.duration}
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {featuredMovie.rating}
              </span>
              <span>{featuredMovie.genre?.genreName || "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-lg transition-colors duration-200">
              Book Tickets Now
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-lg backdrop-blur-sm transition-colors duration-200">
              Watch Trailer
            </button>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Now Playing</h2>
              <p className="text-gray-300 text-lg">
                Discover the latest blockbusters and indie films
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                duration={movie.duration}
                synopsis={movie.synopsis}
                photo={movie.photo} // Kept as fallback
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cinema Info Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Location Info */}
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold">Visit Us</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>123 Cinema Boulevard</p>
                <p>Downtown District</p>
                <p>Metro City, MC 12345</p>
                <p className="text-white font-semibold">
                  Open Daily: 10 AM - 12 AM
                </p>
              </div>
            </div>

            {/* Showtimes */}
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold">Today's Shows</h3>
              </div>
              <div className="space-y-3">
                {["2:00 PM", "5:30 PM", "8:00 PM", "10:45 PM"].map(
                  (time, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-700"
                    >
                      <span className="text-gray-300">{time}</span>
                      <span className="text-green-400 text-sm">Available</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Premium Experience</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>4K Dolby Vision</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Dolby Atmos Sound</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Luxury Reclining Seats</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Concession Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-red-500 mb-4">CineMax</h3>
              <p className="text-gray-300">
                Your premium cinema experience destination.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-300">
                <Link
                  to="/now-playing"
                  className="block hover:text-white transition-colors"
                >
                  Now Playing
                </Link>
                <Link
                  to="/coming-soon"
                  className="block hover:text-white transition-colors"
                >
                  Coming Soon
                </Link>
                <Link
                  to="/gift-cards"
                  className="block hover:text-white transition-colors"
                >
                  Gift Cards
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-300">
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Accessibility
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-gray-300">
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@cinemax.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CineMax. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-2xl ${
                  selectedCategory === category.id
                    ? "text-red-500"
                    : "text-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

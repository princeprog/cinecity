import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  MapPin,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const TICKET_PRICE = 350;

export default function BookTickets() {
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketCount, setTicketCount] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Add states for API data
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieCovers, setMovieCovers] = useState({});

  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch("http://localhost:8080/showtime");
        if (!response.ok) throw new Error("Failed to fetch showtimes");
        const data = await response.json();
        setShowtimes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  // Fetch movie covers
  useEffect(() => {
    const fetchMovieCovers = async () => {
      const uniqueMovies = [
        ...new Set(showtimes.map((showtime) => showtime.movie.id)),
      ];

      for (const movieId of uniqueMovies) {
        try {
          const response = await fetch(
            `http://localhost:8080/movie/${movieId}/cover`
          );
          if (!response.ok) throw new Error("Failed to fetch movie cover");
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setMovieCovers((prev) => ({ ...prev, [movieId]: imageUrl }));
        } catch (err) {
          console.error(`Error fetching cover for movie ${movieId}:`, err);
        }
      }
    };

    if (showtimes.length > 0) {
      fetchMovieCovers();
    }

    // Cleanup
    return () => {
      Object.values(movieCovers).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [showtimes]);

  // Group showtimes by movie
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const movieId = showtime.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: showtime.movie,
        showtimes: [],
      };
    }
    acc[movieId].showtimes.push(showtime);
    return acc;
  }, {});

  // Format time from "HH:mm:ss" to "HH:mm AM/PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date(2023, 0, 1, hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date from "YYYY-MM-DD" to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Update the Movie Selection section to use API data
  const renderMovieSelection = () => (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {Object.values(groupedShowtimes).map(({ movie }) => (
        <div
          key={movie.id}
          onClick={() => setSelectedMovie(movie)}
          className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
            selectedMovie?.id === movie.id ? "ring-2 ring-red-500" : ""
          }`}
        >
          <div className="aspect-[2/3] relative">
            {movieCovers[movie.id] ? (
              <img
                src={movieCovers[movie.id]}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 animate-pulse" />
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              {movie.genre.genreName}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-red-500 font-medium">
                {movie.duration} mins
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Update the Showtime Selection section to use API data
  const renderShowtimeSelection = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groupedShowtimes[selectedMovie.id].showtimes.map((showtime) => (
        <button
          key={showtime.movieCinemaId}
          onClick={() => setSelectedShowtime(showtime)}
          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            selectedShowtime?.movieCinemaId === showtime.movieCinemaId
              ? "border-red-500 bg-red-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
        >
          <div className="text-lg font-semibold">
            {formatTime(showtime.time)}
          </div>
          <div className="text-sm text-gray-400">
            {showtime.cinema.cinema_name}
          </div>
          <div className="text-sm text-red-500 mt-1">${showtime.price}</div>
        </button>
      ))}
    </div>
  );

  // Generate seat layout
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;
    const occupiedSeats = [
      "A5",
      "A6",
      "B8",
      "C3",
      "C4",
      "D10",
      "E2",
      "F7",
      "F8",
      "F9",
    ];

    return rows.map((row) => ({
      row,
      seats: Array.from({ length: seatsPerRow }, (_, i) => ({
        id: `${row}${i + 1}`,
        number: i + 1,
        occupied: occupiedSeats.includes(`${row}${i + 1}`),
        selected: selectedSeats.includes(`${row}${i + 1}`),
      })),
    }));
  };

  const seatLayout = generateSeats();

  const totalPrice = ticketCount * TICKET_PRICE;

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedMovie && ticketCount > 0;
      case 2:
        return selectedShowtime;
      case 3:
        return selectedSeats.length === ticketCount;
      case 4:
        return (
          bookingData.name &&
          bookingData.email &&
          bookingData.phone &&
          bookingData.cardNumber &&
          bookingData.expiryDate &&
          bookingData.cvv
        );
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: "Select Movie & Tickets", icon: Users },
    { number: 2, title: "Choose Showtime", icon: Clock },
    { number: 3, title: "Select Seats", icon: MapPin },
    { number: 4, title: "Payment & Confirmation", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-4 md:space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${
                      index < steps.length - 1 ? "md:mr-8" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-600"
                          : isActive
                          ? "bg-red-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium hidden md:block ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block w-16 h-0.5 ${
                        currentStep > step.number
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Movie Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Select Movie & Tickets
              </h2>

              {/* Movie Selection */}
              {renderMovieSelection()}

              {/* Ticket Selection */}
              {selectedMovie && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Select Number of Tickets
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex flex-col space-y-4">
                      {/* Price Info */}
                      <div className="flex justify-between items-center p-2 bg-gray-800 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-gray-400 text-sm">
                            Price per ticket
                          </span>
                          <span className="text-white font-semibold">
                            ₱{TICKET_PRICE.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Counter */}
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          Number of Tickets
                        </span>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              setTicketCount(Math.max(0, ticketCount - 1))
                            }
                            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white font-semibold text-xl w-12 text-center">
                            {ticketCount}
                          </span>
                          <button
                            onClick={() => setTicketCount(ticketCount + 1)}
                            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Summary */}
                      {ticketCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Tickets ({ticketCount} × ₱{TICKET_PRICE})
                              </span>
                              <span className="text-white">
                                ₱{(ticketCount * TICKET_PRICE).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                              <span className="text-white font-medium">
                                Total Amount
                              </span>
                              <span className="text-red-500 font-bold text-xl">
                                ₱{totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Step 2: Showtime Selection */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Choose Showtime
              </h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-6">
                  {selectedMovie && movieCovers[selectedMovie.id] && (
                    <img
                      src={movieCovers[selectedMovie.id]}
                      alt={selectedMovie.title}
                      className="w-20 h-28 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {selectedMovie.title}
                    </h3>
                    <p className="text-gray-400">
                      {selectedMovie.genre.genreName} • {selectedMovie.duration}{" "}
                      mins
                    </p>
                    <p className="text-red-500">
                      {ticketCount} tickets selected
                    </p>
                  </div>
                </div>

                {selectedMovie && renderShowtimeSelection()}
              </div>
            </div>
          )}
          {/* Step 3: Seat Selection */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Select Your Seats
              </h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="mb-6 text-center">
                  <div className="bg-gradient-to-b from-gray-600 to-gray-700 h-4 rounded-t-full mx-auto w-48 mb-4"></div>
                  <span className="text-gray-400 text-sm">SCREEN</span>
                </div>

                <div className="space-y-3 mb-6">
                  {seatLayout.map((row) => (
                    <div
                      key={row.row}
                      className="flex justify-center items-center space-x-2"
                    >
                      <span className="text-gray-400 w-4 text-center font-medium">
                        {row.row}
                      </span>
                      <div className="flex space-x-1">
                        {row.seats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() =>
                              !seat.occupied && handleSeatClick(seat.id)
                            }
                            disabled={seat.occupied}
                            className={`w-8 h-8 rounded-t-lg text-xs font-medium transition-all duration-200 ${
                              seat.occupied
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : selectedSeats.includes(seat.id)
                                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-t-lg"></div>
                    <span className="text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-t-lg"></div>
                    <span className="text-gray-400">Selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-600 rounded-t-lg"></div>
                    <span className="text-gray-400">Occupied</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        Selected Seats: {selectedSeats.join(", ")}
                      </span>
                      <span className="text-red-500 font-bold">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Step 4: Payment & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Payment & Confirmation
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Booking Summary */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Movie:</span>
                      <span className="text-white">{selectedMovie.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Showtime:</span>
                      <span className="text-white">
                        {selectedShowtime.time} - {selectedShowtime.theater}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seats:</span>
                      <span className="text-white">
                        {selectedSeats.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tickets:</span>
                      <span className="text-white">{ticketCount} tickets</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price per ticket:</span>
                      <span className="text-white">
                        ${selectedShowtime.price}
                      </span>
                    </div>
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-white">Total:</span>
                        <span className="text-red-500">${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Payment Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={bookingData.cardNumber}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            cardNumber: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={bookingData.expiryDate}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              expiryDate: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={bookingData.cvv}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              cvv: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={
                currentStep === 4
                  ? () => alert("Booking Confirmed!")
                  : handleNext
              }
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                canProceed()
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>
                {currentStep === 4 ? "Confirm Booking" : "Next"}{" "}
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

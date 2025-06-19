import { useEffect, useState } from 'react';

export default function Home() {
    const [movies] = useState([
        {
            id: 1,
            title: "Inception",
            image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3",
            genre: "Sci-Fi",
            rating: "8.8"
        },
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="relative h-[90vh] bg-black">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="text-white space-y-6 max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Experience Cinema Like Never Before
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300">
                            Discover the latest movies and book your tickets for an unforgettable experience.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-medium transition duration-300">
                                Book Now
                            </button>
                            <button className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-medium transition duration-300">
                                View Movies
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-8">Now Showing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden group hover:scale-105 transition duration-300">
                            <div className="relative aspect-[2/3]">
                                <img 
                                    src={movie.image} 
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                                        <div className="flex justify-between text-sm text-gray-300 mt-2">
                                            <span>{movie.genre}</span>
                                            <span>⭐ {movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Premium Seating", icon: "🪑", description: "Experience comfort with our luxury seats" },
                            { title: "Dolby Atmos", icon: "🔊", description: "Immersive sound experience" },
                            { title: "4K Projection", icon: "🎥", description: "Crystal clear picture quality" }
                        ].map((feature, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition duration-300">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
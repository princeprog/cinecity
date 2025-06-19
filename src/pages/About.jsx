import React from 'react';
import { Calendar, Users, Star, Shield, Clock, MapPin, Phone, Mail } from 'lucide-react';
import placeholderImage from '../assets/profile.jpg';

const About = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Efficient showtime management across all screens with automated scheduling."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description: "Track bookings, preferences, and provide personalized movie recommendations."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Experience",
      description: "Support for IMAX, premium seating, and VIP experiences."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple payment options."
    }
  ];

  const stats = [
    { number: "50K+", label: "Monthly Bookings" },
    { number: "15+", label: "Cinema Partners" },
    { number: "100K+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime Reliability" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: placeholderImage
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      image: placeholderImage
    },
    {
      name: "Emily Thompson",
      role: "Head of Product",
      image: placeholderImage
    },
    {
      name: "David Park",
      role: "Head of Engineering",
      image: placeholderImage
    }
  ];

  const missionText = {
    primary: "We believe that going to the movies should be effortless and enjoyable.",
    secondary: "Our mission is to create the most intuitive cinema management platform."
  };

  return (
    <div className="min-h-screen bg-black text-white">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-gray-900"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
              <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <div className="mb-8">
                  <span className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-sm font-medium mb-4">
                      About CineCity
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                      Revolutionizing Cinema
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                      The most advanced cinema booking management system, trusted by theaters worldwide to deliver exceptional movie experiences.
                  </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span>Founded in 2019</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div className="flex items-center space-x-2 text-gray-400">
                      <MapPin className="w-5 h-5" />
                      <span>San Francisco, CA</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                  <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-5 h-5" />
                      <span>200+ Employees</span>
                  </div>
              </div>
          </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {missionText.primary}
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                {missionText.secondary}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent rounded-lg transform rotate-3"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg border border-gray-700">
                <h3 className="text-2xl font-semibold mb-4 text-white">Why Choose CineCity?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Real-time inventory management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Multi-location support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful tools designed to streamline operations and enhance the customer experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 hover:border-red-600/50 transition-all duration-300">
                <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The passionate individuals behind CineCity's success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-4 mx-auto w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full rounded-full object-cover border-2 border-gray-700 group-hover:border-red-500 transition-colors duration-300"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-red-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Ready to transform your cinema experience? We'd love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Phone className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Mail className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400">hello@cinecity.com</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <MapPin className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Address</h3>
              <p className="text-gray-400">San Francisco, CA</p>
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
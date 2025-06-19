import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 20);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActiveRoute = (path) => {
    if (path === "Home") {
      return location.pathname === "/" ? "text-red-500" : "text-gray-300";
    }
    return location.pathname === `/${path.toLowerCase().replace(" ", "-")}`
      ? "text-red-500"
      : "text-gray-300";
  };

  const navItems = ["Home", "Movies", "Showtimes", "Book Tickets", "About"];

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-sm shadow-lg py-4"
            : "bg-gradient-to-b from-black/80 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                  CineCity
                </span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item}
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className={`${isActiveRoute(
                      item
                    )} hover:text-white px-3 py-2 text-sm font-medium relative group transition-colors duration-300`}
                  >
                    {item}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Link
                  to="/login"
                  className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 ease-out border-2 border-red-600 rounded-full shadow-md group hover:ring-2 hover:ring-red-500 hover:ring-offset-2 hover:ring-offset-black"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                    Login
                  </span>
                  <span className="relative invisible">Login</span>
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${
                      isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-2"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${
                      isOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${
                      isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-2"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          } fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out`}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className={`${isActiveRoute(
                    item
                  )} text-2xl font-medium hover:text-white px-3 py-4 transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/login"
                className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="min-h-screen pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;

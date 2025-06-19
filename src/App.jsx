import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Movies from "./pages/Movies";
import Showtimes from "./pages/Showtimes";
import BookTickets from "./pages/BookTickets";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies/>}/>
        <Route path="showtimes" element={<Showtimes/>}/>
        <Route path="book-tickets" element={<BookTickets/>}/>
        <Route path="about" element={<About/>} />
      </Route>
      <Route path="/login" element={<Login/>} />
    </Routes>
  );
}

export default App;

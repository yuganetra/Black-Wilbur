// CPUI

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Footer from "./component/Footer";
import Collection from "./component/Collection";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection category="collection" />} />
          <Route path="/oversize" element={<Collection category="oversize" />} />
          <Route path="/round-neck" element={<Collection category="round-neck" />} />
          <Route path="/polo" element={<Collection category="polo" />} />
          <Route path="/knitted" element={<Collection category="knitted" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

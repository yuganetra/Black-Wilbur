import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Footer from "./component/Footer";
import Productpage from "./component/Productpage";
import Checkout from "./component/Checkout";
import AboutUs from "./component/Aboutus";
import TermsAndConditions from "./pages/Policies/TermsAndConditions";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy";
import ReturnPolicy from "./pages/Policies/ReturnPolicy";
import ScrollToTop from "./utiles/ScrollToTop";
import Collection from "./component/Collection";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection category="collection" />} />
          <Route path="/oversize" element={<Collection category="oversize" />} />
          <Route path="/round-neck" element={<Collection category="round-neck" />} />
          <Route path="/polo" element={<Collection category="polo" />} />
          <Route path="/knitted" element={<Collection category="knitted" />} />
          <Route path="/product/:id" element={<Productpage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/terms-and-condition" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

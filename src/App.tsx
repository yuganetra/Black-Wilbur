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
import Userprofile from "./component/Userprofile";
import Authentication from "./component/Authentication";
import AdminPanel from "./admin/adminPanel";
import OrderConfirmation from "./component/OrderConfirmation";
import OrderFailure from "./component/OrderFailure";
import PrivateRoute from "././utiles/PrivateRoute"; // Import the PrivateRoute

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Protect the admin route with PrivateRoute */}
          <Route path="/admin/*" element={<PrivateRoute />}>
  <Route path="*" element={<AdminPanel />} />
</Route>

          {/* All other routes */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/collection/:category?"
                    element={<Collection />}
                  />
                  <Route path="/product/:id" element={<Productpage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about-us/:section?" element={<AboutUs />} />
                  <Route
                    path="/terms-and-condition"
                    element={<TermsAndConditions />}
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/user-profile" element={<Userprofile />} />
                  <Route path="/auth/login" element={<Authentication />} />
                  <Route path="/auth/signup" element={<Authentication />} />
                  {/* Update the OrderConfirmation route to accept orderId from URL */}
                  <Route
                    path="/orderConfirmation/:orderId"
                    element={<OrderConfirmation paymentMethod={""} />}
                  />
                  <Route path="orderFailure" element={<OrderFailure />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

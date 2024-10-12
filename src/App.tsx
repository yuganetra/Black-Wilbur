import "./App.css";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Footer from "./component/Footer";
import SidebarMenu from "./component/Sidebar-Menu";
import Productpage from "./component/Productpage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      {/* <Productpage/> */}
      <Footer />
    </div>
  );
}

export default App;

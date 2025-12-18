import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home/Home";
import Cart from "./components/pages/Cart/Cart";
import PlaceOrder from "./components/pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/Loginpopup/Loginpopup";
import StoreContextProvider from "./context/StoreContext";
import Verify from "./components/pages/Verify/Verify";
import MyOrders from "./components/pages/myOrders/MyOrders";


function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <StoreContextProvider>
    {showLogin? <LoginPopup setShowLogin={setShowLogin}/>: null}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify/>} />
         <Route path="/myorders" element={<MyOrders/>}/>
        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
}

export default App;

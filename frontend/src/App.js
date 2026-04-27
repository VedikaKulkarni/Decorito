
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Maincategory from './pages/Maincategory';
import Landingpage from './landing-page/Landingpage';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import CheckoutPage from './pages/Checkout';
import OrderConfirmationPage from './pages/OrderPlaced';
import CartPage from './pages/Cart/CartPage';
import UserDashboard from "./user_dashboard/UserDashboard";
import AddProduct from "./pages/AddProduct";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import ChatPage from "./pages/ChatPage";
import GlobalNotification from "./components/GlobalNotification";
import { useEffect } from 'react';
import { Navigate } from "react-router-dom";

function UserRoute({ children }) {
  const role = sessionStorage.getItem("userRole");
  if (role === "shopkeeper") {
    return <Navigate to="/shopkeeper-dashboard" replace />;
  }
  return children;
}

function ShopkeeperRoute({ children }) {
  const role = sessionStorage.getItem("userRole");
  if (role !== "shopkeeper") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {

  function checkLoginStatus() {
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("expiry");

  if (!token || !expiry || Date.now() > expiry) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiry");
    sessionStorage.setItem("isLoggedIn", false);
    return false;
  }
  return true;
}
useEffect(() => {
  checkLoginStatus();
}, []);


  return (
   <>
   <Router>
    <GlobalNotification />
    <Routes>
      <Route  path="/signin" element={<Signin/>}/>
      <Route  path="/signup" element={<Signup/>}/>
      <Route path="/" element={<UserRoute><Landingpage/></UserRoute>}/>
      <Route path="/maincategory" element={<UserRoute><Maincategory/></UserRoute>}/>
      <Route path="/category/:categoryName" element={<UserRoute><CategoryPage/></UserRoute>}/>
      <Route path="/product/:id" element={<UserRoute><ProductDetails/></UserRoute>}/>
      <Route path="/order/:id" element={<UserRoute><CheckoutPage/></UserRoute>}/>
      <Route path="/checkout" element={<UserRoute><CheckoutPage/></UserRoute>}/>
      <Route path="/order-confirmation/:orderId" element={<UserRoute><OrderConfirmationPage /></UserRoute>} />
      <Route path="/cartpage" element={<UserRoute><CartPage/></UserRoute>}/>
      <Route path="/user-dashboard" element={<UserRoute><UserDashboard/></UserRoute>}/>
      
      <Route path="/shopkeeper-dashboard" element={<ShopkeeperRoute><ShopkeeperDashboard/></ShopkeeperRoute>}/>
      <Route path="/add-product" element={<ShopkeeperRoute><AddProduct/></ShopkeeperRoute>}/>
      
      <Route path="/chat/:orderId/:shopkeeperId" element={<ChatPage />} />
    </Routes>
   </Router>
   </>
  );
}

export default App;

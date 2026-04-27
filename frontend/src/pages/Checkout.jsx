import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "./Cart/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51TQLS9HOcm9dVWsiU5GHovTohrM8hlUHMsNE8nK32TVgvroWvBCrvAbc7IGNE8b6A3LhX4EFEDbJSXEiG9f02rM200huZAOFmY");

export default function CheckoutPage() {
  const { id } = useParams(); // productId if coming from "Buy Now"
  const { cart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const token = sessionStorage.getItem("token");
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // fetch addresses
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/getaddress", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend might return { addresses: [...] } or just [...]
        const arr = Array.isArray(data?.addresses) ? data.addresses : Array.isArray(data) ? data : [];
        setAddresses(arr);
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, [token]);

  // auto-select first address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  // fetch product if "buy now"
  useEffect(() => {
    if (!id) return; // no direct product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/getproduct/${id}`);
        const data = await res.json();
        if (res.ok) setProduct(data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (id && product && !quantities[product._id]) {
      setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    } else if (!id && cart.length > 0) {
      setQuantities((prev) => {
        const newQ = { ...prev };
        let changed = false;
        cart.forEach((item) => {
          if (!newQ[item.productId._id]) {
            newQ[item.productId._id] = item.quantity;
            changed = true;
          }
        });
        return changed ? newQ : prev;
      });
    }
  }, [id, cart, product]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const updated = current + delta;
      if (updated < 1) return prev;
      return { ...prev, [productId]: updated };
    });
  };

  // calculate totals
  const subtotal = id && product
    ? parseInt(product.price, 10) * (quantities[product._id] || 1)
    : cart.reduce((acc, item) => acc + item.productId.price * (quantities[item.productId._id] || item.quantity), 0);

  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (paymentMethod === "Stripe Card" && total > 0) {
      const payload = id
        ? { id, quantities }
        : { items: cart.map(item => ({ productId: item.productId._id, quantity: item.quantity })), quantities };
        
      fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      .then(res => res.json())
      .then(data => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
      })
      .catch(console.error);
    }
  }, [paymentMethod, total, id, cart, quantities, token]);

  // Place Order (supports direct-buy and cart)
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    try {
      const payload = id
        ? { productId: product._id, quantity: quantities[product._id] || 1, addressId: selectedAddress._id, paymentMethod }
        : {
            items: cart.map((item) => ({ productId: item.productId._id, quantity: quantities[item.productId._id] || item.quantity })),
            addressId: selectedAddress._id,
            paymentMethod,
          };

      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Order placed successfully");
        window.location.href = "/order-confirmation/" + data.orderId;
      } else {
        alert(data.message || "Error placing order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order");
    }
  };

  // ----------- NEW: handleAddAddress -----------
  const handleAddAddress = async () => {
    if (!token) {
      alert("You must be logged in to add address");
      return;
    }

    // basic client-side validation (optional)
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine) {
      alert("Please fill at least name, phone and address line");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/saveaddress", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAddress),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error adding address");
        return;
      }

      // backend might return { address: {...} } or just the address object
      const savedAddress = data?.address ?? data;

      // ensure address has an _id
      if (!savedAddress || !savedAddress._id) {
        console.warn("Unexpected address response:", data);
        alert("Address saved but response format unexpected. Refresh to see updates.");
        return;
      }

      setAddresses((prev) => [...prev, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowNewAddressForm(false);
      setNewAddress({ fullName: "", phone: "", pincode: "", addressLine: "", city: "", state: "" });
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Error adding address");
    }
  };
  // ----------------------------------------------

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FFF8F0] py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Order Items + Address + Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#411900]">Order Summary</h3>
              {id ? (
                product ? (
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow" />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gray-600">₹{product.price}</p>
                      <div className="flex items-center space-x-3 mt-3">
                        <button onClick={() => handleQuantityChange(product._id, -1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold text-gray-600 shadow-sm transition-colors">-</button>
                        <span className="font-semibold text-lg min-w-[20px] text-center">{quantities[product._id] || 1}</span>
                        <button onClick={() => handleQuantityChange(product._id, 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold text-gray-600 shadow-sm transition-colors">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold text-lg">₹{parseInt(product.price, 10) * (quantities[product._id] || 1)}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading product...</p>
                )
              ) : cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.productId._id} className="flex items-center space-x-4 border-b last:border-none pb-4 mb-4">
                    <img src={item.productId.image} alt={item.productId.name} className="w-20 h-20 object-cover rounded-lg shadow" />
                    <div className="flex-1">
                      <p className="font-medium">{item.productId.name}</p>
                      <p className="text-sm text-gray-600">₹{item.productId.price}</p>
                      <div className="flex items-center space-x-3 mt-3">
                        <button onClick={() => handleQuantityChange(item.productId._id, -1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold text-gray-600 shadow-sm transition-colors">-</button>
                        <span className="font-semibold text-lg min-w-[20px] text-center">{quantities[item.productId._id] || item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId._id, 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 font-bold text-gray-600 shadow-sm transition-colors">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold text-lg">₹{item.productId.price * (quantities[item.productId._id] || item.quantity)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#411900]">Delivery Address</h3>

              <select
                className="w-full p-3 border rounded-lg mb-4"
                value={addresses.findIndex(a => selectedAddress && a._id === selectedAddress._id) ?? ""}
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  if (!Number.isNaN(idx)) setSelectedAddress(addresses[idx]);
                }}
              >
                <option value="">Select saved address</option>
                {Array.isArray(addresses) &&
                  addresses.map((addr, idx) => (
                    <option key={addr._id} value={idx}>
                      {addr.fullName}, {addr.addressLine}, {addr.city}
                    </option>
                  ))}
              </select>

              <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className="text-[#411900] underline">
                + Add New Address
              </button>

              {showNewAddressForm && (
                <div className="space-y-3 border p-4 rounded-lg bg-gray-50 mt-4">
                  {["fullName", "phone", "pincode", "addressLine", "city", "state"].map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full p-2 border rounded"
                      value={newAddress[field]}
                      onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                    />
                  ))}
                  <button onClick={handleAddAddress} className="w-full bg-[#411900] text-white py-2 rounded-lg font-medium">
                    Save Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-[#411900]">Payment Method</h3>
              <div className="space-y-3">
                {["COD", "Stripe Card"].map((method) => (
                  <label key={method} className="flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    <span>{method === "COD" ? "Cash on Delivery" : "Credit/Debit Card (Stripe)"}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === "Stripe Card" && clientSecret && (
                <div className="mt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm onSuccess={placeOrder} isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
                  </Elements>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Price Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-semibold mb-4 text-[#411900]">Price Summary</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              {paymentMethod !== "Stripe Card" && (
                <button onClick={placeOrder} className="mt-6 w-full bg-[#411900] text-white py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform">
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

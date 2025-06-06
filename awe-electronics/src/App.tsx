import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Login from "./pages/Login";
import Products from "./pages/customer/Products";
import Checkout from "./pages/customer/Checkout";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import ProductManagement from "./pages/employee/ProductManagement";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import { QueryClientProvider } from "@tanstack/react-query";

/**
 * Main App component
 * 
 * Prototype to showcase 4 key scenarios:
 * 1. User can browse catalogue and add items to cart (Products page)
 * 2. User can select a payment method (Checkout page)
 * 3. Receipt generator via Observer pattern (OrderConfirmation page)
 * 4. Employee updates product description (ProductManagement page)
 */

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* Customer Routes - Browsing */}
              <Route 
                path="/products" 
                element={
                  <MainLayout>
                    <Products />
                  </MainLayout>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                } 
              />
              <Route 
                path="/order-confirmation/:id" 
                element={
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                } 
              />

              {/* Employee Route */}
              <Route 
                path="/product-management" 
                element={
                  <MainLayout>
                    <ProductManagement />
                  </MainLayout>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

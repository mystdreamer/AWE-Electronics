import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/employee/Dashboard";
// import Products from "./pages/customer/Products";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/employee/dashboard" element={<Dashboard />} />
          <Route path="/customer/products" element={<Products />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


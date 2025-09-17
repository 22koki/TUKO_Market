import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OnboardVendor from "./pages/OnboardVendor";

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/onboard-vendor" element={<OnboardVendor/>}/>
          <Route path="/" element={<div className="p-6">Welcome to Tuko Market (Demo)</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);


import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Resource from "./pages/Resource";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/forgotpassword";
import Question from "./pages/Question";
import TaxForm1 from "./pages/TaxForm1";
import TaxForm2 from "./pages/TaxForm2";
import TaxForm3 from "./pages/TaxForm3";
import TaxForm4 from "./pages/TaxForm4";

function App() {

  const [formData, setFormData] = useState({});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path ="/signin" element={<SignIn />} />
        <Route path = "/forgot-password" element ={<ForgotPassword />}  />
        <Route path="/resource" element={<Resource />} />
        <Route path="/question" element={<Question formData={formData} setFormData={setFormData} />} />
        <Route path="/taxform1" element={<TaxForm1 />} />
        <Route path="/taxform2" element={<TaxForm2 />} />
        <Route path="/taxform3" element={<TaxForm3 />} />
        <Route path="/taxform4" element={<TaxForm4 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

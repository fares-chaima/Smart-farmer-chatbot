import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx'
import WhoWeAre from './components/WhoWeAre.jsx';
import OurServices from './components/OurServices.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx'
import NavBbar from './components/NavBbar.jsx';
import Marketplace from './Pages/Marketplace.jsx'
import Payment from './Pages/Payment.jsx';
import Bid from './Pages/Bid.jsx';
import Profile from './Pages/Profile.jsx'
import Material from './Pages/Material.jsx'

import MyLands from './Pages/MyLands.jsx';
import ExploreLand from './Pages/ExploreLand.jsx';
import Livraison from './Pages/Livraison.jsx';
import Services from './Pages/Services.jsx';
import CreatePost from './Pages/CreatePost.jsx';
import BrowsePosts from './Pages/BrowsePosts.jsx';
import Dashboard from './Pages/Dashboard.jsx'
import Chat from './Pages/Chat.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import PaymentCancel from './components/PaymentCancel.jsx'
function App() {
  
  return (
 
  
  <Router>
  <div className="App">
    <Routes>
     <Route
           path="/"
           element={
             <>
             <Navbar />
               <Header />
               <WhoWeAre />
               <OurServices />
               <Contact />
               <Footer />
             </>
           }
         /> 
      <Route path="/marketplace" element={<Marketplace />} />
     
     <Route path="/payment" element={<Payment />} />
     <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentCancel />} />
      <Route path="/bid" element={<Bid />} />
      <Route path="/profile" element={<Profile/>} />
     <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} /> 
      
        <Route path="/my-lands" element={<MyLands />} />
        <Route path="/explorer" element={<ExploreLand />} />
        <Route path="/material" element={<Material/>} />
        <Route path="/livraison" element={<Livraison/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/chat" element={<Chat />} />
         
          <Route path="/dashboard" element={<Dashboard />} />
      
    </Routes>
   </div>
</Router>
  );
}

export default App;